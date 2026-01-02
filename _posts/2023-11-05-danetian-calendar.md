---
layout: post
title: The Danetian calendar
author: Javier Castro
tags: [math]
cover: https://eclipse.gsfc.nasa.gov/5MCSEmap/-1399--1300/-1325-04-03.gif
---

<script src="/assets/scripts/calendar.js" defer></script>
<script src="/assets/scripts/today.js" defer></script>

One of my proudest creations is the Danetian calendar. This is a
[lunisolar calendar](https://en.wikipedia.org/wiki/Lunisolar_calendar), where
each month starts at the
[new moon](https://en.wikipedia.org/wiki/New_moon), and each year starts at the
new moon closest to the
[vernal equinox](https://en.wikipedia.org/wiki/March_equinox). In order to
accomplish this, a series of calculations are made to determine the current
position along the lunar and solar cycles.



## Calendar Calculator

The calculator below allows for the conversion between
[Gregorian](https://en.wikipedia.org/wiki/Gregorian_calendar),
[Julian](https://en.wikipedia.org/wiki/Julian_calendar), and
Danetian dates. (NOTE: All dates must be input in YYYY-MM-DD format, and years
must use
[astronomical numbering](https://en.wikipedia.org/wiki/Astronomical_year_numbering)).

<form id="form_calendar_calculator">
    <label for="input_date">Enter date:</label>
    <input type="text" id="input_date" placeholder="YYYY-MM-DD" required>
    <label for="select_calendar">Interpret as:</label>
    <select id="select_calendar" required>
        <option value="g">Gregorian</option>
        <option value="j">Julian</option>
        <option value="d">Danetian</option>
    </select>
    <input type="submit" value="Submit">
</form>
<p id="result_gregorian"></p>
<p id="result_julian"></p>
<p id="result_danetian"></p>
<script src="/assets/scripts/calculator.js" defer></script>



## Explanation of the calendar

The synodic period of the Moon is around $29.530\,588$ days. Therefore, the
months of the calendar alternate between $29$ and $30$ days in order to keep them in
sync with the phases of the Moon. If a month has $29$ days, it's called a hollow
month; if it has $30$, it's called a full month.

Grouping months into years presents a challenge: If a year is defined to be
$12$ months, that results in $354$ days, which is too short. If we instead define a
year as $13$ months, the result is roughly $383$ days, which is too long. To get
around this, some years are set to have $12$ months, while others have $13$, so that
the average year length ends up being around $365.2421$ days.
Essentially, an entire leap month is inserted every two or three years in order
to keep the calendar in sync with the seasons.



## Month names

The months are named according to the
[constellations of the zodiac](https://en.wikipedia.org/wiki/Zodiac#Constellations).
The thirteenth month is called *Terra*.

1. *Aries*
2. *Taurus*
3. *Gemini*
4. *Cancer*
5. *Leo*
6. *Virgo*
7. *Libra*
8. *Scorpius*
9. *Sagittarius*
10. *Capricornus*
11. *Aquarius*
12. *Pisces*
13. *Terra*



## Mathematical rules for months

Months alternate between full and hollow in a specified pattern in order to keep
the average month length equal to $29.530\,588\,853$ days. We may express this
number as the following continued fraction:
$$ 29.530\,588\,853 \approx [29; 1, 1, 7, 1, 2, 17] $$

From this, we can figure out its
[rational approximants](https://en.wikipedia.org/wiki/Diophantine_approximation):
$$ 29,\, 30, \,\frac{59}{2}, \,\frac{443}{15}, \,\frac{502}{17}, \,\frac{1447}{49}, \,\frac{25\,101}{850} $$

These rational approximants will help us figure out how to alternate between
full months and hollow months in the most optimal way. In essence, we must
ensure that a cycle of $850$ months contains $25\,101$ days. And we
can fill this grand cycle with as many of the other subcycles as needed
($1447$ days per $49$ months, $502$ days per $17$ months, etc.).

In order to implement the most optimal alternation pattern, certain months in
the course of time are recognized as "metallic months":

* golden months
* silver months
* copper months

The following rules determine which months are metallic:

1. After a full month hollow month comes a hollow month, and vice-versa.
2. Copper months occur every $17$ months. Copper months are always full months,
overriding rule 1.
3. Silver months occur every $49$ months. Silver months are always full months,
overriding rule 1. Moreover, they override and reset the count on rule 2.
4. Golden months occur every $850$ months. Golden months are always full months,
overriding rule 1. Moreover, they override and reset the count on rules 2 and 3.



## Mathematical rules for years

Years can either be short ($12$ months) or long ($13$ months; also called leap
years). The average length of the
month is $\frac{25\,101}{850} \approx 29.530\,588$. Thus,
in order to remain in step with the tropical year of $365.2421$ days, the
most appropriate rational approximants to use are $\frac{235}{19}$
and $\frac{4131}{334}$.

The fraction $\frac{235}{19}$ represents the
[Metonic cycle](https://en.wikipedia.org/wiki/Metonic_cycle),
which was already known in
antiquity; it arranges $235$ months into $19$ years.

The following rules determine which years are leap years:

1. Within a Metonic cycle ($19$ years), the following years are leap
years: $2, \,5, \,7, \,10, \,13, \,15, \,18$.
2. After $334$ years, a new Metonic cycle starts, overriding and resetting the
count on rule 1.



## Calendar epoch

All of these rules assume that we start counting months and years from a
particular date, which is called the
[calendar epoch](https://en.wikipedia.org/wiki/Epoch). We must look throughout
history and choose which date is the most convenient to serve as an epoch in
order to ensure that the calendar remains aligned with the phases of the moon
and the seasons of the year. This date must be a new moon, and preferrably
coincide with the vernal equinox.

By browsing through NASA's
[Five millenium catalog of solar eclipses](https://eclipse.gsfc.nasa.gov/SEcat5/SEcatalog.html),
and cross checking each date with
[Swiss ephemerides](https://www.astro.com/swisseph/swepha_e.htm),
I decided that the most elegant epoch was 03&nbsp;Apr&nbsp;-1325, because on
this date the vernal equinox coincided with a solar eclipse.



## Manual calculations

I have created
[this document](/assets/docs/modular-tables-for-calendrical-calculations.pdf)
to aid in converting Gregorian or Julian dates their corresponding Danetian
date.
