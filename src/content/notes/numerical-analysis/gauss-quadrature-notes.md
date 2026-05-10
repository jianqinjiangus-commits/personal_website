---
title: "Gauss 积分"
description: "数值分析课程笔记：Gauss 积分。"
publishDate: 2026-05-11
updatedDate: 2026-05-11
tags:
  - numerical-analysis
  - scientific-computing
category: "Numerical Analysis"
type: "course-note"
draft: false
---

## 代数精度

$$
I(f) =\int_{a}^{b} f(x)\,dx,I_n(f) \triangleq \sum_{k=0}^n f(x_k) A_k^{(n)}\quad(A_k^{(n)} = C_k^{(n)}(b-a))
$$

$A_k^{(n)}/C_k^{(n)}$ 称为求积系数。

代数精度 $=k$, iff $E_n(f) = I(f)-I_n(f) =0 ,\,\forall f\in \mathbb{P}_k$

- 插值型积分

$$
I_n(f) = I(L_n(f))
$$

命题：以下三个等价:

- 积分为插值型
- DOE\,\,$\ge n$
- $A_k^{(n)}  = \int_{a}^{b} l_{n,k}(x)\,dx$

当积分为插值型:

$$
L_n(f) = f ,\quad \forall f\in \mathbb{P}_n
$$

因此有：$E_n(f) = 0,\,\forall f\in \mathbb{P}_n$;

当$E_n(f) = 0,\,\forall f\in \mathbb{P}_n$时，由于$L_n(f) \in \mathbb{P}_n$,
那么:

$$
\begin{aligned}
    I(L_n(f)) = I_n(L_n(f)) = \sum_{k=0}^n L_n(f)(x_k)A_k^{(n)} = \sum_{k=0}^n f(x_k)A_k^{(n)} = I_n(f)
\end{aligned}
$$

 DOE的上限$\xrightarrow{?}  2n+1$

**定理**

    $\forall \,0\le k\le n+1$，公式具有$d=n+k$次代数精度与下述等价：

- 公式为插值型的
- $\omega_{n+1}(x)$ 满足$\displaystyle \int_a^b \omega_{n+1}(x) p(x)\,dx =0,\forall p\in\mathbb{P}_{k-1}$，其中$\omega_{n+1}(x) = \Pi_{j=0}^n (x-x_j)$

**证明**

    第一点说明我们已经具有了大于等于$n$的代数精度。

    而由于$\displaystyle \forall f\in\mathbb{P}_{n+k},f=\omega_{n+1}(x)q(x)+r(x), r\in \mathbb{P}_{n},q \in \mathbb{P}_{k-1}$

$$
I(f) = I(\omega_{n+1}\,q)+I(r)
$$

    如果$DOE = n+k$，此时我们有：

$$
I(\omega_{n+1}\,q) = I(f)-I(r) = I_n(f) - I_n(r) = 0
$$

    这里是因为我们的插值型积分的取值只和插值点有关,$f(x_j) = r(x_j)$。另一个方向与上述论证类似。

 推论: $n$为偶数时，等距节点 Lagrange 插值积分具有$d=n+1$次代数精度.

**证明**

$$
\omega_{n+1}(x) = \prod\limits_{j=0}^n (x-x_j) \quad x_j =a+jh
$$

    这里我们需要证明:

$$
\int_a^b \omega_{n+1} \,dx = 0
$$

    换元:$x=a+th$
    上式积分为：

$$
\int_{0}^{n} \prod\limits_{j=0}^n (t-j)\,dt h = h \int_{-m}^{m} \prod\limits_{j=-m}^m (\tilde{t} - j)\,d\tilde{t}
$$

    这里$\tilde{t} = t -m,n=2m$
    继续计算得到:

$$
h \int_{-m}^{m} \prod\limits_{j=-m}^m (\tilde{t} - j)\,d\tilde{t} = h \int_{-m}^{m}\tilde{t} \prod\limits_{j=1}^m (\tilde{t}^2 - j^2)\,d\tilde{t}  =0
$$

    命题得证！

 此时我们通过推论得到:

$$
I(p_3(x)) = I_2(p_3(x)) = I(l_2(f))
$$

## Gauss 积分

 如果$DOE = 2n+1$,称公式为Gauss 积分。
由前述命题:

$$
Gauss \quad integration\Leftrightarrow \int_a^b \omega_{n+1}(x)\,p(x)\,dx = 0,\quad \forall p\in \mathbb{P}_n
$$

我们可以得到$\{x_j\}_{j=1}^{n}$为 Legendre 多项式的零点！

**定理**

    n 次正交多项式 恰有n个不同的零点

**证明**

    首先考察没有复根，有实重根：

$$
p_n(x) = (x-x_{i_1})^{m_1}\cdots (x-x_{i_k})^{m_k}
$$

    设$m_1,\cdots m_k$均为奇数.对于

$$
q(x) = (x-x_{i_1})\cdots (x-x_{i_k}),\quad deg \,q=k< n
$$

    则:

$$
\int_a^b p_n\,q\,dx = \int_a^b (x-x_{i_1})^{m_1+1}\cdots (x-x_{i_k})^{m_k+1}\,dx > 0
$$

    矛盾！类似上面我们可以证明Gauss 积分是存在的，即有n个不同的零点！

 我们可以通过正交多项式的零点来构造Gauss 积分。

 性质：Gauss积分具有最高代数精度。

**证明**

    反例：取 $f(x) = \omega_{n+1}^2(x)\in\mathbb{P}_{2n+2}$,$I(f)  = \int_a^b \omega_{n+1}^2(x)\,dx > 0$
    但$I_n(f) = 0$,矛盾！
