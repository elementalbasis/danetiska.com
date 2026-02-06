---
layout: post
title: What is the shape of a hanging cable?
author: Javier Castro
tags: [math, physics]
cover: /assets/images/catenary_curve.jpg
---

What shape does a hanging chain or cable make? Initially, one may
guess that it is a simple parabola. But this is not the case; the answer is much
more fascinating. So let us calculate that shape, called a
[catenary](https://en.wikipedia.org/wiki/Catenary).

<img src="/assets/images/asy/catenary_curve.svg" class="centered-img" alt="Catenary curve.">
<img src="/assets/images/asy/catenary_forces.svg" class="centered-img" alt="Forces on the catenary curve.">

Let us examine the forces acting upon an infinitesimal element $$\mathrm{d}s$$ of
the cable. There are three forces acting upon the infinitesimal element:
* Its infinitesimal weight $$\mathrm{d}\mathbf{w}$$.
* The force of tension $$-\mathbf{T}$$ at one end of the element.
* The slightly different force of tension $$\mathbf{T} + \mathrm{d}\mathbf{T}$$
at the other end of the element.

Let $$\rho_\lambda$$ be the linear mass density of the cable. Since the cable is in
equilibrium, the net force on the infinitesimal element equals zero:

$$ \mathbf{F}_\mathrm{net} = 0 $$

$$ \implies (-\mathbf{T}) + (\mathbf{T} + \mathrm{d}\mathbf{T}) + (\mathrm{d}\mathbf{w}) = 0 $$

$$ \implies \mathrm{d}\mathbf{T} - \rho_\lambda \, \mathrm{d}s \, g \, \mathbf{e}_y = 0 $$

$$ \implies \frac{\mathrm{d}\mathbf{T}}{\mathrm{d}s} = \rho_\lambda \, g \, \mathbf{e}_y $$

$$ \implies \mathbf{T} = T_0 \, \mathbf{e}_x + \rho_\lambda \, g \, s \, \mathbf{e}_y $$

Thus, we have solved for the tension $$\mathbf{T}$$ along the cable as a
function of arclength $$s$$. We have conveniently chosen the constant of
integration $$T_0 \, \mathbf{e}_x$$ so that $$s=0$$ corresponds to the minimum
point of the curve, making the tension force fully horizontal there.

This vector function $$\mathbf{T}$$ tells us both the magnitude and direction
of the force of tension all along the cable. Thus, we can use it to give us
information about the slope of the curve.

<img src="/assets/images/asy/differential_triangle.svg" class="centered-img" alt="Differential triangle.">

We can recover the slope of the curve from the components of
$$\mathbf{T}$$ as follows:

$$ \frac{\mathrm{d}y}{\mathrm{d}x} = \tan(\theta) = \frac{\rho_\lambda \, g \, s}{T_0} $$

$$ \implies \frac{\mathrm{d}y}{\mathrm{d}x} = \frac{s}{a} ,\,\,\,\,\,\, \mathrm{where} \,\, a=\frac{T_0}{\rho_\lambda \, g}$$

So we see that the slope of the function is proportional to its arclength $$s$$.
If we take the derivative of both sides, we get:

$$ \frac{\mathrm{d}^2y}{\mathrm{d}x^2} = \frac{1}{a} \frac{\mathrm{d}s}{\mathrm{d}x} $$

$$ \implies \frac{\mathrm{d}^2y}{\mathrm{d}x^2} = \frac{1}{a} \sqrt{1 + \left(\frac{\mathrm{d}y}{\mathrm{d}x}\right)^2} $$

$$ \implies \frac{\mathrm{d}u}{\mathrm{d}x} = \frac{1}{a} \sqrt{1 + u^2} ,\,\,\,\,\,\, \mathrm{where} \,\, u = \frac{\mathrm{d}y}{\mathrm{d}x}$$

$$ \implies \int \frac{\mathrm{d}u}{\sqrt{1 + u^2}} = \frac{1}{a} \int \mathrm{d}x $$

$$ \implies \mathrm{arsinh}(u) = \frac{x}{a} $$

$$ \implies u = \sinh(\frac{x}{a}) $$

$$ \implies \frac{\mathrm{d}y}{\mathrm{d}x} = \sinh\left(\frac{x}{a}\right) $$

Thus, after some integrals along the way, and setting the constants of
integration to be whatever is most convenient for us, we arrive at the shape of
the hanging cable:

$$ y = a \cosh\left(\frac{x}{a}\right) - a $$

This is the shape of the catenary curve.
Even though it's not a parabola, it can still be approximated by one for
small enough values of $$x$$. The proof of this is left as an exercise to the
reader.
