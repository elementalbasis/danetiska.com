/* Chronological, content-driven timeline. No proportional gaps or scroll handlers. */
(() => {
  const timeline = document.getElementById('danetian-timeline');
  if (!timeline) return;

  const svg = timeline.querySelector('.dt-connectors');
  const rail = timeline.querySelector('.dt-period-rail');
  const segments = rail ? [...rail.querySelectorAll('.dt-period-segment')] : [];
  // Labels must be siblings of the period segments: a sticky child of a
  // segment is forced to stop at the segment's bottom instead of being covered.
  const labels = segments.map((segment, i) => {
    const label = segment.querySelector('.dt-period-floating-label');
    if (label) {
      label.style.setProperty('--period-color', segment.style.getPropertyValue('--period-color'));
      rail.appendChild(label);
      label.style.zIndex = String(2 * i + 2); // Next band covers this label.
    }
    return label;
  });
  const events = [...timeline.querySelectorAll('.dt-event')];
  if (!events.length) return;

  const monthKey = date => date.slice(0, 7);
  const yearKey = date => date.slice(0, 4);
  const monthName = date =>
    ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][Number(date.slice(5, 7)) - 1];

  function drawPath(path, color) {
    const node = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    node.setAttribute('d', path);
    node.setAttribute('fill', 'none');
    node.setAttribute('stroke', color);
    node.setAttribute('stroke-width', '1.7');
    node.setAttribute('stroke-linejoin', 'round');
    svg.appendChild(node);
  }

  function layout() {
    const css = getComputedStyle(timeline);
    const axisX = parseFloat(css.getPropertyValue('--axis-x')) || 100;
    const cardLeft = parseFloat(css.getPropertyValue('--card-left')) || 160;
    const cardGap = parseFloat(css.getPropertyValue('--event-gap')) || 14;
    const monthGap = parseFloat(css.getPropertyValue('--month-gap')) || 34;
    const yearGap = parseFloat(css.getPropertyValue('--year-gap')) || 16;

    timeline.querySelectorAll('.dt-month-label, .dt-year-segment').forEach(el => el.remove());
    const groups = [];
    let previousMonth = null;
    let previousYear = null;
    let bottom = 24;

    for (const event of events) {
      const date = event.dataset.date;
      const month = monthKey(date);
      const year = yearKey(date);
      const sameMonth = month === previousMonth;
      if (previousMonth !== null) bottom += sameMonth ? cardGap : monthGap + (year !== previousYear ? yearGap : 0);

      const card = event.querySelector('.dt-card');
      const height = card.offsetHeight;
      const center = bottom + height / 2;
      event.style.top = `${bottom}px`;
      event.style.setProperty('--dot-y', `${height / 2 - 8}px`);
      const color = getComputedStyle(event).getPropertyValue('--period-color').trim();

      if (!sameMonth) {
        groups.push({ date, center, color, members: [] });
        const label = document.createElement('span');
        label.className = 'dt-month-label';
        label.setAttribute('aria-hidden', 'true');
        label.textContent = monthName(date);
        label.style.top = `${center}px`;
        timeline.appendChild(label);

        if (year !== previousYear) {
          const yr = document.createElement('span');
          yr.className = 'dt-year-marker';
          yr.setAttribute('aria-hidden', 'true');
          yr.textContent = year;
          yr.style.top = `${center}px`;
          timeline.appendChild(yr);
        }
      }
      groups[groups.length - 1].members.push({ center, event });
      event.querySelector('.dt-point').style.visibility = sameMonth ? 'hidden' : 'visible';
      bottom += height;
      previousMonth = month;
      previousYear = year;
    }

    const height = bottom + 36;
    timeline.style.height = `${height}px`;
    svg.setAttribute('viewBox', `0 0 ${Math.max(timeline.clientWidth, 1)} ${height}`);
    svg.replaceChildren();

    const axisEnd = axisX + 8;
    const stemX = axisEnd + Math.max(10, (cardLeft - axisEnd) * .43);
    const cardEdge = cardLeft - 6;
    for (const group of groups) {
      const lastCenter = group.members[group.members.length - 1].center;
      // One common stem per calendar month. A new month starts after the
      // preceding month finishes, so trunks cannot cross or overlap.
      drawPath(`M ${axisEnd} ${group.center} H ${stemX}${group.members.length > 1 ? ` V ${lastCenter}` : ''}`, group.color);
      for (const member of group.members) {
        drawPath(`M ${stemX} ${member.center} H ${cardEdge}`, group.color);
      }
    }

    // Period bands occupy contiguous ranges of event groups. Their labels are
    // independent sticky siblings. Each incoming opaque band covers the
    // preceding label before its own label takes over, with no scroll handler.
    let flowBottom = 0;
    for (let i = 0; i < segments.length; i++) {
      const segment = segments[i];
      const first = groups.find(g => g.date >= segment.dataset.start.slice(0, 7));
      const next = segments[i + 1];
      const nextGroup = next && groups.find(g => g.date >= next.dataset.start.slice(0, 7));
      const label = labels[i];
      if (!first) {
        segment.style.display = 'none';
        if (label) label.style.display = 'none';
        continue;
      }
      segment.style.display = '';
      segment.style.zIndex = String(2 * i + 1);
      if (label) label.style.display = '';
      const top = i === 0 ? 0 : Math.max(0, first.center - monthGap / 2);
      const end = nextGroup ? nextGroup.center - monthGap / 2 : height;
      segment.style.top = `${top}px`;
      segment.style.height = `${Math.max(0, end - top)}px`;
      if (label) {
        label.style.marginTop = `${Math.max(0, top - flowBottom)}px`;
        flowBottom = top + label.offsetHeight;
      }
    }
  }

  let frame = 0;
  const schedule = () => {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(layout);
  };
  window.addEventListener('resize', schedule, { passive: true });
  if (document.fonts) document.fonts.ready.then(schedule);
  schedule();
})();
