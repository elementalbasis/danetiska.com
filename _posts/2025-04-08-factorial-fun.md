---
layout: post
title: Factorial Fun
author: Simon Petrosio Sabatier
tags: [mathematics]
---

Let's derive Stirling's approximation for the factorial function.
We wish to find a
formula that can approximate $n!$ for large $n$. It will be useful to work
with $\ln n!$ instead of $n!$ directly.

NOTE: This isn't a math proof; it's a physicist's derivation, meant to
convey the mathematical intuition behind the result.



## Approximation of the factorial

One thing we may notice is that we can approximate the sum below with an
integral:

$$
\ln n! = \sum_{k = 1}^n \ln k \approx \int\limits_1^n \ln x \dd{x}
$$

However, this approximation leaves us too short. As shown in figure 1, there
are little triangles that are not accounted for by the integral. Each triangle
has an area of $A_{k+1} = \frac{1}{2} \qty( \ln (k+1) - \ln k )$. The sum of
all the triangles is a telescoping sum which ultimately simplifies to
$A = \frac{1}{2} \ln n\,$.

<figure>
  <img src="/assets/images/factorial-fun-integral.svg"/>
  <figcaption>Figure 1. Visual representation of the integral approximation for
    $\ln n!\,$.</figcaption>
</figure>

We therefore arrive at a better approximation:

$$
\ln n! = \sum_{k = 1}^n \ln k
\approx \frac{1}{2} \ln n + \int\limits_1^n \ln x \dd{x}
$$

However, the "triangles" from before are not really triangles, so we need to
add an unknown constant to correct this. Thus, we get at:

$$
\ln n! = \sum_{k = 1}^n \ln k
\approx \int\limits_1^n \ln x \dd{x} + \frac{1}{2} \ln n + c
$$

After evaluating the integral and letting $c$ absorb any constant terms, we obtain:

$$ \boxed{\ln n! \approx n \ln n - n + \frac{1}{2} \ln n + c} $$

But now the question arises: What is the optimal value for $c\,$?



## Evaluating $\qty(\frac{1}{2})!$

Let's take a detour and explore the following definition for the factorial:

$$ n! = \int\limits_0^\infty x^n e^{-x} \dd{x} $$

This integral takes advantage of repeated integration by parts to give a
final result of $n!\,$. One advantage that this definition brings to the
table is that it can be extended to non-integer $n$.
We will use this fact to calculate an interesting value:

$$
\qty( \frac{1}{2} ) !
= \int\limits_0^\infty \sqrt{x} \, e^{-x} \dd{x}
$$

In order to evaluate this integral, we will first perform a simple substitution
of $u^2 = x$ to transform the integral:

$$
\begin{align*}
\qty(\frac{1}{2}) ! &= \int\limits_0^\infty u \, e^{-u^2} 2 u \dd{u} \\
&= 2 \int\limits_0^\infty u^2 \, e^{-u^2} \dd{u}
\end{align*}
$$

Now let $I$ be the value of the integral. Then,

$$
\begin{align*}
I^2 &= 4 \qty(\int\limits_0^\infty u^2 \, e^{-u^2} \dd{u} )
\qty(\int\limits_0^\infty v^2 \, e^{-v^2} \dd{v} )
\\
&= 4 \int\limits_0^\infty \int\limits_0^\infty
u^2 v^2 \, e^{-u^2-v^2} \dd{u} \dd{v}
\\
&= 4 \int\limits_0^\infty \int\limits_0^{\pi/2}
\qty(\rho \cos\phi)^2 \qty(\rho \sin\phi)^2
\, e^{-\rho^2} \rho \dd{\phi} \dd{\rho}
\\
&= 4 \qty(\int\limits_0^\infty \rho^5 \, e^{-\rho^2} \dd{\rho} )
\qty(\int\limits_0^{\pi/2} \cos^2\phi \sin^2\phi \dd{\phi} )
\\
&= 4 \,\qty(1)
\qty(\int\limits_0^{\pi/2} \cos^2\phi \sin^2\phi \dd{\phi} )
\\
&= 4 \,\qty(\frac{\pi}{16})
\\
&= \frac{\pi}{4}
\\
\implies & I = \frac{\sqrt{\pi}}{2}
\\
\implies & \boxed{\qty(\frac{1}{2})! = \frac{\sqrt{\pi}}{2}}
\end{align*}
$$



## Double factorials

Let's take a second detour to explore the double factorial. This is a
function defined by:

$$
\begin{cases}
\qty(2n+1)!! &=&\, 1 \cdot 3 \cdot 5 \cdot \ldots \cdot (2n+1)
\\
\qty(2n)!! &=&\, 2 \cdot 4 \cdot 6 \cdot \ldots \cdot (2n)
\end{cases}
$$

Let us find a closed expression for both the even and odd cases. The even case
is easily factored into:

$$
\boxed{\qty(2n)!! = 2^n\, n!}
$$

The odd case requires more work. Notice that $(2n)!! \, (2n+1)!! = (2n+1)!\,$.
We can use this to write:

$$
\begin{align*}
&\qty(2n+1)!! = \frac{(2n+1)!}{(2n)!!}
\\
\implies & \boxed{\qty(2n+1)!! = \frac{(2n+1)!}{2^n\, n!}}
\end{align*}
$$


## Finding a suitable value for $c$

Now we will return to our approximation of $\ln n!\,$. In order to find a
suitable value of $c$, we will explore the following ratio:

$$
\begin{align*}
Q &= \frac{\qty(n+\frac{1}{2})!}{n!}
\\
&= \frac{
\qty(\frac{1}{2})! \cdot
\frac{3}{2} \cdot \frac{5}{2} \cdot \ldots \cdot \frac{2n+1}{2}}{n!}
\\
&= \frac{\qty(\frac{1}{2})! (2n+1)!!}{n! \, 2^n}
\\
&= \frac{\qty(\frac{1}{2})! \, (2n+1)!}{(n!)^2 \, 2^{2n}}
\\
&= \frac{\sqrt{\pi} \, (2n+1)!}{(n!)^2 \, 2^{2n+1}}
\end{align*}
$$

It will prove convenient to convert this into a logarithm to make it
more compatible with the Stirling approximation we found at the beginning.

$$
\begin{align*}
\ln Q
&= \ln\frac{\sqrt{\pi} \, (2n+1)!}{(n!)^2 \, 2^{2n+1}}
\\
&= \frac{1}{2}\ln\pi + \ln(2n+1)! - 2\ln n! - (2n+1) \ln 2
\end{align*}
$$

We can perform two substitutions with our Stirling approximation. Let's explore
$\ln(2n+1)!$ first. If we assume a large $n$, we can feel safe doing Taylor
approximations and ignoring any terms that vanish. Here are the steps we take:

$$
\begin{align*}
\ln (2n+1)! &\approx (2n+1) \ln (2n+1) - (2n+1) + \frac{1}{2} \ln (2n+1) + c
\\
&\approx (2n+1) \qty(\ln(2n) + \frac{1}{2n}) - 2n-1 + \frac{1}{2} \qty(\ln(2n) + \frac{1}{2n}) + c
\\
&\approx 2n \ln (2n) + 1 + \ln(2n) + \cancel{\frac{1}{2n}}
- 2n - 1 + \frac{1}{2} \ln (2n) + \cancel{\frac{1}{4n}} + c
\\
& = 2n\ln 2 + 2n\ln n + \ln 2 + \ln n - 2n + \frac{1}{2} \ln 2 + \frac{1}{2} \ln n + c
\\
& = 2n\ln 2 + 2n\ln n + \frac{3}{2} \ln 2 + \frac{3}{2} \ln n - 2n + c
\end{align*}
$$

This contains many terms in common with:

$$
2 \ln n! \approx 2n \ln n - 2n + \ln n + 2c
$$

Hence, we see that the difference between them would cancel many terms, to be
left with:

$$
\ln (2n+1)! - 2\ln n!
= 2n\ln 2 + \frac{3}{2} \ln 2 + \frac{1}{2} \ln n - c
$$

We can finally circle back to the ratio $Q$ that we were exploring:

$$
\begin{align*}
\ln Q &= \frac{1}{2}\ln\pi + \qty\Big(\ln(2n+1)! - 2\ln n!) - 2n \ln 2 - \ln 2
\\
&= \frac{1}{2}\ln\pi +
\qty(2n\ln 2 + \frac{3}{2} \ln 2 + \frac{1}{2} \ln n - c)
-2n \ln 2 - \ln 2
\\
&= \frac{1}{2}\ln\pi +
\frac{1}{2} \ln 2 + \frac{1}{2} \ln n - c
\end{align*}
$$

Now for our grand finale, we assert that the most suitable $c$ for Stirling's
approximation is the one that would cancel out all the constant terms above.
Thus:

$$
\boxed{
c = \frac{1}{2} \ln\pi + \frac{1}{2} \ln 2
}
$$

We have therefore arrived at the standard form of Stirling's approximation:

$$
\boxed{
n! \approx
\frac{n^n}{e^n} \sqrt{2\pi n}
}
$$
