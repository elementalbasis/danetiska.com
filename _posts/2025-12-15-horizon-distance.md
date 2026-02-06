---
layout: post
title: How far away is the horizon?
author: Javier Castro
tags: [math]
cover: /assets/images/asy/horizon_distance.svg
---

The horizon is the point where your line of vision is tangent to the surface of
the earth. We can use a simple geometric construction to figure out how far the
horizon is based on how high your line of sight is.

Define the following variables:
* $R$: radius of the earth
* $h$: height of your line of sight
* $D$: distance to the horizon

Since your line of sight is tangent to the surface of the earth, it forms a
right triangle as shown in the diagram. Thus, we can use the
[Pythagorean theorem](https://en.wikipedia.org/wiki/Pythagorean_theorem):

$$D^2 + R^2 = (h + R)^2$$

$$\implies \boxed{D = \sqrt{2Rh + h^2}}$$

And if $h \ll R$, we can simply say:

$$ \boxed{D \approx \sqrt{2Rh}} $$

## A rubber band all around the world

Now we can pose another fun question. If we place a giant rubber band all around
the circumference of the earth, and then grab one point and elevate it off the
ground by one meter, how much will the rubber band stretch?

The unstretched distance is clearly the circumference of the earth. But for the
stretched distance, we need to take that circumference, subtract the circle arc
where the rubber band is not touching the ground, and add the corresponding
straight line distance of the elevated rubber band. In other words,

$$L_\mathrm{stretched} = 2\pi R - 2\theta R + 2 D$$

Now we can plug in $\tan(\theta) = \frac{D}{R}$, and use the small-height
approximation for $D$ to obtain:

$$L_\mathrm{stretched} = 2\pi R - 2 R \arctan\qty(\frac{\sqrt{2Rh}}{R}) + 2 \sqrt{2Rh}$$

Now, we can take the difference between stretched and unstretched:

$$\Delta L = L_\mathrm{stretched} - L_\mathrm{unstretched}$$

$$\implies \Delta L = 2\sqrt{2Rh} - 2R\arctan\qty(\frac{\sqrt{2Rh}}{R})$$

And since $h = 1\,\mathrm{m}$ and $R = 6371\,\mathrm{km}$, this yields a
surprisingly small result:

$$\boxed{\Delta L \approx 0.7\,\mathrm{mm}}$$
