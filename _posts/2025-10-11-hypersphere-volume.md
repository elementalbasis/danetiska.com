---
layout: post
title: Deriving the volume of an n-sphere
author: Jackson Hall
tags: [math]
cover: /assets/images/sphere.svg
---

$$\require{physics}$$

Let us derive the volume of an $n$-dimensional sphere. First, we shall
consider the product of $n$ copies of the Gaussian integral, which yields a
known value:

$$ \pi^\frac{n}{2} = \qty(\int\limits_{-\infty}^\infty e^{-x^2} \dd{x} )^n $$

$$ \implies \pi^\frac{n}{2} = \int\limits_{-\infty}^\infty e^{-x_1^2} \dd{x_1} \int\limits_{-\infty}^\infty e^{-x_2^2} \dd{x_2} \ldots \int\limits_{-\infty}^\infty e^{-x_n^2} \dd{x_n} $$

$$ \implies \pi^\frac{n}{2} = \int\limits_{-\infty}^\infty \int\limits_{-\infty}^\infty \ldots \int\limits_{-\infty}^\infty e^{-x_1^2-x_2^2\ldots-x_n^2} \dd{x_1}\dd{x_2}\ldots\dd{x_n} $$

$$ \implies \pi^\frac{n}{2} = \int\limits_{\mathbb{R}^n} e^{-r^2} \dd{V_n} $$

So we see that this integral takes a simple form if we let $r^2=x_1^2+x_2^2\ldots+x_n^2$
relate the distance from the origin, and $\dd{V_n}=\dd{x_1}\dd{x_2}\ldots\dd{x_n}$ be
the $n$-dimensional volume element. But in polar coordinates, the volume
element $\dd{V_n}$
can be separated into a $\dd{r}$ portion, which is integrated along the radius
from the origin, and a $r^{n-1} \dd{\Omega_{n-1}}$ portion, which is integrated over
the surface of the $n$-dimensional unit sphere $S^{n-1}$. Hence:

$$ \pi^\frac{n}{2} = \int\limits_0^\infty e^{-r^2} r^{n-1} \dd{r} \int\limits_{S^{n-1}} \dd{\Omega_{n-1}} $$

$$ \implies \pi^\frac{n}{2} = \Omega_{n-1} \int\limits_0^\infty e^{-r^2} r^{n-1} \dd{r} $$

$$ \implies \pi^\frac{n}{2} = \Omega_{n-1} \int\limits_0^\infty e^{-u} \qty(\sqrt{u})^{n-1} \frac{\dd{u}}{2\sqrt{u}} ,\hspace{1em} \mathrm{where} \hspace{0.5em} u = r^2$$

$$ \implies \pi^\frac{n}{2} = \frac{1}{2} \Omega_{n-1} \int\limits_0^\infty e^{-u} u^{\frac{n}{2}-1} \dd{u} $$

$$ \implies \pi^\frac{n}{2} = \frac{1}{2} \Omega_{n-1} \Gamma\qty(\frac{n}{2}) $$

$$ \implies \Omega_{n-1} = \frac{2 \pi^\frac{n}{2}}{\Gamma\qty(\frac{n}{2})} $$

So we have solved for $\Omega_{n-1}$, which is the surface area of the unit sphere $S^{n-1}$. We can
generalize it to yield the surface area for any radius $r$ by simply scaling it appropriately:

$$ A_{n-1}(r) = \Omega_{n-1} r^{n-1} = \frac{2\,\pi^\frac{n}{2}}{\Gamma\qty(\frac{n}{2})} r^{n-1} $$

And if we integrate with respect to $r$, we recover the volume of an $n$-sphere:

$$ V_n(r) = \int A_{n-1}(r) \dd{r} $$

$$ \implies V_n(r) = \frac{2\,\pi^\frac{n}{2}}{\Gamma\qty(\frac{n}{2})} \int r^{n-1} \dd{r} $$

$$ \implies V_n(r) = \frac{2\,\pi^\frac{n}{2}}{n \,\Gamma\qty(\frac{n}{2})} r^n $$

$$ \implies V_n(r) = \frac{\pi^\frac{n}{2}}{\qty(\frac{n}{2})\Gamma\qty(\frac{n}{2})} r^n $$

$$ \implies \boxed{V_n(r) = \frac{\pi^\frac{n}{2}}{\Gamma\qty(\frac{n}{2}+1)} r^n} $$
