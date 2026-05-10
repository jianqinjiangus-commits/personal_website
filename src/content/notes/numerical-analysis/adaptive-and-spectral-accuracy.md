---
title: "自适应与谱精度"
description: "数值分析课程笔记：自适应与谱精度。"
publishDate: 2026-05-11
updatedDate: 2026-05-11
tags:
  - numerical-analysis
  - scientific-computing
category: "Numerical Analysis"
type: "course-note"
draft: false
---

## 自适应

$$
I(f) = \int_a^b f(x)\,dx
$$

网格也是自由度，变化剧烈的区间需要打密集网格，变化缓慢的区间需要打稀疏网格。

### 误差等分布原则

$I_h(f)$是在$a=x_0<x_1<\cdots<x_n=b$网格下的数值积分。我们采取：

$$
    |\int_{x_k}^{x_{k+1}}f(x)\,dx - I_h(f;[x_k,x_{k+1}])| \lesssim  \frac{x_{k+1}-x_k}{b-a}\epsilon
$$

以复合Simpson公式为例，有:

$$
    I(f) \approx \sum_k (S_k+e_k)
$$

其中$S_k$为Simpson公式在$[x_k,x_{k+1}]$积分,

$$
S_k - \int_{x_k}^{x_{k+1}} f(x)\,dx = C(x_{k+1}-x_k)^5 f^{(4)}(\xi_1),\quad \xi_1 \in (x_k,x_{k+1})
$$

当步长折半，

$$
\int_{x_k}^{x_{k+1}} f(x)\,dx\approx S_k^{(1)}+S_k^{(2)}+C(\frac{h_k}{2})^5 (f^{(4)}(\tilde{\xi_1})+f^{(4)}(\tilde{\xi_2}))
$$

假设$f^{(4)}(\xi) \approx f^{(4)}(\tilde{\xi_1}) = f^{(4)}(\tilde{\xi_2})$,
此时:

$$
\int_{x_k}^{x_{k+1}} f(x)\,dx\approx S_k^{(1)}+S_k^{(2)}+\frac{e_k}{16}
$$

故

$$
    e_k = [(S_k^{(1)}+S_k^{(2)})-S_k]\frac{16}{15}\thicksim \frac{h_k}{b-a}\epsilon 
$$

定义$\displaystyle \widetilde{e_k} = \frac{1}{16}e_k = \frac{1}{15}[(S_k^{(1)}+S_k^{(2)})-S_k]$.
保守处理，如果:

$$
\frac{1}{10}(S_k^{(1)}+S_k^{(2)}-S_k) \le \epsilon \,\,\frac{h_k}{b-a}
$$

则通过检验。

### 算法描述

1. 正在估计的区间（A active interval）
2. 已通过检验的区间，积分值$I_s(f)$ （S safe interval）
3. 未处理的区间（N not examined）

初始化： $S =\emptyset $,$A = [a,b]$
对于$A= [\alpha,\beta]$，

1. 如果通过检验，则$S = S \cup A$,$A=N$
2. 如果未通过检验，则$A = [\alpha,\frac{\alpha+\beta}{2}]$, $N = [\frac{\alpha+\beta}{2},\beta]\cup N $,继续操作。

## 谱精度

### Euler-Maclaurin公式

 $\cdot$ Bernoulli多项式：

$$
B_0(x)=1,B_n' = B_{n-1},\int_0^1 B_n(x)\,dx = 0,\quad n=1,2,\cdots
$$

 $\cdot$ Bernoulli数：

$$
b_n =\triangleq n!\,B_n(0),\quad n=0,1,\cdots
$$

$B_n(0) = B_n(1),n \ge 2$

**引理**

$$
B_n(x) = (-1)^n B_n(1-x)\qquad \forall x \in \mathbb{R},\quad n \in \mathbb{N}
$$

  推论: 对$B_n(x)$在$[0,1]$外做周期延拓，则当$n$为偶数时$\tilde{B_n}$为偶；$n$为奇数时，$\tilde{B_n}$为奇。

**引理**

    $B_{2n+1}(n\ge 1)$在$[0,1]$上有且仅有三个根 $\displaystyle x= 0,\frac{1}{2},1$,$B_{2n}(n= 0,1,\cdots)$，满足$B_{2n}(0)\neq 0$

**证明**

    由于：

$$
B_{2n+1}(0) = B_{2n+1}(1), B_{2n+1}(0) = -B_{2n+1}(1)
$$

    则我们有:

$$
B_{2n+1}(0) = 0 = B_{2n+1}(1)
$$

    同样对引理2.1可得: $\displaystyle B_{2n+1}(\frac{1}{2}) = 0$
    下面证明仅有:
    假设对于$B_3$已经成立。假设存在$\displaystyle x_0\in(0,\frac{1}{2})$,
    \,\, $B_{2n+1}(x_0)=0$。
    则我们也会得到$B_{2n-1}$存在一个根在$(0,\frac{1}{2})$,与归纳假设矛盾。

    下面考虑对于$B_{2n}$的情况,由于$B_{2n+1}$有三个零点$0,\frac{1}{2},1$,故$B_{2n}$在$(0,\frac{1}{2}),(\frac{1}{2},1)$上均有零点。

    如果$B_{2n}(0) = B_{2n}(1)=0$,由Rolle定理:$B_{2n-1}$在$(0,\frac{1}{2})$上有零点，矛盾！故综上命题成立

 $\cdot$ Euler-Maclaurin公式:

**定理**

$$
\widetilde{B_{2m}} (x) = 2\,(-1)^{m-1}\sum_{k=1}^{\infty} \frac{cos 2\pi kx}{(2\pi k)^{2m}}
$$

$$
\widetilde{B_{2m+1}}(x) = 2\,(-1)^{m+1}\sum_{k=1}^{\infty} \frac{sin 2\pi kx}{(2\pi k)^{2m+1}}
$$

由$B_{2m}(0)\neq 0$,知 $b_{2m}\neq 0,  m\in \mathbb{N}$

**定理**

        Euler-Maclaurin公式:

$$
I(f) - I_T(f) = -\sum_{j=1}^{[\frac{m}{2}]}\frac{b_{2j}h^{2j}}{(2j)!}(f^{(2j-1)}(b)-f^{(2j-1)}(a)) +(-1)^m h^m \int_a^b \widetilde{B_m}(\frac{x-a}{h})f^{(m)}(x)\,dx
$$

        $I_T$这里是梯形公式。

**证明**

$$
\int_0^1 B_1(z)g'(z)\,dz = \int_0^1 (z-\frac{1}{2}) g'(z)\,dz = \int_0^1 z\,dg -\frac{1}{2}(g(1)-g(0)) = \frac{1}{2}(g(1)+g(0)) - \int_0^1 g\,dz
$$

    同时上式也为:

$$
\int_0^1 g'(z) \,dB_2 = g'B_2\mid_0^1 - \int_0^1 g''B_2\,dz = b_2(g'(1)-g'(0)) - \int_0^1 g''B_2\,dz
$$

    这样我们可以通过分部积分一直展开。

$$
        \int_0^1 g(z)\,dz = \frac{1}{2}(g(0)+g(1)) - \sum_{j=1}^{[\frac{m}{2}]}\frac{b_{2j}}{(2j)!}\big[g^{(2j-1)}(1)-g^{(2j-1)}(0)\big]+(-1)^m \int_0^1 B_m(z) g^{(m)}(z)\,dz
    
$$

    此时设 $x=x_k + hz$,$g(z) = f(x_k+hz)$,$z\in [0,1]$,代入得到 $\int_{x_k}^{x_{k+1}} f(x)\,dx$ 的估计，再对k求和即可。

 推论:设$f\in C_{2\pi}^{2m+1}$($2\pi$周期,$C^{2m+1}$)则有：

$$
|E_T(f)| \le C h^{2m+1}\int_0^{2\pi}|f^{(2m+1)}(z)|\,dz
$$

### 谱精度

**定理**

    设$f:\mathbb{R} \to \mathbb{R}$实解析（任一点$x$处的Taylor 展式，存在邻域$B_{r(x)}(x)$在复域上收敛），以$2\pi$为周期，则存在$D = \mathbb{R} \times (-\alpha,\alpha) \subset \mathbb{C}$
    ,$\alpha >0$，使得$f$在$D$上解析，并且:

$$
|E_T(f)| \le \frac{4\pi M}{e^{n\alpha}-1},\qquad M\triangleq \sup_{z\in D}|f(z)|,\quad h = \frac{2\pi}{n}
$$

我们要用到以下的两个引理：

**引理**

$$
\int_{i\alpha}^{i\alpha +2\pi} - \int_{-i\alpha}^{-i\alpha +2\pi} \, cot \frac{n \xi}{2}\,f(\xi)\,d\xi = -\frac{4\pi \,i}{n}\sum_{k=1}^{n} f(\frac{2 k \pi}{n})
$$

**引理**

$$
\Re \int_{i\alpha}^{i\alpha +2\pi} f(\xi)\,d\xi = \int_{0}^{2\pi} f(x)\,dx
$$

**证明**

    由前述的两个引理，我们有：

$$
E_n(f) = \Re \int_{i\alpha}^{i\alpha+2\pi} (1-i\,cot \frac{n \xi}{2}\,f(\xi))f(\xi)\,d\xi
$$

    并且

$$
cot\,\xi = \frac{e^{2i\xi}+1}{e^{2i\xi}-1} i
$$

    则有:

$$
E_n(f) = \Re \int_{0}^{2\pi} \frac{1+e^{2i(i\alpha+\theta)\frac{n}{2}}}{-1+e^{2i(i\alpha+\theta)\frac{n}{2}}}f(i\alpha+\theta)\,d\theta
$$

    即:

$$
E_n(f) = \Re \int_{0}^{2\pi} \frac{2e^{-n\alpha}e^{in\theta}}{e^{-n\alpha}\cdot e^{in\theta}-1}f(i\alpha+\theta)\,d\theta
$$

    放缩即可，证毕！
