---
title: "非线性方程数值解"
description: "数值分析课程笔记：非线性方程数值解。"
publishDate: 2026-05-11
updatedDate: 2026-05-11
tags:
  - numerical-analysis
  - scientific-computing
category: "Numerical Analysis"
type: "course-note"
draft: false
---

## 简介

解决:

$$
\vec{F}(\vec{x}) = 0,\quad \vec{F}(\vec{x}) = \vec{d} ,\quad \vec{F}:\mathbb{R}^n \to \mathbb{R}^n
$$

我们采用一般迭代法:$ \{x_k\}_{k\in\mathbb{N}} , x_k \to x^*$

## 收敛阶

- 线性收敛:

$$
\lim_{n\to \infty} \frac{\epsilon_{n+1}}{\epsilon_n} = c <1
$$

- 超线性收敛：

$$
\lim_{n\to \infty} \frac{\epsilon_{n+1}}{\epsilon_n} =0
$$

- p阶收敛:

$$
\lim_{n\to \infty} \frac{\epsilon_{n+1}}{\epsilon_n^p} =c >0
$$

同样我们有超p阶收敛：

$$
\lim_{n\to \infty} \frac{\epsilon_{n+1}}{\epsilon_n^p} =0
$$

Rmk: 此时p阶收敛与数值积分p阶收敛是不同的

 假设从\,$n_0$\,开始:

线性： $\epsilon_{n_0+k} = \epsilon_{n_0} q^k, q<1$

p阶:  $\displaystyle \epsilon_{n_0+k} = \epsilon_{n_0}^{p^k} c^{\frac{p^k-1}{p-1}}$

 如果我们希望$\epsilon_{n_0+k} = \epsilon_{n_0} \cdot 10^{-\delta_k}$
对于线性情形：

$$
q^k = 10^{-\delta_k} \Longrightarrow \delta_k = k \log_{10} q^{-1}
$$

对于p阶情形:

$$
\epsilon_{n_0}^{p^k-1} c^{\frac{p^k-1}{p-1}} = 10^{-\delta_k} \Longrightarrow \delta_k = \frac{p^k-1}{p-1} ((p-1)\log_{10} \epsilon_{n_0}^{-1}-\log_{10} c)
$$

即:

$$
\delta_k = p^k \big((1-p^{-k})\log \epsilon_{n_0}^{-1}-\frac{1-p^{-k}}{p-1}\log c\big)\thicksim \mathcal{O}(p^k)
$$

## 具体方法

 我们先考虑 $n=1$ 的情形：

### 二分法

如果我们有:$f(a)f(b)<0$，我们考虑$f(\frac{a+b}{2})$，考虑两个不同号的端点，从而缩小搜索区间，直到找到一个根。

 Rmk:**全局收敛,线性收敛**

### 不动点迭代

求解: $x_{k+1} = \varphi(x_k)$, $x_k \xrightarrow{?} x^*$

**定理（(压缩映像原理)）**

    如果$\{x_k\}\in[a,b], \varphi:[a,b]\to[a,b]$,且$\varphi$满足:

$$
|\varphi(x) -\varphi(y)| \le L|x-y|,\quad L<1
$$

    则$\forall x_0\in [a,b]$,有:

$$
|x_k-x^*| \le \frac{L^k}{1-L}|x_1-x_0|
$$

    其中 $x_{k+1} = \varphi(x_k)$

**证明**

    平凡。

 我们下面考虑**局部收敛性**:

定义:
如果\, $\exists\, x^*$邻域 $B_\delta (x^*)$ 使得$x_{k+1} = \varphi(x_k)$，对$\forall x_0 \in B_\delta(x^*)$都收敛，且收敛于$x^*$，那么称迭代法在$x^*$局部收敛。

**定理**

    设\,$x^*$\,是\,$\varphi$\,的不动点.\,$\varphi'(x)$在$x^*$邻域内连续，如果$|\varphi'(x^*)|<1$,那么迭代法局部收敛。

**证明**

    考察$x^*$的$B_\delta$邻域，对于$x\in B_\delta(x^*)$,此时:

$$
|\varphi(x) - \varphi(x^*)| = |\varphi'(\xi)||x-x^*|\le |\varphi'(\xi)|\cdot \delta
$$

    由于$\varphi'(x)$在$x^*$邻域内连续，取$\delta$充分小，则$|\varphi'(x)|\le L <1, \forall x\in B_\delta(x^*)$。
    则:

$$
|\varphi(x) - \varphi(x^*)| = |\varphi'(\xi)||x-x^*|\le |\varphi'(\xi)|\cdot \delta \le L\delta
$$

    同样$\forall x,y\in B_\delta(x^*)$,有:

$$
|\varphi(x)-\varphi(y)| =|\varphi'(\xi)||x-y|\le L|x-y|
$$

    由压缩映像原理可得局部收敛，证毕。

### 牛顿法

 对非线性方程 $f(x)=0$，牛顿迭代格式为

$$
x_{k+1}=x_k-\frac{f(x_k)}{f'(x_k)}.
$$

几何意义：在点 $(x_k,f(x_k))$ 作切线，切线与 $x$ 轴交点作为下一次迭代点 $x_{k+1}$。

> 图示：以$f(x) = x^2-2$为例（原图环境已转为文字说明）

 每次做切线与x轴相交，依次迭代:

$$
x_{k+1} = x_k - \frac{f(x_k)}{f'(x_k)}
$$

此时$\varphi(x) = x -\frac{f(x)}{f'(x)}$
下面我们计算$\varphi'$：

$$
\varphi'(x) = 1- \frac{f'(x)f'(x)-f(x)f'(x)}{f'(x)^2}
$$

则对于$f$的零点$x^*$，有:

$$
\varphi'(x^*) = 1- \frac{f'(x^*)f'(x^*)-f(x^*)f'(x^*)}{f'(x^*)^2} = 1- \frac{f'(x^*)^2}{f'(x^*)^2} = 0
$$

因此由定理\,前述定理\,可得牛顿法局部收敛。

**定理**

    对$x_{k+1} = \varphi(x_k)$ 如果$\varphi^{(p)}(x)$在$x^*$局部连续，且$\varphi^{(m)}(x^*)=0, m = 1,2,\cdots,p-1$,且$\varphi^{(p)}(x^*)\neq 0$.那么
    $\{x_k\}_{k\in\mathbb{N}}$\,\,p阶收敛

**证明**

$$
\begin{aligned}
        x_{k+1} -x^* &= \varphi(x_k) - x^* \\
        &= \sum_{m=1}^{p-1}\frac{\varphi^{(m)}(x^*)}{m!}(x_k-x^*)^m+\frac{\varphi^{(p)}(x^*)}{p!}(x_k-x^*)^p\\
        &= \frac{\varphi^{(p)}(x^*)}{p!}(x_k-x^*)^p\\
    
\end{aligned}
$$

    $\displaystyle \longrightarrow \lim_{k\to \infty} \frac{\epsilon_{k+1}}{\epsilon_k^p} = \frac{\varphi^{(p)}(x^*)}{p!} \neq 0$，命题成立，证毕。

我们考虑牛顿法，代入定理\,前述定理\,可得当$f'(x^*),f''(x^*) \neq 0$时，牛顿法2阶收敛。

 Rmk:如$f'(x^*)=0$或$f'(x^*)\approx 0$,则牛顿法可能不收敛或者退化为线性收敛。

### 割线法

考虑迭代:

$$
x_{k+1} = x_k - \frac{x_k-x_{k-1}}{f(x_k)-f(x_{k-1})}f(x_k)
$$

**定理**

    设 $f(x)$在$B_\delta(x^*)$内$C^2$,且 $\forall x\in B_\delta(x^*),f'(x) \neq 0$，则当$\delta$充分小时,割线法以$p=\frac{1+\sqrt{5}}{2}$阶收敛。

**证明**

    见书。

## 代数多项式求根以及分解

$$
p_n(x) = \sum_{k=0}^n a_k x^k
$$

Newton法:

$$
x_{k+1} = x_k - \frac{p_n(x_k)}{p_n'(x_k)}
$$

对于计算$p_n$的值:

$$
p_n(x) = (((a_n x+a_{n-1})x + a_{n-2})+\cdots)+a_0
$$

即:

$$
\begin{cases}
    
    p_1(x) = a_0 + a_1 x\\
    p_2(x) = a_0 + a_1 x + a_2 x^2\\
    p_3(x) = a_0 + a_1 x + a_2 x^2 + a_3 x^3
    
\end{cases}
$$

### 降阶（Deflation）

若已知 $p_n(z)=0$，可做多项式降阶

$$
q_{n-1}(x;z)=\frac{p_n(x)-b_0}{x-z},\qquad b_0=p_n(z).
$$

若 $z$ 是精确根，则 $b_0=0$，于是

$$
q_{n-1}(x;z)=\frac{p_n(x)}{x-z},\qquad
p_n(x)=(x-z)q_{n-1}(x;z).
$$

### 非线性方程组稳定性

考虑方程组

$$
\vec F(\vec x^{\,*})=\vec d,\qquad \vec F:\R^d\to\R^d.
$$

对右端作扰动 $\delta \vec d$，解作扰动 $\delta\vec x$：

$$
\vec F(\vec x^{\,*}+\delta\vec x)\approx \vec d+\delta\vec d.
$$

在 $\vec x^{\,*}$ 处一阶线性化：

$$
\vec F(\vec x^{\,*})+J_F(\vec x^{\,*})\delta\vec x\approx \vec d+\delta\vec d
\quad\Longrightarrow\quad
J_F(\vec x^{\,*})\delta\vec x\approx \delta\vec d.
$$

定义相对条件数（误差放大因子）

$$
K_{\mathrm{rel}}
\triangleq
\frac{\|\delta\vec x\|/\|\vec x^{\,*}\|}{\|\delta\vec d\|/\|\vec d\|}
\approx
\frac{\|J_F(\vec x^{\,*})^{-1}\|\,\|\vec d\|}{\|\vec x^{\,*}\|}.
$$

因此当 $J_F(\vec x^{\,*})$ 接近奇异时，问题往往不稳定。

### 停机条件与误差量级估计

记误差 $e_k=x_k-x^*$。

\paragraph{(a) 残量准则}
若

$$
\|F(x_k)\|\le \varepsilon,
$$

则由一阶近似

$$
F(x_k)-F(x^*)\approx J_F(x^*)\,e_k=:J_F^*e_k
$$

得到

$$
\varepsilon \gtrsim \|J_F^*e_k\|
\approx \|J_F^*\|\,\|e_k\|
\quad\Longrightarrow\quad
\frac{\|e_k\|}{\|x^*\|}
\lesssim
\|J_F^*\|^{-1}\,\tilde\varepsilon,\qquad
\tilde\varepsilon:=\frac{\varepsilon}{\|x^*\|}.
$$

\paragraph{(b) 步长准则}
若

$$
\|x_{k+1}-x_k\|\le\varepsilon,
$$

且 $x_{k+1}=\varphi(x_k)$，则

$$
e_{k+1}=x_{k+1}-x^*=\varphi(x_k)-\varphi(x^*)\approx J_\varphi^*e_k.
$$

于是

$$
\|x_{k+1}-x_k\|
=\|x_{k+1}-x^*+x^*-x_k\|
\approx\|J_\varphi^*e_k-e_k\|
\le \|J_\varphi^*-I\|\,\|e_k\|.
$$

从而

$$
\frac{\|e_k\|}{\|x^*\|}
\lesssim
\frac{\varepsilon}{\|J_\varphi^*-I\|\,\|x^*\|}.
$$

该准则对“找不到通常意义下的残量函数”的迭代格式也常可使用。
