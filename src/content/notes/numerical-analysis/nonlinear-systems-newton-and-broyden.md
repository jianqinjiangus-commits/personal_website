---
title: "非线性方程组数值解（Notes 4）"
description: "数值分析课程笔记：非线性方程组数值解（Notes 4）。"
publishDate: 2026-05-11
updatedDate: 2026-05-11
tags:
  - numerical-analysis
  - scientific-computing
category: "Numerical Analysis"
type: "course-note"
draft: false
---

## Lec 14: 非线性方程组数值解

考虑

$$
F(X)=0,\qquad F:\R^d\to\R^d.
$$

设迭代格式为

$$
X_{k+1}=\varphi(X_k).
$$

在 $X_k$ 处作一阶展开：

$$
F(X)\approx F(X_k)+J_F(X_k)(X-X_k)=0.
$$

于是得到 Newton 迭代

$$
X_{k+1}=X_k-J_F(X_k)^{-1}F(X_k),
$$

并记

$$
\varphi(X)=X-J_F(X)^{-1}F(X).
$$

## 局部收敛性判据

**定理（谱半径判据）**

若

$$
\rho\bigl(J_\varphi(X^*)\bigr)=\sigma<1,
$$

则迭代法在 $X^*$ 的某邻域内局部收敛。

**证明**

由矩阵谱半径与诱导范数关系，可取某范数使

$$
\|J_\varphi(X^*)\|\le \sigma+\varepsilon<1.
$$

对 $X_k$ 充分接近 $X^*$，有

$$
\begin{aligned}
\|X_{k+1}-X^*\|
&=\|\varphi(X_k)-\varphi(X^*)\|\\
&=\left\|\int_0^1 d\varphi\bigl(tX_k+(1-t)X^*\bigr)(X_k-X^*)\,dt\right\|\\
&=\left\|\int_0^1 J_\varphi\bigl(tX_k+(1-t)X^*\bigr)(X_k-X^*)\,dt\right\|\\
&\le \left\|\int_0^1 J_\varphi\bigl(tX_k+(1-t)X^*\bigr)dt\right\|\cdot\|X_k-X^*\|\\
&\le L\|X_k-X^*\|,
\end{aligned}
$$

其中 $L<1$（当邻域取得足够小时）。故由压缩映像思想得局部收敛。

## Newton 法收敛阶

假设 $F\in C^2$。

由

$$
\varphi(X)=X-J_F(X)^{-1}F(X)
$$

可得

$$
J_\varphi(X^*)=I-J_F(X^*)^{-1}J_F(X^*)=0,
$$

因此 Newton 法至少是局部超线性收敛。

**定理（Newton 二次收敛）**

若 $J_F(X^*)$ 非奇异，且 $F\in C^2$，则 Newton 法局部二次收敛：

$$
\|X_{k+1}-X^*\|\le C\|X_k-X^*\|^2.
$$

**证明**

$$
\begin{aligned}
X_{k+1}-X^*
&=X_k-J_F^{-1}(X_k)F(X_k)-X^*\\
&=X_k-X^*-J_F^{-1}(X_k)\bigl(F(X_k)-F(X^*)\bigr)\\
&=-J_F^{-1}(X_k)\Bigl(F(X_k)-F(X^*)-J_F(X_k)(X_k-X^*)\Bigr)\\
&=-J_F^{-1}(X_k)\left(\int_0^1\left(J_F\bigl(tX_k+(1-t)X^*\bigr)-J_F(X_k)\right)dt\right)(X_k-X^*).
\end{aligned}
$$

又因 $J_F$ 可微，

$$
J_F\bigl(tX_k+(1-t)X^*\bigr)-J_F(X_k)
=\int_0^1 dJ_F\!\bigl(X_k+s(t-1)(X_k-X^*)\bigr)\,ds\,(t-1)(X_k-X^*).
$$

代回并估计即可得

$$
\|X_{k+1}-X^*\|\le C\|X_k-X^*\|^2.
$$

故二次收敛成立。

## 拟 Newton 法: Broyden 方法

设

$$
X_{k+1}=X_k-A_k^{-1}F(X_k),
$$

其中 $A_k$ 近似 Jacobian，并满足割线条件

$$
A_k(X_k-X_{k-1})=F(X_k)-F(X_{k-1}).
$$

记

$$
\gamma_{k-1}:=X_k-X_{k-1},\qquad g_{k-1}:=F(X_k)-F(X_{k-1}).
$$

对 $\{A_k\}$ 采用秩 1 修正

$$
A_k=A_{k-1}+vw^T.
$$

由

$$
(A_{k-1}+vw^T)\gamma_{k-1}=g_{k-1}
$$

得

$$
v=\frac{g_{k-1}-A_{k-1}\gamma_{k-1}}{w^T\gamma_{k-1}}.
$$

又由迭代关系可写

$$
g_{k-1}-A_{k-1}\gamma_{k-1}=F(X_k),
$$

故

$$
v=\frac{F(X_k)}{w^T\gamma_{k-1}}.
$$

常见选择：

- 选 $w=\gamma_{k-1}$；
- 选 $w=F(X_k)$（此时 $vw^T$ 对称）。

利用 Sherman--Morrison 公式：

$$
(A+vw^T)^{-1}
=A^{-1}-\frac{(A^{-1}v)(w^TA^{-1})}{1+w^TA^{-1}v}.
$$

可高效更新逆矩阵近似。

**注**

课堂结论：Broyden 方法在适当假设下具有局部超线性收敛。
