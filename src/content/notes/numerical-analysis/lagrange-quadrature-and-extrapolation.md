---
title: "Carleman 线性化实验笔记模板"
description: "数值分析课程笔记：Carleman 线性化实验笔记模板。"
publishDate: 2026-05-11
updatedDate: 2026-05-11
tags:
  - numerical-analysis
  - scientific-computing
category: "Numerical Analysis"
type: "course-note"
draft: false
---

## 基本技术

### Lagrange 插值

$$
I(f) = \int_a^b f(x) \, dx
$$

中点公式：

$$
I(f) \approx (b-a) f\left(\frac{a+b}{2}\right)
$$

这里的$f\approx l_0(x)\in P_0$，
梯形公式：

$$
I(f) \approx \frac{b-a}{2} \left( f(a)
+ f(b) \right)
$$

这里的$I(f)\approx I_1(f)=\frac{f(a)+f(b)}{2}(b-a)$
一般情形：

$$
I(f) \approx I(l_n(x)) \triangleq I_n(f)
$$

其中$l_n(x)$是$f$在节点$x_0, x_1, \ldots, x_n$上的Lagrange插值多项式。

$$
l_n(x) = \sum_{k=0}^{n} l_{n,k}(x)y_k
$$

这里$y_k = f(x_k)$，$l_{n,k}(x) = \prod_{j=0, j\neq k}^{n} \frac{x-x_j}{x_k-x_j}$，$x_k = a+kh$，$h = \frac{b-a}{n}$。
考虑换元：$ x\in [a,b] \to t\in [0,n]$，$t = \frac{x-a}{h}$，$x_j \to j$,$\displaystyle l_{n,k}(x) \to l_{n,k}(t) = \prod_{j=0, j\neq k}^{n} \frac{t-j}{k-j} \triangleq \hat{l}_{n,k}(t)$。

$$
\begin{aligned}
I_n(f) &= \int_a^b l_n(x) \, dx \\
&=  \int_0^n \sum_{k=0}^{n} f(x_k)  \hat{l}_{n,k}(t) h \, dt \\
&=  \sum_{k=0}^{n} f(x_k)\, \mathcal{C}_{k}^{(n)}\,(b-a)
\end{aligned}
$$

这里$\mathcal{C}_{k}^{(n)} = \frac{1}{n} \int_0^n \hat{l}_{n,k}(t) \, dt$。
具体来说为:

$$
\mathcal{C}_{k}^{(n)} = \frac{(-1)^{n-k}}{nk!(n-k)!} \int_0^n \prod_{j\neq k} (t-j) \, dt
$$

Rmk:我们也把$ n =3 $的情况称为 Simpson 公式，$n=4 $的情况称为 Cotas 公式。

Rmk: 当 $n\ge 8$时，$\mathcal{C}_{k}^{(n)}$ 有正有负，且:

$$
\sum_{k=0}^{n} |\mathcal{C}_{k}^{(n)}| \to \infty \quad (n\to \infty)
$$

此时数值不稳定。
具体分析:

$I_n(f) \thicksim  \sum_{k} \mathcal{C}_k^{(n)} f(x_k)$，但计算机上我们计算的是 $\tilde{I_n}(f) \thicksim \sum_{k} \mathcal{C}_k^{(n)} \tilde{f}(x_k)$，其中 $\tilde{f}(x_k) = f(x_k) + \epsilon_k$，$\epsilon_k \thicksim \mathcal{N}(0,\epsilon)$ 是数值误差。

$$
\begin{aligned}
\tilde{I_n}(f) - I_n(f) \leq \sum_{k} |\mathcal{C}_k^{(n)}| \cdot \max_k |\epsilon_k| \approx \epsilon \sum_{k} |\mathcal{C}_k^{(n)}| = \mathcal{O}(\epsilon)
\end{aligned}
$$

而上述情形只对于 $n\le 7$，亦即$\mathcal{C}_k^{(n)}$ 均非负时成立 （因为$ \displaystyle \sum_{k} \mathcal{C}_k^{(n)} = 1$）
当 $n\ge 8$时，$\sum_{k} |\mathcal{C}_k^{(n)}| $会十分大，数值误差被放大。

### 复合数值积分

我们考虑分片多项式插值：

- 复合中点公式: $\displaystyle M_n = \sum_{k=1}^{n} f(x_{k-\frac{1}{2}})\,h$，这里$x_{k-\frac{1}{2}} = a + (k-\frac{1}{2})h$，$h = \frac{b-a}{n}$。
- 复合梯形公式: $\displaystyle T_n = \sum_{k=0}^{n-1} \frac{f(x_{k}) + f(x_{k+1})}{2}\,h$，这里$x_k = a + kh$。
- 复合 Simpson 公式: $\displaystyle S_n = \sum_{k=0}^{n-1} \frac{f(x_{k}) + 4f(x_{k+\frac{1}{2}}) + f(x_{k+1})}{6}\,h$。

下面我们考虑这样的问题:

$$
T_{2n} = \sum_{k=0}^{n-1} \frac{f(x_{k}) + f(x_{k+\frac{1}{2}})}{2}\,\frac{h}{2} + \frac{f(x_{k+\frac{1}{2}}) + f(x_{k+1})}{2}\,\frac{h}{2}
$$

$$
T_{2n} = \frac{h}{4} \sum_{k=0}^{n-1} \Big(f(x_k) + 2f(x_{k+\frac{1}{2}}) + f(x_{k+1})\Big) = \frac{1}{2} M_n + \frac{1}{2} S_n
$$

同样我们有:

$$
S_n = \frac{1}{3}T_n +\frac{2}{3}M_n
$$

由$M_n = 2T_{2n} - S_n$，我们可以得到:$\displaystyle S_n = \frac{1}{3}T_n +\frac{2}{3}(\,2\,T_{2n}-T_n) = \frac{4}{3}T_{2n} - \frac{1}{3}T_n$

类似地我们可以得到:

$$
C_n = \frac{4^2 S_{2n} - S_n}{4^2 - 1}
$$

### 外推算法

对于$h\ll 1$, 我们有

$$
f(h) = f(0) + c_1 h^{p_1} + c_2 h^{p_2} + \cdots,\quad\mathbb{N}\ni p_1 < p_2 < \cdots
$$

$$
f(\frac{h}{2}) = f(0) + c_1 \left(\frac{h}{2}\right)^{p_1} + c_2 \left(\frac{h}{2}\right)^{p_2} + \cdots
$$

此时我们有:

$$
\frac{1}{2^{p_1}}f(h) - f(\frac{h}{2}) = (\frac{1}{2^{p_1}} - 1)f(0) + \mathcal{O}(h^{p_2})
$$

考虑近似：

$$
\tilde{f}(h) \triangleq  \frac{\frac{1}{2^{p_1}}f(h) - f(\frac{h}{2})}{\frac{1}{2^{p_1}} - 1} = \frac{2^{p_1}f(\frac{h}{2}) - f(h)}{2^{p_1} - 1} = f(0) + \mathcal{O}(h^{p_2})
$$

因此当我们知道级数展开时，可以通过外推法很快地逼近。

- Richardson 外推法

Romberg 积分：

$$
T(h) = I(f) + c_1 h^2 + c_2 h^4 + \cdots
$$

$$
\displaystyle
\begin{cases}
    T_1^{(l)} = T_{2^l},\quad l = 0,1,\ldots \\
    T_{m+1}^{(k-1)} = \frac{4^m T_{m}^{(k)} - T_{m}^{(k-1)}}{4^m - 1},\quad m = 1,2,\ldots,l; k = 1,2,\ldots l-m
\end{cases}
$$

## 误差分析

### Lagrange 插值积分

- 中点公式

$$
\int_a^b f(x)\,dx -(b-a)f(\frac{a+b}{2}) = \int_a^b (f(x) - l_0(x))\,dx
$$

而:

$$
f(x) - l_n(x) = \frac{\omega_{n+1}(x)}{(n+1)!}\,f^{(n+1)}(\xi_x),\quad \xi_x \in [a,b]
$$

则:

$$
e_M = \int_a^b \omega_1(x)\,f'(\xi(x))\,dx \thicksim \mathcal{O}(h^2),\quad |b-a| \thicksim \mathcal{O}(h)
$$

rmk: $\displaystyle \omega_{n+1}(x) = \prod_{k=0}^{n} (x-x_k)$

对于：

$$
f(x) = f(\frac{a+b}{2})+ f'(\frac{a+b}{2})(x-\frac{a+b}{2}) + \frac{f''(\xi(x))}{2!}(x-\frac{a+b}{2})^2
$$

此时:$\displaystyle f(x) -f(\frac{a+b}{2}) = f'(\frac{a+b}{2})(x-\frac{a+b}{2}) + \frac{f''(\xi(x))}{2!}(x-\frac{a+b}{2})^2$，

因此:

$$
\begin{aligned}
    e_M &= \int_a^b f'(\frac{a+b}{2})(x-\frac{a+b}{2}) + \frac{f''(\xi(x))}{2!}(x-\frac{a+b}{2})^2 \, dx \\
    &= \int_a^b \frac{f''(\xi(x))}{2!}(x-\frac{a+b}{2})^2 \, dx  = \frac{f''(\xi)}{2}\frac{1}{12}(b-a)^3  =\frac{1}{24}f''(\xi)(b-a)^3\thicksim \mathcal{O}(h^3)
\end{aligned}
$$

Rmk: 这里的 $\xi$ 是 $[a,b]$ 上的某个点,$\xi(x)$是关于$x$的连续函数。

- 梯形公式

$$
e_T = \int_a^b (f(x)-l_1(x))\,dx = \int_a^b \frac{\omega_2(x)}{2!}f''(\xi_x)\,dx = \int_a^b \frac{(x-a)(x-b)}{2}f''(\xi_x)\,dx = -\frac{1}{12}f''(\xi)(b-a)^3
$$

- Simpson 公式

简单估计的精度为$\mathcal{O}(h^4)$,但我们可以进行改进:
考虑如下的Hermite 插值:

$$
\begin{cases}
    \displaystyle p_3(a) = f(a),\quad p_3(b) = f(b),\\
    \displaystyle p_3(\frac{a+b}{2}) = f(\frac{a+b}{2}),\quad p_3'(\frac{a+b}{2}) = f'(\frac{a+b}{2}) \\
\end{cases}
$$

而由于数值积分只用到了$a,b,\frac{a+b}{2}$处的函数值，因此我们有:

$$
\int_a^b (f-l_2)\,dx = \int_a^b (f-p_3)\,dx
$$

而对于Hermite 插值，我们有:

$$
f(x) - p_3(x) = \frac{\Omega_4(x)}{4!}f^{(4)}(\xi_x),\quad \xi_x \in [a,b]
$$

其中$\displaystyle \Omega_4(x) = (x-a)(x-\frac{a+b}{2})^2(x-b)$。
因此：

$$
\begin{aligned}
    e_S &= \int_a^b \frac{\Omega_4(x)}{4!}f^{(4)}(\xi(x))\,dx = \int_a^b \frac{(x-a)(x-\frac{a+b}{2})^2(x-b)}{24}f^{(4)}(\xi(x))\,dx \\
    &= -\frac{1}{2880}f^{(4)}(\xi)(b-a)^5
\end{aligned}
$$

Rmk: 这里的 $\xi$ 是 $[a,b]$ 上的某个点,$\xi(x)$是关于$x$的连续函数。

偶数次会有更高的精度，奇数则与比他小1的偶数精度相同。

- 一般Lagrange插值积分误差

当 $n$ 为奇数时，$E_n = \displaystyle \frac{K_n}{(n+1)!}(b-a)^{n+2}f^{(n+1)}(\xi)$,$\xi \in (a,b)$

当 $n$ 为偶数时，$E_n = \displaystyle \frac{M_n}{(n+2)!}(b-a)^{n+3}f^{(n+2)}(\xi)$,$\xi \in (a,b)$

而上面的结果只能在$n\le 7$时有用，$n\ge 8$时无数值稳定性。
Rmk:

$$
K_n = \int_{0}^{n} \Pi_{n+1}(t)\,dt,\quad M_n = \int_{0}^{n} t\,\,\Pi_{n+1}(t)\,dt
$$

这里：$\displaystyle \Pi_{n+1}(t) = \Pi_{t=0}^{n}(t-i)$

- 分片 Lagrange 插值积分

$$
I_h(f) = \sum_j \int_{x_j}^{x_{j+1}} f(x)\,dx \approx \sum_j I(P_k^{(j)}(x)),\quad P_k^{(j)}\in \mathbb{P}_k
$$

$$
e_h \triangleq I(f) - I_h(f)
$$

Rmk:逼近阶

$$
|e_h| \le C \cdot h^p
$$

则称为 $p$阶收敛。

误差估计:

$$
|e_h| \le \begin{cases}
    \displaystyle \frac{K_n}{(n+1)!}h^{n+1}L_{n+1}\sum_j h_j, \quad \text{n为奇数}\\
    \displaystyle \frac{M_n}{(n+2)!}h^{n+2}L_{n+2}\sum_j h_j,\quad \text{n 为偶数}
\end{cases}
$$

$$
L_{n+1}\triangleq \max_{\xi \in[a,b]}|f^{(n+1)}(\xi)|
$$

数值上的逼近阶验证:

$$
\begin{aligned}
    &e_h \thicksim Ch^p\\
    &e_{\frac{h}{2}} \thicksim C\frac{h}{2}^p\\
    &ln(\frac{|e_h|}{|e_{\frac{h}{2}}|}) \thicksim p \,\, ln(2)
\end{aligned}
$$

因此我们有：

$$
p\approx ln(\frac{|e_h|}{|e_{\frac{h}{2}}|})/ln(2)
$$
