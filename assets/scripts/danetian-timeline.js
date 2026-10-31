/* Chronological dots never move. Cards can move to avoid collisions; SVG ties them back to the true month. */
(() => {
  const timeline = document.getElementById('danetian-timeline');
  if (!timeline) return;
  const svg = timeline.querySelector('.dt-connectors');
  const periodRail = timeline.querySelector('.dt-period-rail');
  const periods = periodRail ? [...periodRail.querySelectorAll('.dt-period-segment')] : [];
  const events = [...timeline.querySelectorAll('.dt-event')];
  if (!events.length) return;
  const parseMonth = str => {
    const [year, month] = str.split('-').map(Number);
    return { year, month };
  };
  const monthIndex = str => {
    const { year, month } = parseMonth(str);
    return year * 12 + (month - 1);
  };
  const startMonth = Math.min(...events.map(e => monthIndex(e.dataset.date)));
  const endMonth = Math.max(...events.map(e => monthIndex(e.dataset.date)));
  function layout() {
    const style = getComputedStyle(timeline);
    const monthPixels = Number(style.getPropertyValue('--months-px').trim()) || 32;
    const axisX = parseFloat(style.getPropertyValue('--axis-x')) || 26;
    const cardLeft = parseFloat(style.getPropertyValue('--card-left')) || 76;
    const gap = 16;
    const padTop = 28;
    // Month ticks remain at their real positions. Years float within their year boundaries.
    timeline.querySelectorAll('.dt-month-label, .dt-year-segment').forEach(node => node.remove());
    const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    for (let index = startMonth; index <= endMonth; index++) {
      const label = document.createElement('span');
      label.className = 'dt-month-label';
      label.setAttribute('aria-hidden','true');
      label.style.top = `${padTop + (index - startMonth) * monthPixels}px`;
      label.textContent = monthNames[index % 12];
      timeline.appendChild(label);
    }
    // Bounded calendar-year segments, analogous to the colored period segments.
    // A floating year label is clipped to its own segment and cannot drift into January of the next year.
    const firstYear = Math.floor(startMonth / 12);
    const lastYear = Math.floor(endMonth / 12);
    for (let year = firstYear; year <= lastYear; year++) {
      const segment = document.createElement('div');
      segment.className = 'dt-year-segment';
      segment.setAttribute('aria-hidden','true');
      const from = Math.max(year * 12, startMonth);
      const to = Math.min((year + 1) * 12, endMonth + 1);
      segment.style.top = `${padTop + (from - startMonth) * monthPixels}px`;
      segment.style.height = `${(to - from) * monthPixels}px`;
      const label = document.createElement('span');
      label.className = 'dt-year-float';
      label.textContent = String(year);
      segment.appendChild(label);
      timeline.appendChild(segment);
    }
    let bottom = 0;
    const positions = [];
    for (const event of events) {
      const card = event.querySelector('.dt-card');
      const height = card.offsetHeight;
      const targetY = padTop + (monthIndex(event.dataset.date) - startMonth) * monthPixels;
      const cardTop = Math.max(targetY - height / 2, bottom + gap);
      // Dot remains exactly proportional to elapsed time, at the month level, regardless of card collisions.
      event.style.top = `${cardTop}px`;
      event.style.setProperty('--dot-y', `${targetY - cardTop - 7}px`);
      bottom = cardTop + height;
      positions.push({ targetY, cardY: cardTop + height / 2, color: getComputedStyle(event).getPropertyValue('--period-color').trim() });
    }
    const height = Math.max(bottom + 45, positions.at(-1).targetY + 55);
    timeline.style.height = `${height}px`;
    if (periodRail) {
      for (const [segmentIndex, segment] of periods.entries()) {
        const from = Math.max(monthIndex(segment.dataset.start), startMonth);
        const to = Math.min(monthIndex(segment.dataset.end), endMonth);
        const y0 = padTop + (from - startMonth) * monthPixels;
        const next = periods[segmentIndex + 1];
        const nextStart = next ? monthIndex(next.dataset.start) : endMonth + 1;
        const y1 = padTop + (Math.min(to + 1, nextStart) - startMonth) * monthPixels;
        segment.style.top = `${y0}px`;
        segment.style.height = `${Math.max(0, y1 - y0)}px`;
      }
    }
    svg.setAttribute('viewBox', `0 0 ${Math.max(timeline.clientWidth, 1)} ${height}`);
    svg.replaceChildren();
    updateFloatingLabels();
    // One trunk per month, with short branches to every card in that month.
    // This replaces the separate parallel stems previously drawn for each event.
    const byMonth = new Map();
    for (const point of positions) {
      if (!byMonth.has(point.targetY)) byMonth.set(point.targetY, []);
      byMonth.get(point.targetY).push(point);
    }
    const drawPath = (d, color) => {
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', d);
      path.setAttribute('fill', 'none');
      path.setAttribute('stroke', color);
      path.setAttribute('stroke-width', '1.6');
      path.setAttribute('opacity', '.7');
      svg.appendChild(path);
    };
    const x0 = axisX + 7;
    const cardX = cardLeft - 6;
    // A calendar month gets exactly one common stem. When stems belonging to
    // DIFFERENT months overlap vertically, place them in distinct lanes rather
    // than painting several lines on top of one another.
    const groups = [...byMonth].map(([targetY, group]) => ({
      targetY, group,
      low: Math.min(targetY, ...group.map(p => p.cardY)),
      high: Math.max(targetY, ...group.map(p => p.cardY))
    }));
    const lanes = [];
    const gapBetweenStems = 5;
    const available = Math.max(12, cardX - x0 - 8);
    const laneSpacing = Math.max(5, Math.min(10, available / 5));
    for (const item of groups) {
      let lane = lanes.findIndex(high => high + gapBetweenStems < item.low);
      if (lane < 0) lane = lanes.length;
      lanes[lane] = item.high;
      item.lane = lane;
    }
    const maxLane = Math.max(0, ...groups.map(g => g.lane));
    // Spread occupied lanes across the available gutter when necessary.
    const step = Math.min(laneSpacing, available / Math.max(1, maxLane + 1));
    for (const {targetY, group, high, lane} of groups) {
      const stemX = x0 + 9 + lane * step;
      const color = group[0].color;
      drawPath(`M ${x0} ${targetY} H ${stemX} V ${high}`, color);
      for (const point of group) {
        drawPath(`M ${stemX} ${point.cardY} H ${cardX}`, point.color);
      }
    }

  }
  function updateFloatingLabels() {
    const timelineRect = timeline.getBoundingClientRect();
    // Follow the reading position near the top of the viewport; clamp at the timeline's start.
    // The first year presses against the beginning of the chronology until
    // scrolling has brought the reading position down to it. Never hide it
    // just because the viewport focus lies above the first year section.
    const firstSegment = timeline.querySelector('.dt-year-segment');
    const lowerBoundary = firstSegment ? firstSegment.offsetTop + 0.5 : 0;
    const followOffset = parseFloat(getComputedStyle(timeline).getPropertyValue('--follow-offset')) || 190;
    const focus = Math.max(lowerBoundary, followOffset - timelineRect.top);
    // Only the calendar year containing the viewport focus is visible.
    // Unlike clamping every year at its boundaries, this cannot leave 2016
    // beside January 2017 or pile two year labels together.
    const yearSegments = [...timeline.querySelectorAll('.dt-year-segment')];
    for (const segment of yearSegments) {
      const within = focus >= segment.offsetTop && focus < segment.offsetTop + segment.offsetHeight;
      segment.classList.toggle('dt-year-active', within);
      if (within) {
        const label = segment.querySelector('.dt-year-float');
        const usable = Math.max(0, segment.offsetHeight - label.offsetHeight);
        label.style.top = `${Math.max(0, Math.min(focus - segment.offsetTop, usable))}px`;
      }
    }
    if (!periodRail) return;
    // The pill may follow the viewport only while there is room within its own period.
    // Clamp its CENTER to the segment, with a small gap at each boundary.
    const margin = 16;
    for (const segment of periods) {
      const label = segment.querySelector('.dt-period-floating-label');
      if (!label) continue;
      const height = segment.offsetHeight;
      const labelHeight = label.offsetHeight;
      if (height <= labelHeight + 2 * margin) {
        label.style.display = 'none';
        continue;
      }
      label.style.display = '';
      const pos = Math.max(margin, Math.min(focus - segment.offsetTop - labelHeight / 2, height - labelHeight - margin));
      label.style.top = `${pos}px`;
    }
  }
  window.addEventListener('scroll', updateFloatingLabels, { passive: true });
  let frame = 0;
  const schedule = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(layout); };
  window.addEventListener('resize', schedule, { passive: true });
  if (document.fonts) document.fonts.ready.then(schedule);
  schedule();
})();
