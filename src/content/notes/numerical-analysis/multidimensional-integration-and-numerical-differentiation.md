---
title: "多维积分与数值微分"
description: "数值分析课程笔记：多维积分与数值微分。"
publishDate: 2026-05-11
updatedDate: 2026-05-11
tags:
  - numerical-analysis
  - scientific-computing
category: "Numerical Analysis"
type: "course-note"
draft: false
---

## 多维数值积分

- 积分约化

$$
I(f) = \int_{\Omega} f(x,y)\,dx\,dy
$$

其中：

$$
\Omega = \{(x,y)\mid a\le x \le b, \phi_1(x)\le y \le \phi_2(x)\}
$$

则:

$$
\begin{aligned}
    I(f) &= \int_{a}^{b} \int_{\phi_1(x)}^{\phi_2(x)} f(x,y)\,dy\,dx\\
    &\approx \sum_{i=1}^{N^x} \alpha_i F(x_i) = \sum_{i=1}^{N^x} \sum_{j=1}^{n_i^y} \beta_j^i f(x_i,y_j^i)
\end{aligned}
$$

- 复合求积

$$
\Omega = \bigcup_{T\in\mathcal{T}_h} T
$$

其中$T$为单纯形。
则有:

$$
\int_{\Omega} f(x,y)\,dx\,dy = \sum_{T \in \mathcal{T}_h} \int_T f(x,y)\,dx\,dy
\approx \sum_T \sum_{j=0}^{d_k-1}\alpha_j^T f(x_j^T)
$$

这里的$d_k$是插值点数。

$$
\int_T f(x,y)\,dx \,dy \approx \int_T \sum_{j=0}^{d_k-1}f_j l_j(x,y)\,dx\,dy = \sum_j f_j\int_T l_j(x,y)\,dx\,dy
$$

$$
\sum_j f_j \int_T l_j(x,y)\,dx\,dy
= \sum_j f_j \int_{\hat{T}} \tilde{l}_j(\hat{x},\hat{y})
\frac{\partial(x,y)}{\partial(\hat{x},\hat{y})}\,d\hat{x}\,d\hat{y}.
$$

整理后上式即为：

$$
\sum_j 2f(x_j^T) |T| \int_{\hat{T}}\tilde{l}_j(\hat{x},\hat{y})\,d\hat{x}\,d\hat{y}
$$

特例:
$d_k=1, k=0$

$$
I_h^0(f) = \sum_T (f(x_0^T)|T|)
$$

$d_k = 3, k=1$

$$
I_h^1(f) = \sum_T \sum_{j=0}^2 2f(x_j^T)|T|\frac{1}{6} = \sum_T (\sum_{j=0}^2 f(x_j^T)\frac{|T|}{3})
$$

## 数值微分

- 基本做法

$$
f'(x) \approx (L_n(x))'
$$

对于Lagrange插值：

$$
f(x) = L_n(x)+R_n(x)
$$

其中

$$
L_n(x) = f[x_0]+f[x_0,x_1](x-x_0) +\cdots + f[x_0,\cdots,x_n]w_n(x)
$$

$$
R_n(x) = f[x_0,\cdots,x_n,x]\,w_{n+1}(x)
$$

此时我们有:

$$
L_n'(x_0) = f[x_0,x_1]+\cdots + f[x_0,x_1,\cdots,x_n] (x_0-x_1)\cdots(x_0-x_{n-1})
$$

$$
R_n'(x_0) = f[x_0,\cdots,x_n,x_0] (x_0-x_1)\cdots(x_0-x_n) = \frac{f^{(n+1)}(\xi)}{(n+1)!}(x_0-x_1)\cdots(x_0-x_n)
$$

我们考虑$n$的各种取值:

- $n=1$

 $x_1 = x_0+h$:

$$
f'(x_0)\approx \frac{f(x_1)-f(x_0)}{x_1-x_0},\quad e_h = \frac{f''(\xi)}{2}h
$$

- $n=2$

 $x_k = x_0+kh, k=1,2$:

$$
f'(x_0) \approx \frac{f(x_1)-f(x_0)}{h} - h \cdot \frac{f(x_2)-2f(x_1)+f(x_0)}{2h^2} = \frac{-f_2+4f_1-3f_0}{2h}
$$

同样我们取:
 $x_{-1},x_0,x_1$

$$
f'(x_0) \approx \frac{f(x_1)-f(x_{-1})}{2h},\qquad e_h = \mathcal{O}(h^2)
$$

我们称这个为中心差商

 Rmk:
- “谱导数”，即取$L_n(x)$为Gauss 点上的Lagrange 插值
- 本质: Taylor 展开

这里我们有:

$$
\begin{aligned}
    & (\alpha_1 \cdot) f(x_1) = f(x_0) + f'(x_0)h+\frac{1}{2}f''(x_0)h^2+\cdots\\
    & (\alpha_0 \cdot) f(x_0)\\
    & (\alpha_{-1} \cdot) f(x_{-1}) = f(x_0) - f'(x_0)h+\frac{1}{2}f''(x_0)h^2+\cdots
\end{aligned}
$$

则我们有:

$$
\sum_{i=-1}^{1} \alpha_i f(x_i) = f'(x_0)\beta_1 h + f''(x_0)\beta_2 h^2+\cdots
$$

- 数值稳定性

以中心差商为例:

$$
f'(x_0) \approx \frac{f_1-f_{-1}}{2h} \triangleq f_h'
$$

我们已知：

$$
|f_h'-f'|\le Ch^2
$$

但在数值计算上:

$$
\tilde{f_h'} = \frac{\tilde{f}_1 -\tilde{f}_{-1}}{2h},\qquad \tilde{f}_k = f_k + \epsilon_k,\quad |\epsilon_k| \le \epsilon, k = \pm 1
$$

则:

$$
|\tilde{f_h'} - f'| \le |f_h'-f'|+|\tilde{f_h'} -f_h'|
\le |\frac{\epsilon_1 - \epsilon_{-1}}{2h}| + Ch^2 \le \frac{\epsilon}{h} +Ch^2
$$

此时我们取:

$$
\frac{\epsilon}{2h} =Ch^2 \Longrightarrow h_{opt} = (\frac{\epsilon}{2C})^{1/3}
$$

则有:

$$
|\tilde{f_h'} - f'|\le \frac{\epsilon}{2h_{opt}} \cdot 3 = \frac{3\dot (2C)^{1/3}}{2}\epsilon^{2/3}
$$

因此平衡bias和Noise是重要的。

- 紧致格式

如何用三点上的插值得到更高的精度。

$$
h\sum_{k=-m}^{m} \alpha_k f_{i-k}' = \sum_{k=-m'}
^{m'}\beta_k f(x_{i-k})
$$
