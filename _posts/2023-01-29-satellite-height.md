---
layout: post
title: How to Measure the Height of a Satellite
author: Javier Castro
tags: [calendar, festivals]
---

If you go outside to observe the night sky during right after sunset or right
before sunrise, you will
be able to spot satellites zooming around.
They look like bright dots that move faster than an
airplane. With a little bit of physics, you can calculate the height of a
satellite without any special tools or instruments;
you simply need to make some basic observations.

Once you spot your satellite, you need to measure how much time it takes to move
between two stars. When I was outdoors observing the skies in the morning of 2023-01-29 at around 06:00,
I spotted the satellite
[<span style="white-space: nowrap">CZ-2C R/B</span>](https://www.heavens-above.com/orbit.aspx?satid=36089),
which I was able to identify with using
[Heavens Above](https://heavens-above.com). The satellite was coming from
northwest, peaked north, and then moved east.

The satellite's path crossed two familiar constellations.
Using a [star chart](https://www.planetarium.sfasu.edu/SFAStarCharts/SFAStarChartsPro.pdf),
I was able to determine that the satellite passed by Zeta
Ursae Majoris, and moved towards Iota Herculis. The time it took to move between those
two stars was $\Delta t = 52\,\mathrm{s}$.


The coordinates of the two reference stars are shown below.
* ζ-UMa: 13h 23m 56s; +54° 55' 31"
* ι-Her: 17h 39m 28s; +46° 00' 23"


From this, we can calculate the angular separation to be
$\Delta\theta = 40.1^\circ$.


I estimated that the satellite had an altitude
angle of $\alpha = 60^\circ$ from the
horizon. We
wish to find the height $h$ above the ground at which the satellite was flying.
Let $D$ be the distance from the observer to the satellite. Then,
$h = D \sin(\alpha)$.
If the satellite was moving with velocity $v$, then we would observe an angular
velocity of $\omega = \frac{v}{D}$.

<img src="/assets/images/satellite-height-angles.svg" alt="Satellite Height - Angles" class="centered-img">

<img src="/assets/images/satellite-height-triangle.svg" alt="Satellite Height - Triangle" class="centered-img">

But we already measured the angular velocity around the observer:

$$\omega = \frac{\Delta \theta}{\Delta t} = \frac{40.1^\circ}{52\,\mathrm{s}} = 0.77^\circ/\mathrm{s} = 1.3 \cdot 10^{-2}\,\mathrm{rad/s}$$


Now we can use Newton's laws to find the velocity of the satellite. The
satellite is at a distance $R+h$ from the center of the Earth, where $R$ is the
radius of the Earth. By equating the force of gravity to the centripetal force,
we obtain:

$$G\frac{Mm}{(R+h)^2} = m \frac{v^2}{R+h}$$

$$\implies G\frac{M}{R+h} = v^2$$

$$\implies v = \sqrt{\frac{GM}{R+h}}$$


From this, we can make several substitutions.

$$ \omega = \frac{v}{D} $$

$$ \implies \omega = \frac{v}{h \sin(\alpha)} $$

$$ \implies \omega h \sin(\alpha) = v $$

$$ \implies \omega h \sin(\alpha) = \sqrt{\frac{GM}{R+h}} $$

$$ \implies \omega^2 h^2 \sin^2(\alpha) = \frac{GM}{R+h} $$

$$ \implies h^2 (R + h) = \frac{GM}{\omega^2 \sin^2(\alpha)} $$


Earth's gravitational parameter is $\mu = GM = 3.99 \cdot 10^{14}\,\mathrm{m}^3/\mathrm{s}^2$.
And since we know the values of $\omega$ and $\alpha$,
we have
all the variables needed to calculate the right hand side of the equation
above.

$$ \frac{GM}{\omega^2 \sin^2(\alpha)} = 2.9 \cdot 10^{18}\,\mathrm{m}^3 $$

Since the radius of the earth is
$R = 6371\,\mathrm{km}$, we can now solve our cubic equation.

$$ h^2 (R + h) = 2.9 \cdot 10^{18}\,\mathrm{m}^3 $$

$$ \implies h = 6.5 \cdot 10^5\,\mathrm{m} $$


Thus, the satellite is flying $\sim 700\,\mathrm{km}$ above the surface of the Earth. If we do a
Google search on [<span style="white-space: nowrap">CZ-2C R/B</span>](https://www.heavens-above.com/orbit.aspx?satid=36089),
then we will see that our calculation is spot-on.
