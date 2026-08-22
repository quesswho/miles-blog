---
layout: post
title: "On collapsible algebraic numbers"
date: 2026-08-20
last_modified_at: 2026-08-22
math: true
---

This post concerns Problem 3 from Griffin Macris's list of open problems.
It was originally stated as a question:

{% include thm.html type="question" title="Problem 3" id="q-problem3" %}
Say $\alpha$ is an algebraic number.
Is there always a finite sequence of polynomials $f_1,f_2,\ldots,f_k$, all of which have integer coefficients and rational zeros, such that, when composed, $f_1(f_2(\ldots f_k(\alpha)\ldots)) = 0$?
{% include endthm.html %}

It is known that for $\deg \alpha \leq 3$ such polynomials always exist. For example, if $\alpha=\frac{p}{q}$, then the polynomial $f_1(x)=qx-p$ works. For a quadratic irrational satisfying $A\alpha^2 - B\alpha + C = 0$, the sequence $f_1(x)=x+C$, $f_2(x)=x(Ax-B)$ works. 
The case for cubics was solved by Jordi Ribes:

> Any cubic $x^3+ax^2+bx+c$ divides the polynomial $(x+a/3)^2((x+a/3)^2-(a^2-3b)/3)^2-((2a^3-9ab+27c)/27)^2$. This comes from computing the depressed cubic $t^3+dt+e$ (where $d$,$e$ depend on $a$,$b$,$c$) through the change $t=x+a/3$, and noting that $t^3+dx+e$ divides $t^2(t^2+d)^2-e^2$. So $f_1(x)=(x+a/3)^2$, $f_2(x)=x*(x-(a^2-3b)/3)^2$, $f_3(x)=x-((2a^3-9ab+27c)/27)^2$.


The open question is what happens in the case $\deg \alpha \geq 4$.

Rather than working with the question in this form, we begin by constructing a more precise formulation of the problem. First we define a common term to describe how the roots of a polynomial behave.

{% include thm.html type="definition" title="Split" id="def-split" %}
A polynomial $f \in \Q[x]$ is *split* if $\deg f \geq 1$ and
$f(x) = a\prod_{i=1}^n (x - r_i)$ for some $a \in \Q^\times$ and $r_1,\ldots,r_n \in \Q$.
{% include endthm.html %}

Whether we demand integer or rational coefficients in the sequence of polynomials is immaterial here, since multiplying a polynomial in $\Q[x]$ by a common denominator of its coefficients will always put it in $\Z[x]$.

{% include thm.html type="lemma" title="Hitting $0$ is hitting $\Q$" id="lem-target" %}
Let $\alpha$ be an algebraic number and $k \geq 1$. There exist split
$f_1,\ldots,f_k$ with $f_1(f_2(\ldots f_k(\alpha)\ldots)) = 0$ if and only if
there exist split $f_2,\ldots,f_k$ with $f_2(\ldots f_k(\alpha)\ldots) \in \Q$.
{% include endthm.html %}

{% include thm.html type="proof" %}
If $f_1$ is split and $f_1(\beta) = 0$, then $\beta$ is a zero of $f_1$, and all
zeros of a split polynomial are rational, so $\beta \in \Q$. Conversely, if
$\beta = p/q \in \Q$, then $f_1(x) = qx - p$ is split and $f_1(\beta) = 0$.
{% include endthm.html %}

So Problem 3 is not about reaching $0$, but about whether $\Q$ can be reached.
We define a grading scheme for the problem based on how many polynomials we are allowed to use.

{% include thm.html type="definition" title="$k$-collapsible" id="def-collapsible" %}
Let $\alpha$ be an algebraic number over $\Q$ and $k \geq 1$. We say $\alpha$ is
*$k$-collapsible* if there exist split polynomials $f_1,f_2,\ldots,f_k$ with
$$f_1(f_2(\ldots f_k(\alpha)\ldots)) \in \Q.$$
We say $\alpha$ is *collapsible* if it is $1$-collapsible, and *eventually
collapsible* if it is $k$-collapsible for some $k \geq 1$.
{% include endthm.html %}

{% include thm.html type="remark" %}
By [the lemma](#lem-target), Problem 3 asks precisely whether every algebraic
number is eventually collapsible.
{% include endthm.html %}

We are now ready to prove our first new result.

{% include thm.html type="theorem" title="Trinomials are $2$-collapsible" id="thm-trinomial" %}
Let $\alpha$ be an algebraic number satisfying
$$\alpha^n + q\alpha^k + r = 0$$
for some $q,r \in \Q$ and integers $1 \leq k < n$. Then $\alpha$ is $2$-collapsible.
{% include endthm.html %}

{% include thm.html type="proof" %}
Put $e = n-k$ and $t = e/\gcd(k,e)$. Since $\alpha^n = \alpha^k\alpha^e$, the
relation factors as
$$\alpha^k(\alpha^e + q) = -r,$$
and raising it to the $t$-th power gives $\alpha^{kt}(\alpha^e+q)^t = (-r)^t$.
By the choice of $t$ we have $kt/e = k/\gcd(k,e) \in \Z$, so the left-hand side
is a polynomial in $\alpha^e$. Set
$$f_2(y) = y^{k/\gcd(k,e)}(y+q)^t, \qquad f_3(z) = z^e.$$
Both are split, their only zeros being $0$ and $-q$, and both have degree at
least $1$ since $e \geq 1$. Now
$$f_2(f_3(\alpha)) = (\alpha^e)^{kt/e}(\alpha^e+q)^t = \alpha^{kt}(\alpha^e+q)^t = (-r)^t \in \Q,$$
so $\alpha$ is $2$-collapsible.
{% include endthm.html %}

Note: This is a generalization of Jordi Ribes's cubics ($n=3$, $k=1$). This result does not completely settle the degree $4$ case.


## Collapsible reduction
The complexity of the problem arises from having to deal with composition of many functions. So restricting the problem to 1-collapsible makes an interesting case. There is no composition between functions, and this reveals certain structures.

{% include thm.html type="question" title="Collapsible" id="q-1collapsible" %}
Which algebraic numbers $\alpha$ are $1$-collapsible? That is,
for which $\alpha$ does there exist a polynomial $f\in \Q[x]$ that splits in $\Q$ such that $f(\alpha)\in \Q$?
{% include endthm.html %}

The cases $\deg \alpha\leq 2$ are already covered by the previously known results stated above.
But the case $\deg \alpha = 3$ is currently open.

{% include thm.html type="lemma" title="Product form" id="lem-product" %}
Let $\alpha$ be an irrational algebraic number. Then $\alpha$ is collapsible if and only if
there are $n \geq 1$ and $r_1,\ldots,r_n \in \Q$ with
$$\prod_{i=1}^n (\alpha - r_i) \in \Q^\times.$$
{% include endthm.html %}

{% include thm.html type="proof" %}
A split $f$ is by definition $f(x) = a\prod_{i=1}^n(x-r_i)$ with $a \in \Q^\times$, $r_i \in \Q$ and
$n = \deg f \geq 1$, so $f(\alpha) = a\prod_i(\alpha-r_i)$. Multiplying by the unit $a$ does not
affect membership in $\Q$, and every factor is nonzero since $\alpha \notin \Q$. Conversely, such a
product is $f(\alpha)$ for the split polynomial $f(x) = \prod_{i=1}^n(x-r_i)$.
{% include endthm.html %}

We can prove collapsibility for certain algebraic numbers without much effort, for example consider $\alpha-s^2x+C$ where $s\in \Q$. Then let the roots of the polynomial be $r=0,s,-s$, so $f(x)=x(x-s)(x+s)=x^2-s^2x=-C$. And collapsing $\alpha^3-3\alpha+C$, can be done with $r=-1,-1,2$, so $f(x)=(x-2)(x+1)^2=x^3-3x+2=2-C$.
