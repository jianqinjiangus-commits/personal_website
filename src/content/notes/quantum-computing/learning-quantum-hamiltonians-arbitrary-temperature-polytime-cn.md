---
title: "任意温度下以多项式时间学习量子哈密顿量"
description: "论文阅读笔记：Learning Quantum Hamiltonians in Polynomial Time at Any Temperature（arXiv:2310.02243v1）。"
publishDate: 2026-05-16
updatedDate: 2026-05-16
tags:
  - quantum-computing
  - hamiltonian-learning
  - gibbs-state
  - paper-reading
category: "Quantum Computing"
type: "paper-note"
draft: false
---

# 任意温度下以多项式时间学习量子哈密顿量

Ainesh Bakshi  
ainesh@mit.edu  
MIT

Allen Liu  
cliu568@mit.edu  
MIT

Ankur Moitra  
moitra@mit.edu  
MIT

Ewin Tang  
ewin@berkeley.edu  
UC Berkeley

## 摘要

我们研究如下问题：给定局域量子哈密顿量 $H$ 在已知逆温度 $\beta>0$ 下的 Gibbs 态

$$
\rho=\frac{e^{-\beta H}}{\operatorname{tr}(e^{-\beta H})}
$$

的若干份拷贝，学习该局域量子哈密顿量。Anshu、Arunachalam、Kuwahara 和 Soleimanifar [AAKS20] 给出了一个算法，可以只用多项式多份 Gibbs 态拷贝，将 $n$ 个量子比特上的哈密顿量学习到精度 $\varepsilon$，但是该算法需要指数时间。给出一个计算上高效的算法一直是一个重要开放问题 [Alh22; AA23]，此前的工作只在高温 [HKT22] 或对易项 [AAKS21] 这些受限情形中解决了这一问题。我们完全解决了这个问题，给出一个多项式时间算法，用多项式多份 Gibbs 态拷贝，在任意常数 $\beta>0$ 下将 $H$ 学习到精度 $\varepsilon$。

我们的主要技术贡献是对指数函数的一种新的平坦多项式近似，以及多变量标量多项式和嵌套对易子之间的转换。这使我们能够把哈密顿量学习表述为一个多项式系统。然后我们证明，求解这个多项式系统的一个低次数平方和松弛，就足以精确学习该哈密顿量。

arXiv:2310.02243v1 [quant-ph] 2023 年 10 月 3 日

## 目录

1. 引言  
   1.1 我们的结果  
   1.2 技术概览  
   1.3 更多相关工作  
2. 背景  
   2.1 线性代数  
   2.2 相互作用系统的哈密顿量  
   2.3 量子系统上局域算子的性质  
   2.4 嵌套对易子的界  
   2.5 平方和多项式  
   2.5.1 平方和框架  
3. 多项式与嵌套对易子之间的转换  
4. 指数函数的多项式近似  
5. 访问 Gibbs 态：量子部分  
6. 算法与分析  
7. 可行性证明（Lemma 6.4）  
8. 对易子很小的平方和证明（Lemma 6.6）  
9. 可识别性的平方和证明（Lemma 6.7）  
   9.1 控制误差项：从多项式到嵌套对易子  
   9.2 平方和中的局域边缘没有小质量  
10. 一个更快的算法  
致谢  
A. Theorem 2.13 的证明  
   A.1 重新证明引理  
   A.2 应用引理  
B. Theorem 4.6 的证明

# 1 引言

量子计算激发了人们对扩大和控制量子系统规模的极大兴趣 [GAN14]。这种兴趣的增长，也伴随着对更好算法的需求，这些算法用于刻画和验证这些系统 [CEKKZ21]。在控制和验证量子系统时，一个核心计算任务是哈密顿量学习；其目标是从测量中估计一个相互作用量子多体系统的物理性质，也就是相互作用强度 [Cra+10; SLP11; BAL19; AAKS20]。形式上，我们考虑一个格点上的 $n$ 个量子比特，即局域维数为二的量子粒子。[^1] 所得系统由一个哈密顿量刻画，该哈密顿量是一个 $2^n\times 2^n$ 的复 Hermitian 矩阵，形式为

$$
H=\sum_{a=1}^m \lambda_a E_a,
$$

其中一项 $E_a$ 编码至多 $K$ 个粒子上的相互作用，而系数 $\lambda_a\in[-1,1]$ 是相应相互作用的强度。我们假设系统已经在已知逆温度 $\beta$ 下达到热平衡；在这种情况下，它处于密度矩阵为

$$
\rho=\frac{e^{-\beta H}}{\operatorname{tr} e^{-\beta H}}
$$

的 Gibbs 态。该密度矩阵由配分函数 $\operatorname{tr} e^{-\beta H}$ 归一化，这保证了 $\rho$ 的迹为一。哈密顿量学习问题的目标是：在能够制备 Gibbs 态拷贝的条件下，估计这些 $\lambda_a$。

**问题（哈密顿量学习，Problem 1，非正式）。** 考虑常数维格点上的 $n$ 个量子比特。令

$$
H=\sum_{a=1}^m \lambda_a E_a\in \mathbb C^{2^n\times 2^n}
$$

为一个哈密顿量，其中各项 $E_a$ 是已知的、互不相同的、非恒等的 Pauli 算子，支撑在至多 $k$ 个量子比特上，并且相对于格点是局域的。进一步假设系数 $\lambda_a\in\mathbb R$ 满足 $|\lambda_a|\le 1$。给定相应 Gibbs 态 $\rho$ 在已知逆温度 $\beta>0$ 下的拷贝，以及 $\varepsilon>0$，求估计 $\tilde\lambda_a$，使得对所有 $a\in[m]$，

$$
|\tilde\lambda_a-\lambda_a|\le \varepsilon.
$$

我们关心两个量：所需的 $\rho$ 的拷贝数，也称为样本复杂度；以及算法的运行时间。我们特别关心低温区域中的哈密顿量学习，此时 $\beta$ 是一个任意大的常数。

**动机。** 如上所述，这个问题在科学和工程中具有基础重要性。例如，为了理解凝聚态物理中研究的拓扑序和超导等现象，实验学家会精心设计表现出这些奇异行为的系统。特别地，模拟量子模拟器会被调节为服从像 Fermi-Hubbard 模型这样理解不足的哈密顿量，以便进行实验探索 [GB17; End+11; Hir+23]。[^2] 对这些实验而言，一个自然目标是学习产生各种现象的相互作用 [WGFC14; KBEVZ21]。计算的不可处理性是解决开放问题的主要障碍，例如寻找二维 Fermi-Hubbard 模型的相图，因此更好的算法工具在这一领域具有关键重要性 [LeB+15]。这个问题也出现在量子系统工程中：构建近期量子设备的一大挑战是能够验证它们，也就是认证它们实现了所需的哈密顿量，并理解误差来源 [SLP11; Shu+14]。具有 100 个或更多量子比特的量子设备很难被经典模拟，但量子哈密顿量学习已经成为一种替代性的设备基准测试策略，它结合了量子资源和经典学习技术 [CEKKZ21; GCC22]。

[^1]: 我们的结果并不需要哈密顿量如这里描述的那样具有几何局域性；我们只要求它在 Haah、Kothari 和 Tang [HKT22] 的意义下是低相互作用的。因此，如果量子比特的局域性结构比如说是一个扩张图，我们的算法仍然适用。

[^2]: 也可参见 [GHLS15, Section 5.4.2]，其中给出了面向理论计算机科学家的相关工作描述。

低温设定尤其值得关注，因为量子现象在零温或接近零温时最为显著 [AFOV08]，而这恰恰是高温级数展开失效的地方 [LeB+15]。[^3] 在某种意义上，这是模拟量子模拟器唯一相关的设定，因为高温模型可以用经典计算机求解 [OHZ06, Chapter 8]，无需借助量子模拟。更一般地，低温是计算上有趣的区域，因为量子优势是一种低温现象：“温度缩放”定律表明，只有当 $\beta$ 随系统大小缩放时，量子退火器才能相对于经典计算机实现大幅加速 [AMH17]。

[^3]: 从道义上说，这些展开之所以失效，正是因为存在我们想要理解的非局域量子关联。

**先前工作。** 尽管这个问题很重要，从 Gibbs 态进行哈密顿量学习的计算复杂度仍未被充分理解。Anshu、Arunachalam、Kuwahara 和 Soleimanifar 于 2020 年为这一任务给出了第一个多项式样本复杂度界 [AAKS20]，他们使用

$$
\frac{2^{\operatorname{poly}(\beta)}m^2\log m}{\beta^c\varepsilon^2}
\qquad [\mathrm{AAKS20}]
$$

份 Gibbs 态拷贝得到系数估计 [HKT22, Remark 4.5]。然而，他们的工作有一个严重缺点：计算上不高效。具体而言，他们给出一个随机梯度下降算法，并证明该算法在少量迭代后收敛到真实参数，但实际计算一次迭代需要求值对数配分函数，而即使对经典系统，这也被广泛认为是计算困难的 [Mon15]。

先前工作已经在受限区域中得到哈密顿量学习的快速算法。例如，在一篇后续论文中，Anshu、Arunachalam、Kuwahara 和 Soleimanifar [AAKS21] 证明，当 $H$ 的各项对易时，从经典“Markov 性质”算法直接推广即可高效学习参数。此外，[AAKS20] 指出，在高温，即较小 $\beta$ 下，可以高效求值对数配分函数，因为可以证明它的多变量 Taylor 级数展开快速收敛。Haah、Kothari 和 Tang [HKT22] 后来给出一个改进算法，其样本复杂度和时间复杂度分别达到

$$
\frac{e^{O(\beta)}\log m}{\beta^2\varepsilon^2}
\quad\text{和}\quad
\frac{m e^{O(\beta)}\log m}{\beta^2\varepsilon^2},
\qquad [\mathrm{HKT22}]
$$

他们证明，即使在经典情形中，这些界在指数中的常数因子以外也是紧的。

然而，一个核心开放问题仍然存在 [AAKS20; HKT22; Alh22; AA23]：

**Question 1.** 低温下的哈密顿量学习能否在关于 $n$ 的多项式时间内解决？

实践中，量子多体系统通常在低温运行，这也是大多数宏观现象出现的区域，因此这是该问题最重要的区域。然而，正如我们稍后讨论的，此前并没有提出解决低温哈密顿量学习的策略。事实上，情况还更加严峻：先前设定中用于哈密顿量学习的所有方法在这里都灾难性地失效，因为归约到充分统计量 [AAKS20]、配分函数的高效计算 [AAKS20]、近似 Markov 性质 [KKB20] 和簇展开 [HKT22] 都被证明在足够大的 $\beta$ 下失效。文献的这种状态反映了一个更广泛的现象：除了高温或一维等特殊设定之外，用于理解哈密顿量的已知算法工具十分稀缺。因此，对这个问题给出否定答案看起来是可能的，甚至很可能。事实上，Anshu 和 Arunachalam [AA23] 最近一篇关于学习量子系统复杂度的综述讨论了哈密顿量学习，并在结尾提出两个问题：

**Question 2 ([AA23]).** 在 Gibbs 态满足近似条件独立性的假设下，能否实现哈密顿量学习？[^4]

**Question 3 ([AA23]).** 低温 Gibbs 态是否可能是伪随机的，从而解释为什么难以找到时间高效的算法？

[^4]: 近似条件独立性是 Gibbs 态的一种性质；它已经被证明在一维成立，并被猜测一般成立。

## 1.1 我们的结果

令人惊讶的是，我们对 Question 1 给出了肯定解决。我们的主要结果是一个适用于所有温度的、计算上高效的哈密顿量学习算法。这是一个幸运的发展，因为如果学习在低温区域确实计算困难，那么我们将无法理解模拟量子模拟器在恰好优于经典模拟器的区域中的行为 [Pre18, Section 6.10]。作为我们主要结果的推论，我们也肯定地解决了 Question 2，并否定地解决了 Question 3。

**Theorem 1.1（高效学习量子哈密顿量，Theorem 6.1，非正式）。** 给定 $\varepsilon>0$、$\beta\ge \beta_c$，其中 $\beta_c>0$ 是固定的通用常数，以及一个低相互作用哈密顿量

$$
H=\sum_{a\in[m]}\lambda_aE_a
$$

的 Gibbs 态的 $n$ 份拷贝，存在一个运行时间为 $n^{O(1)}$ 的算法，输出估计 $\{\hat\lambda_a\}_{a\in[m]}$，使得只要

$$
n\ge \operatorname{poly}\left(m,(1/\varepsilon)^{2^{O(\beta)}}\right),
$$

就以至少 $99/100$ 的概率，对所有 $a\in[m]$ 都有

$$
|\lambda_a-\hat\lambda_a|\le \varepsilon.
$$

**Remark 1.2（关于温度）。** 对我们的算法而言，我们只需要知道 $\beta$ 的一个上界，因为我们可以把温度为 $\beta$ 的 Gibbs 态看成温度为例如 $2\beta$、哈密顿量为 $H/2$ 的 Gibbs 态。我们要求 $\beta>\beta_c$ 只是为了简化，$\beta_c$ 可以是任何有正下界的常数。特别地，我们可以把 $\beta_c$ 取为 [HKT22] 的高温算法失效的温度；因此当 $\beta<\beta_c$ 时，我们可以直接调用 [HKT22]，分别达到

$$
\frac{\log m}{\beta^2\varepsilon^2}
\quad\text{和}\quad
\frac{m\log m}{\beta^2\varepsilon^2}
$$

的样本复杂度和时间复杂度。

如先前工作 [AAKS20] 所指出，哈密顿量学习是经典且研究充分的无向图模型学习问题的一种推广，具体地说，是这些模型的参数学习。这个经典问题需要

$$
\frac{e^{O(\beta)}m\log(m)}{\beta^2\varepsilon^2}
$$

时间，并且存在匹配下界的算法，因此对 $\beta$ 的指数依赖是必要的 [HKT22]。[^5] 事实表明，与经典设定的类比作用有限，因为量子设定中固有的非对易性和非局域性排除了经典思想的一般化。不过，通过经典设定，我们可以识别设计时间高效算法的障碍。

[^5]: 将我们的双指数依赖改进为单指数依赖是一个有趣的开放问题。

时间高效的哈密顿量学习面临的一个关键挑战是，我们不能直接处理配分函数。此前唯一一种低温方法 [AAKS20] 只使用 $\rho$ 的拷贝来估计所有 $a\in[m]$ 的 $\operatorname{tr}(E_a\rho)$。经典文献中已知，仅采用这些估计并用它们计算参数 $\lambda_a$，其困难程度与计算配分函数相同 [Mon15]。为了避开这一障碍，我们采用一个更丰富的期望集合 $\operatorname{tr}(P\rho)$，它使我们能够把学习归约为一个可处理但相当复杂的优化问题。在此过程中，我们发展了几个具有独立意义的新工具，并最终给出一个基于平方和层级的半正定规划算法。因此，我们表明优化理论中的精巧现代工具可以令人惊讶地解决哈密顿量学习问题。

## 1.2 技术概览

Anshu、Arunachalam、Kuwahara 和 Soleimanifar [AAKS20] 引入的量子哈密顿量学习方案基于匹配 Gibbs 态 $\rho$ 的局域边缘，而这些局域边缘可以用 $\rho$ 的拷贝来估计。具体而言，对于两个哈密顿量

$$
H=\sum \lambda_aE_a,
\qquad
H'=\sum \lambda'_aE_a,
$$

它们相应的 Gibbs 态为

$$
\rho=\frac{e^{-\beta H}}{\operatorname{tr}(e^{-\beta H})},
\qquad
\rho'=\frac{e^{-\beta H'}}{\operatorname{tr}(e^{-\beta H'})}.
$$

他们证明，当且仅当 $\rho$ 和 $\rho'$ 在局域边缘上一致，即对所有 $a\in[m]$ 都有

$$
\operatorname{tr}(E_a\rho)=\operatorname{tr}(E_a\rho'),
$$

时，有 $H=H'$，并因此所有 $a\in[m]$ 都有 $\lambda_a=\lambda'_a$ [AAKS20, Proposition 4]。这并不直接推出样本复杂度界，因为使用 $\rho$ 的拷贝，我们只能近似计算 $\operatorname{tr}(E_a\rho)$，并且会有采样误差引入噪声。[AAKS20] 的关键结构性结果是，这种等价性可以变得鲁棒：如果 $H'$ 只是近似匹配边缘，那么相应系数 $\lambda'_a$ 也近似匹配真实系数 $\lambda_a$。然而，这一算法的最后一步是求逆映射

$$
\{\lambda_a\}_{a\in[m]}\mapsto \{\operatorname{tr}(E_a\rho)\}_{a\in[m]},
$$

这是计算困难的问题。形式上，对于一个经典哈密顿量，[^6] $\operatorname{tr}(E_a\rho)$ 是图模型的充分统计量，而已知从这些充分统计量估计图模型参数在计算上不可处理 [Mon15]。这并不意味着问题没有希望，而是意味着为了找到可处理算法，我们应当寻找使用更丰富统计量族的机会。

[^6]: 经典哈密顿量是对角的哈密顿量，也就是说，它的项是恒等算子和 $\sigma_z$ 的张量积（Definition 2.1）。对于经典哈密顿量，态 $\rho$ 是 Gibbs 分布的样本，而 $\operatorname{tr}(E_a\rho)$ 是一个 $K$ 点关联函数。

**设计一个新的约束系统。** 我们把前面的论证理解为在未知量集合 $\{\lambda'_a\}_{a\in[m]}$ 上定义并求解一个约束系统。[AAKS20] 的结构性结果表明，这个系统的一个近似解将接近真实参数 $\lambda_a$。但是，该系统在计算上很难求解。我们的出发点是定义一组更大的约束，这些约束必须由 $\{\lambda_a\}_{a\in[m]}$ 满足，并且可以通过测量一些可观测量的期望来验证；这些可观测量的局域性比各项 $\{E_a\}_{a\in[m]}$ 稍弱。令 $\mathcal P_{\mathrm{local}}$ 为支撑在 $K$-local 上的 Pauli 矩阵集合，其中 $K$ 是某个较大的常数。我们从以下约束系统开始：

$$
\left\{
\begin{array}{ll}
\forall a\in[m], & -1\le \lambda'_a\le 1,\\[2mm]
& H'=\sum_{a\in[m]}\lambda'_a\cdot E_a,\\[2mm]
\forall P,Q\in \mathcal P_{\mathrm{local}}, &
\operatorname{tr}\!\left(Qe^{-\beta H'}Pe^{\beta H'}\rho\right)=\operatorname{tr}(PQ\rho).
\end{array}
\right.
\tag{1}
$$

上述约束确实由真实参数 $\lambda'=\lambda$ 满足，因为按假设对所有 $a\in[m]$ 都有 $|\lambda_a|\le 1$，而且

$$
\operatorname{tr}\!\left(Qe^{-\beta H}Pe^{\beta H}\rho\right)
=
\operatorname{tr}\!\left(Qe^{-\beta H}Pe^{\beta H}\frac{e^{-\beta H}}{\operatorname{tr}(e^{-\beta H})}\right)
=
\operatorname{tr}(PQ\rho),
$$

这来自迹的循环性质。现在仍有两个主要挑战：这个系统的解是否必须接近真实系数？以及如何高效求解这个系统？最终，我们会为它导出一个凸松弛，该松弛基于以下两点：

(A) 把 Eq. (1) 中涉及矩阵指数的最后一个约束，替换为关于未定元 $\{\lambda'_a\}_{a\in[m]}$ 的低次数多项式约束；

(B) 证明任意满足这些约束的 $\lambda'$ 也必须近似匹配真实系数 $\lambda$。

一般来说，求解多项式方程组在计算上很困难，但由于我们在 (B) 中的分析将基于平方和证明，现在已经有标准机制可以把它转化为一个高效算法；详细解释见 Section 2.5.1。

**识别嵌套对易子与多项式之间的等价性。** 为了用变量 $\lambda'$ 的低次数多项式替换

$$
\operatorname{tr}\!\left(Qe^{-\beta H'}Pe^{\beta H'}\rho\right),
$$

我们首先回顾 Hadamard 公式：[^7]

$$
e^{-\beta H'}Pe^{\beta H'}
=
\sum_{\ell=0}^{\infty}\frac{\beta^\ell[H',P]_\ell}{\ell!},
\tag{2}
$$

其中

$$
[H',P]_\ell=[H',[H',\ldots,[H',P]\ldots]]
$$

是第 $\ell$ 阶嵌套对易子。一个自然的第一步是把该级数截断到 $d$ 项，并观察

$$
\operatorname{tr}\!\left(
Q\left(\sum_{\ell=0}^{d}\frac{\beta^\ell[H',P]_\ell}{\ell!}\right)\rho
\right)
$$

是变量 $\lambda'$ 的低次数多项式。例如，对二阶嵌套对易子，有

$$
\operatorname{tr}\!\left(\left[\sum_{a\in[m]}\lambda'_aE_a,P\right]_2\rho\right)
=
\operatorname{tr}\!\left(\left[\sum_{a\in[m]}\lambda'_aE_a,\sum_{a\in[m]}\lambda'_a[E_a,P]\right]\rho\right)
$$

$$
=
\sum_{a,b\in[m]}\lambda'_a\lambda'_b\operatorname{tr}([E_a,[E_b,P]]\rho),
$$

这是未定元 $\lambda'_i$ 的二次多项式。然而，Eq. (2) 中的级数只有当 $\beta$ 足够小时才快速收敛 [HKT22]，因此我们不能使用它。[^8]

[^7]: 这可以从 Baker-Campbell-Hausdorff 公式推出：
$$
\exp(A)\exp(B)=\exp\!\left(A+B+\frac12[A,B]+\frac1{12}([A,[A,B]]+[B,[B,A]])+\cdots\right).
$$

[^8]: 这个展开在经过 $\beta\|H\|$ 项后确实收敛，但我们的运行时间关于次数呈指数，因此这会远远过大。

尽管如此，从这个观察出发，我们可以发展一个用于构造算子演化多项式近似的一般形式体系。我们观察到，在 $H'$ 的本征基中，

$$
[H',P]_\ell=P\circ\{(\sigma_i-\sigma_j)^\ell\}_{ij},
$$

其中 $\{\sigma_i\}_{i\in[N]}$ 是 $H'$ 的本征值，而 $\circ$ 表示 Hadamard 积（Definition 2.6）。类似地，

$$
e^{-\beta H'}Pe^{\beta H'}
=
P\circ\{e^{-\beta(\sigma_i-\sigma_j)}\}_{ij}.
$$

因此，我们可以把注意力集中在设计多项式上，用关于 $\sigma_i-\sigma_j$ 的低次数多项式近似标量量 $e^{-\beta(\sigma_i-\sigma_j)}$。进一步地，任意次数为 $d$ 的多项式

$$
p(z)=\sum_{\ell=0}^{d}c_\ell z^\ell
$$

都可以如下扩展到对易子：

$$
p(H'\mid P)=P\circ\{p(\sigma_i-\sigma_j)\}_{ij}
=
\sum_{\ell=0}^{d}c_\ell[H',P]_\ell.
$$

这使我们可以在涉及嵌套对易子的矩阵级数展开与一元多项式之间进行转换。我们指出，出于技术原因，我们需要把这种等价性扩展到含有两个不同算子 $X,Y$、且 $X,Y$ 以任意顺序出现的嵌套对易子，例如

$$
[X,[Y,[X,\ldots]\ldots],E_{a_1}],
$$

以及二元多项式 $p(x,y)$（Section 3）。由于要重新排列 $X$ 和 $Y$ 算子的顺序，二元多项式与嵌套对易子之间的转换会引入依赖于 $[X,Y]$ 的加性误差，这是预期中的（Theorem 3.9）。在完整算法中（Section 6），我们引入一个额外约束来把这个加性误差压到零。现在我们聚焦于指数函数的标量多项式近似，并形式化我们所需要的近似概念。

**构造一种新的、平坦的指数近似。** 回忆我们的目标是找到一个多项式，使得在 $H'$ 的本征基中，

$$
p(H'\mid P)=P\circ\{p(\sigma_i-\sigma_j)\}_{ij}
\approx
P\circ\{e^{-\beta(\sigma_i-\sigma_j)}\}_{ij}
=e^{-\beta H'}Pe^{\beta H'}.
\tag{3}
$$

这里“$\approx$”表示一种不寻常的近似概念；在本讨论中，可以把它理解为矩阵在某个范数下接近。指数函数的 Taylor 级数近似会给出 Eq. (2)，而我们已经说明它的次数过高。我们的关键洞见是选择一种更好的多项式近似。我们首先观察到，一个支撑很小的算子在 $H$ 的本征向量基中近似带状对角；这是 Arad、Kuwahara 和 Landau [AKL16] 证明的局域项性质。我们在这里陈述其一个弱版本：令 $P$ 是一个支撑大小为 $O(1)$ 的 Pauli 算子，并令

$$
H=\sum_i d_iv_iv_i^\dagger
$$

是 $H$ 的一个本征分解。则在 $H$ 的本征基中考虑 $P$，有

$$
|P_{ij}|=|v_i^\dagger Pv_j|\le e^{-\Omega(|d_i-d_j|)}.
$$

（Corollary 2.16）

其一个后果是，表示多项式近似误差的矩阵

$$
P\circ\{p(\sigma_i-\sigma_j)-e^{-\beta(\sigma_i-\sigma_j)}\}_{ij}
$$

的条目会以 $\sigma_i-\sigma_j$ 的指数反比权重被加权。因此，我们的多项式近似不必在所有 $\sigma_i-\sigma_j$ 上同样好；相反，我们的近似应当在一个小范围内达到 $\varepsilon$-好，而允许在该范围之外以足够慢的指数速率发散。我们称其为平坦近似。具体而言，给定参数 $\beta\ge0$ 和 $0<\varepsilon,\eta<1$，我们构造 $p$，使得

$$
\begin{cases}
|p(z)-e^{-\beta z}|\le \varepsilon, & z\in[-1,1],\\[1mm]
|p(z)|\le \max(1,e^{-\beta z})\cdot e^{\eta\beta |z|}, & z\notin[-1,1].
\end{cases}
\tag{4}
$$

满足上述约束的关键困难在于，当 $z\ge \beta$ 时要满足 $|p(z)|\le e^{\eta\beta |z|}$，因为 Taylor 级数截断、Chebyshev 级数截断等标准近似都不能满足这个条件（Remark 4.3）。在 Section 4 中，我们显式构造一个次数为

$$
2^{O(1/\eta)}\cdot(\beta+\log(1/(\varepsilon\eta)))
$$

的多项式，满足 Eq. (4)。这个构造受到 Lieb-Robinson 界证明中指数函数的迭代“剥离”技术的启发 [LR72; Has10]。我们可以写成

$$
e^{-\beta z}=\underbrace{e^{-\beta_c z}\cdots e^{-\beta_c z}}_{\beta/\beta_c}
$$

其中 $\beta_c$ 是一个固定的小常数，然后对乘积中所有 $\beta/\beta_c=O(\beta)$ 个拷贝，在不同尺度上截断 $e^{-\beta_cz}$ 的 Taylor 级数展开，使得不同截断的尾部不会“相互干扰”。

我们证明，当 $p$ 是上述形式的平坦近似且 $\eta$ 足够小时，$Qp(H\mid P)\rho$ 是 $Qe^{-\beta H}Pe^{\beta H}\rho$ 的良好近似。换言之，当 $H'=H$ 且我们右乘 $\rho$ 时，多项式近似是好的；这对我们随后建立的多项式系统可行至关重要。

**表述一个多项式系统。** 现在我们已有描述捕捉哈密顿量学习问题的多项式系统所需的全部工具。本节描述的约束系统是 Section 6 中系统的非正式处理，省略了一些技术细节。我们证明，利用对指数函数的平坦近似，可以得到一个多项式 $p$，使得

$$
\operatorname{tr}\!\left(Qe^{-\beta H}Pe^{\beta H}\rho\right)
\approx
\operatorname{tr}(Qp(H\mid P)\rho).
$$

于是，可以把 Eq. (1) 改写成如下多项式约束系统：

$$
\left\{
\begin{array}{ll}
\forall a\in[m], & -1\le \lambda'_a\le 1,\\[2mm]
& H'=\sum_{a\in[m]}\lambda'_aE_a,\\[2mm]
\forall P,Q\in\mathcal P_{\mathrm{local}}, &
\left|\operatorname{tr}\!\left(Qp(H'\mid P)\rho\right)-\operatorname{tr}(PQ\rho)\right|\le \varepsilon.
\end{array}
\right.
\tag{5}
$$

并注意最后一个约束编码了 Eq. (1) 中最后一个约束的松弛，而且当 $H'=H$ 时它被满足。进一步地，如前所述，所有这些约束确实都可以简洁地表示为未定元 $\{\lambda'_a\}_{a\in[m]}$ 的低次数多项式。最后，诸如 $\operatorname{tr}([E_a,[E_b,P]]\rho)$ 这样的系数，是 Gibbs 态相对于一个稍大的局域可观测量集合的期望，这正是我们所希望的更丰富的测试函数类。我们可以通过量子测量得到这些期望的估计（Section 5）。计算这些估计是我们算法中唯一的量子部分，算法其余部分完全是经典的。

**多项式系统的可行性。** 回忆为了证明 (5) 中的多项式系统可行，我们需要证明对所有 $P,Q$，

$$
\operatorname{tr}\!\left(Qe^{-\beta H}Pe^{\beta H}\rho\right)
\approx
\operatorname{tr}(Qp(H\mid P)\rho).
$$

在 $H$ 的本征基中工作，令其本征值为 $\{\sigma_i\}_{i\in[2^n]}$。我们利用的关键工具来自 [AKL16]（见 Corollary 2.16），它粗略地说：任意局域项 $E$ 在 $H$ 的本征基中必须近似对角，其非对角条目按

$$
|E_{ij}|\le e^{-\Omega(|\sigma_i-\sigma_j|)}
$$

衰减。因此，我们可以把矩阵 $Q,P$ 分解成两部分：一部分由满足 $|\sigma_i-\sigma_j|\le \beta$ 的索引 $i,j$ 给出，另一部分由满足 $|\sigma_i-\sigma_j|\ge \beta$ 的索引 $i,j$ 给出。然后我们使用 $p(x)$ 在 $[-\beta,\beta]$ 上很好近似 $e^{-x}$ 的事实，证明第一部分上的误差很小。接着，我们诉诸非对角项的指数衰减，说明第二部分在

$$
\operatorname{tr}(Qe^{-\beta H}Pe^{\beta H}\rho)
$$

和

$$
\operatorname{tr}(Qp(H\mid P)\rho)
$$

中的贡献都很小。我们的指数函数平坦近似正是为了保证在任何区域中，它都不会压倒 $P,Q$ 中非对角条目的指数衰减。

**高效优化多项式系统。** 现在我们知道我们的多项式系统是可行的，于是考虑这个系统的一个凸松弛。具体地，我们考虑一个次数为 $d$ 的平方和松弛，它可以通过表达为半正定规划来高效优化（细节见 Section 2.5.1），其中

$$
d=\log(1/\varepsilon)\cdot 2^{O(\beta)}.
$$

由于我们有 $m$ 个变量和 $2^{O(\beta)}$ 个约束，而且每个约束都是次数为 $d$ 的多项式，因此可以在

$$
m^{\log(1/\varepsilon)\cdot 2^{O(\beta)}}
$$

时间内求解 Eq. (5) 的次数 $2d$ 平方和松弛。分析平方和松弛的主要挑战是证明，我们可以把它舍入为估计 $\{\tilde\lambda'_a\}_{a\in[m]}$，使其接近真实参数。这里，我们采用所谓的“从证明到算法”的哲学：我们转而处理平方和松弛的对偶对象，即平方和证明（见 [Bar; FKP+19] 及其中引用）。这一视角说明，如果真实参数只需使用平方和证明系统即可识别，那么我们立刻得到一个高效算法，并可以说明如何容易且精确地舍入解。

然后我们给出可识别性的证明，即对所有 $a\in[m]$，不等式

$$
(\lambda'_a-\lambda_a)\le \varepsilon
$$

可以用该多项式约束系统以及其他具有平方和证明的基本不等式推出（详细阐述见 Section 9）。高层次上，该证明通过如下思路工作：当 $H'-H$ 很大时，存在见证 $P,Q$，使得

$$
|\operatorname{tr}(Qp(H'\mid P)\rho)-\operatorname{tr}(Qp(H\mid P)\rho)|
$$

很大。由于我们知道 $H$ 是一个可行解，这将意味着 $H'$ 不可能是可行解，因此任何可行解都必须使 $H'-H$ 很小。见证的构造依赖于我们构造的多项式 $p$ 的一个附加性质，即它是强单调的，含义是某种合适的定量意义下的强单调性。

在可识别性证明中，我们关键地使用了局域哈密顿量的另一个重要性质。它涉及量

$$
\operatorname{tr}(A^2\rho),
$$

其中

$$
A=\sum_b \sigma_bP_b
$$

是一个由小支撑 Pauli 矩阵线性组合而成的 Hermitian 算子。把 $\rho$ 看作一个分布时，$\operatorname{tr}(A^2\rho)$ 是相对于 $\rho$ 的二阶矩项；我们可以证明它不会比相对于均匀分布的二阶矩

$$
\operatorname{tr}(A^2I/\dim)=\sum_b\sigma_b^2
$$

小太多。即对某个常数 $c>0$，

$$
\operatorname{tr}(A^2\rho)\ge c^{O(\beta)}\max_b\sigma_b^2.
$$

（Theorem 2.13）直观上，这说明 $\rho$ 在任何局域方向上都不接近零。这最初由 [AAKS20] 对准局域算子证明；我们调整他们的证明，使其只对局域算子成立，并给出更紧的界。我们证明，通过把它表述为一个二次不等式，可以在平方和证明系统中得到这种形式的稍弱陈述。这个不等式可用于消除证明中若干表达式对 $\rho$ 的依赖；例如，它用于把 $\operatorname{tr}([H,H']^2\rho)$ 与 $[H,H']$ 本身的大小联系起来。

最后，我们观察到，我们的可识别性证明并未使用次数 $2d$ 平方和松弛的全部威力，因此求解一个显著更小的半正定规划应当足够。我们证明，只需诉诸次数至多 $2d$ 的一个稀疏单项式子集，即可执行我们的可识别性证明，并调用 Steurer 和 Teigel [ST21] 的一个线性化定理，得到最终所需运行时间

$$
\operatorname{poly}(m)\cdot (1/\varepsilon)^{2^{O(\beta)}}.
$$

## 1.3 更多相关工作

**哈密顿量学习。** 哈密顿量学习是一个广泛主题，在实验和理论语境中都受到研究。本工作属于关于学习刻画物理系统的量子态性质的一大类算法研究 [Cra+10; AA23]。这里，我们指出该领域中的若干相关工作线索。

哈密顿量学习通常聚焦于实时间演化设定，在该设定中可以允许系统相对于 $H$ 演化，即施加酉算子 $e^{-iHt}$ [SLP11; WGFC14; HTFS23]。一些算法考虑取时间导数，也就是取 $t\to0$，这与 Gibbs 态设定中的小 $\beta$ 算法类似 [ZYLB21; HKT22; GCC22]。也有一些关于从零温基态学习的研究 [QR19]，但算法工作较为有限，因为一个哈密顿量的基态并不一定确定该哈密顿量。我们研究有限温度情形；这既是实验通常运行的温度，也是当 $\beta\to\infty$ 时对计算上更难处理得多的基态的一种丰富近似 [Alh22; GHLS15]。

虽然我们的算法并不实用，但我们使用的约束系统与先前工作 [BAL19; QR19] 中通过启发式和实验方式分析的“关联矩阵”线性约束系统有某些相似性。事实上，出于技术原因，我们的约束系统包含这些约束。我们的工作为这些工作提供了严格基础：我们证明，虽然线性约束系统可能不能唯一识别真实哈密顿量，但加入更多相似约束后，最终可以完全约束哈密顿量。

**Gibbs 态中关联的界。** 虽然经典 Gibbs 态具有极好的局域性性质，但在量子设定中这些性质会变得弱得多。一系列工作旨在用不同度量、在不同区域中控制量子 Gibbs 态的非局域性 [KB19; KKB20; KAA21]，通常目标是推出这些系统的模拟或学习可以时间高效地完成。一个有趣的开放问题是：能否从我们的算法中提取出一种新的“局域性”陈述，以理解我们的方法在学习量子系统方面有多一般。我们的多项式近似受到 Lieb-Robinson 界证明的启发 [LR72; Has10]，并且可被视为该界的一种“低次数”形式。这可能具有独立意义。

**图模型的参数学习。** 关于学习图模型的问题有丰富的工作。我们的设定是学习 Markov 随机场；关于这一主题的文献集中于结构学习任务，这在我们的设定中对应于学习各项 $\{E_a\}_{a\in[m]}$，并保证它们形成一个未知的有界度对偶相互作用图 [BMS13; Bre15; HKM17; KM17]。我们考虑的问题是在项已知时学习参数；在经典设定中这一点很容易 [HKT22, Appendix B]，因为经典 Gibbs 态满足 Hammersley-Clifford 定理 [HC71]，也称为 Markov 性质。Markov 性质的一个后果是，可以通过计算某个 $K$ 体项支撑上的条件边缘来估计该项上的参数。目前尚不清楚如何把这个论证推广到量子设定，因为即使近似地说，Markov 性质也不适用于低温量子哈密顿量 [KKB20]。

**平方和元算法。** 平方和层级已经被用于分析量子信息中的若干问题，包括最佳态分离 [DPS02; BCY11; BBHKSZ12; BKS17]、优化费米子哈密顿量 [HO22; Has23]，以及 max-cut 的一个量子类似物 [PT21; WCEHK23]。此外，[BKS15; Bar] 引入的“从证明到算法”的视角，已经被广泛用于为若干估计和学习任务设计高效算法。特别地，这一视角带来了鲁棒学习 [HL18; KSS18; KKM18; BDHKKK20; BP21; LM21; BDJKKV22] 和列表可解码学习 [KKK19; RY20; BK21] 的高效算法。

# 2 背景

全文中，$\log$ 表示自然对数，$i=\sqrt{-1}$。$O(\cdot)$、$\Theta(\cdot)$ 和 $\Omega(\cdot)$ 是大 $O$ 记号，我们使用记号 $f\lesssim g$ 表示 $f=O(g)$。记号 $\widetilde O(f)$ 表示 $O(f\operatorname{polylog}(f))$。对于参数 $t$，$O_t$ 表示把 $t$ 视为常数的大 $O$ 记号；多项式缩放记号 $\operatorname{poly}_t(\cdot)$ 同理。全文中，二元算子 $\cdot$ 表示通常的乘法。对于序列 $S\in\{0,1\}^*$，$\operatorname{len}(S)$ 表示其长度。

## 2.1 线性代数

我们在对应于 $n$ 个量子比特系统的 Hilbert 空间 $\mathbb C^N$ 中工作，即

$$
\mathbb C^2\otimes\cdots\otimes\mathbb C^2,
$$

所以 $N=2^n$。对于矩阵 $A$，我们用 $A^\dagger$ 表示其共轭转置，用 $\|A\|$ 表示其算子范数；对于向量 $v$，用 $\|v\|$ 表示其 Euclidean 范数。我们将在这个 Hilbert 空间中工作，并且常常在 Pauli 矩阵的张量积基中考虑它。

**Definition 2.1（Pauli 矩阵）。** Pauli 矩阵是以下 $2\times2$ Hermitian 矩阵：

$$
\sigma_I=\begin{pmatrix}1&0\\0&1\end{pmatrix},\quad
\sigma_x=\begin{pmatrix}0&1\\1&0\end{pmatrix},\quad
\sigma_y=\begin{pmatrix}0&-i\\ i&0\end{pmatrix},\quad
\sigma_z=\begin{pmatrix}1&0\\0&-1\end{pmatrix}.
$$

这些矩阵是酉的，并且因此是对合的。进一步地，$\sigma_x\sigma_y=i\sigma_z$、$\sigma_y\sigma_z=i\sigma_x$、$\sigma_z\sigma_x=i\sigma_y$，因此 Pauli 矩阵的乘积仍是一个 Pauli 矩阵，最多差一个 $\{i,-1,-i\}$ 中的因子。非恒等 Pauli 矩阵是无迹的。我们还考虑 Pauli 矩阵的张量积

$$
P_1\otimes\cdots\otimes P_n,
$$

其中对所有 $i\in[n]$，$P_i\in\{\sigma_I,\sigma_x,\sigma_y,\sigma_z\}$。这类 Pauli 矩阵乘积的集合记为 $\mathcal P$，它们在迹内积下构成 $2^n\times2^n$ 复 Hermitian 矩阵向量空间的一个正交基。$\mathcal P$ 中两个元素的乘积仍是 $\mathcal P$ 中的一个元素，最多差一个 $\{i,-1,-i\}$ 中的因子。

**Definition 2.2（算子的支撑）。** 对于 $n$ 个量子比特系统上的算子 $P\in\mathbb C^{N\times N}$，其支撑 $\operatorname{supp}(P)\subset[n]$ 是 $P$ 非平凡作用的量子比特子集。也就是说，$\operatorname{supp}(P)$ 是最小的量子比特集合，使得对某个算子 $O$，可以把 $P$ 写成

$$
P=O_{\operatorname{supp}(P)}\otimes I_{[n]\setminus\operatorname{supp}(P)}.
$$

因此，例如 Pauli 张量积 $P_1\otimes\cdots\otimes P_n$ 的支撑是所有满足 $P_i\ne\sigma_I$ 的 $i\in[n]$ 的集合。我们考虑的一个核心对象是算子的嵌套对易子。

**Definition 2.3（对易子）。** 给定算子 $A,B\in\mathbb C^{N\times N}$，$A$ 和 $B$ 的对易子定义为

$$
[A,B]=AB-BA.
$$

阶数为 $\ell$ 的嵌套对易子递归定义为

$$
[A,B]_k=[A,[A,B]_{k-1}],
\qquad [A,B]_1=[A,B].
$$

Pauli 矩阵在对易下行为简单：两个 Pauli 矩阵的对易子在相差一个标量的意义下仍是另一个 Pauli 矩阵（见 Lemma 2.10）。

最后，我们定义如下记号，用于抽取一个算子中作用在某个特定量子比特上的部分。

**Definition 2.4（算子的局域化）。** 对于算子 $O\in\mathbb C^{N\times N}$，定义

$$
O^{(i)}=O-\operatorname{tr}_i(O)\otimes\frac{I_i}{2}
=O-\int d\mu_i(U)\,U^\dagger OU,
$$

其中 $I_i$ 表示第 $i$ 个量子比特上的恒等算子，$\operatorname{tr}_i$ 表示关于第 $i$ 个量子比特的偏迹操作，而 $\mu_i$ 表示只支撑在量子比特 $i$ 上的酉算子集合上的 Haar 测度。换言之，$[\cdot]^{(i)}:(\mathbb C^{2\times2})^{\otimes n}\to(\mathbb C^{2\times2})^{\otimes n}$ 是算子上的线性映射，它在除第 $i$ 个以外的每个量子比特上都是恒等映射，而在第 $i$ 个量子比特上把 $M\in\mathbb C^{2\times2}$ 映到

$$
M\mapsto M-\frac12\operatorname{tr}(M)I.
$$

对于 Pauli 矩阵张量积 $P\in\mathcal P$，当 $i\notin\operatorname{supp}(P)$ 时，$P^{(i)}$ 是 $P$；否则为 $0$。因此，对于 Pauli 的线性组合

$$
A=\sum_{P\in\mathcal P}\lambda_PP,
$$

施加这个映射会把求和限制到与量子比特 $i$ 相互作用的 Pauli 矩阵：

$$
A^{(i)}=\sum_{P:i\in\operatorname{supp}(P)}\lambda_PP.
\tag{6}
$$

因此，$|\operatorname{supp}(A^{(i)})|\le(d+1)K$。

**Definition 2.5（到本征空间的投影）。** 对 Hermitian 矩阵 $X$ 和区间 $I\subset\mathbb R$，$\Pi_I^{(X)}$ 表示到由 $X$ 的本征值属于 $I$ 的本征向量张成的子空间上的正交投影算子。

有时我们在矩阵为对角的基中工作，在这种情况下 Hadamard 积会很有用。

**Definition 2.6（Hadamard 积）。** 对 $A,B\in\mathbb C^{N\times N}$，它们的 Hadamard 积记为 $A\circ B$，满足

$$
[A\circ B]_{ij}=A_{ij}B_{ij}.
$$

## 2.2 相互作用系统的哈密顿量

我们首先定义哈密顿量；它编码物理系统中量子粒子之间的相互作用力。

**Definition 2.7（哈密顿量）。** 哈密顿量是一个算子 $H\in\mathbb C^{N\times N}$，我们把它看成局域项 $E_a$ 及其相关系数 $\lambda_a$ 的线性组合：

$$
H=\sum_{a=1}^{m}\lambda_aE_a.
$$

为归一化起见，我们假设 $\|E_a\|\le1$ 且 $|\lambda_a|\le1$。如果每一项 $E_a$ 都满足 $|\operatorname{supp}(E_a)|\le K$，则该哈密顿量是 $K$-local 的。

我们只考虑那些项 $E_a$ 互不相同、无迹、且为 Pauli 矩阵乘积的哈密顿量。其他类型的局域哈密顿量可以归约到这一设定：把局域项，也就是 Hermitian 矩阵，展开到 Pauli 矩阵乘积基中即可。这保持了哈密顿量的局域性，只会使项数增加一个关于局域性指数的因子，而我们把局域性看作常数。假设 $E_a$ 无迹并不失一般性，因为给哈密顿量加上恒等矩阵的倍数不会影响其对应的 Gibbs 态。

**Definition 2.8（低相交哈密顿量 [HKT22]）。** 对 $n$ 个量子比特系统上的 $K$-local 哈密顿量 $H=\sum\lambda_aE_a$，它的对偶相互作用图 $G$ 是一个无向图，顶点标记为 $[m]$，并且当且仅当

$$
\operatorname{supp}(E_a)\cap\operatorname{supp}(E_b)\ne\varnothing
$$

时，在 $a,b\in[m]$ 之间连一条边。令 $d$ 表示该图的最大度。如果 $k$ 和 $d$ 是常数，则称 $H$ 为低相交的。[^9]

[^9]: 也称为“低相互作用”[HTFS23] 或“稀疏相互作用”[GCC22] 哈密顿量。

全文中，我们假设我们的哈密顿量是 $K$-local 的，并且其对偶相互作用图的度为 $d$。全文中我们把 $K$ 和 $d$ 视为常数。这涵盖了文献中讨论的大多数哈密顿量，包括“几何局域”哈密顿量，也就是把量子比特看成位于类似 $\mathbb Z^3$ 的常数维格点上，并且各项相对于该格点在空间上局域的哈密顿量。这个类比几何局域哈密顿量更一般，因为它也可以扩展到由扩张图规定局域性的量子比特。

我们还会考虑哈密顿量项以外的算子，因此定义一个相对于对偶相互作用图的局域性概念，并把它推广到这类算子。具体而言，我们对 $\ell\ge k$ 的 $\ell$-local 算子所需的性质是：(1) 它们包含哈密顿量项 $E_a$；(2) 它们张成的子空间维数为 $O(n)$；(3) 它们包含涉及 $k$-local 算子的嵌套对易子。

**Definition 2.9（相对于对偶相互作用图的局域算子）。** 考虑一个 $K$-local 哈密顿量

$$
H=\sum_{a=1}^{m}\lambda_aE_a
$$

及其对偶相互作用图 $G$。对于 Pauli 张量积 $P$，如果存在某个大小为 $\ell$ 的 $S\subset[m]$，使得

$$
\operatorname{supp}(P)\subset\bigcup_{a\in S}\operatorname{supp}(E_a)
$$

并且 $S$ 在 $G$ 中连通，则称 $P$ 是 $k\ell$-$G$-local 的。

我们定义 $\mathcal P_{k\ell}$ 为 $k\ell$-$G$-local Pauli 矩阵的集合。一般地，如果算子 $M\in\mathbb C^{N\times N}$ 等于 $\mathcal P_{k\ell}$ 中元素的一个线性组合，则称它是 $k\ell$-$G$-local 的。

按照这个定义，如果 $E_a$ 和 $E_b$ 是哈密顿量的项，则 $E_b$ 是 $k$-$G$-local 的，而 $[E_a,E_b]$ 是 $2k$-$G$-local 的。下面陈述 Pauli 矩阵嵌套对易子的形式。

**Lemma 2.10.** 令 $P_1\in\mathcal P_{k_1},\ldots,P_a\in\mathcal P_{k_a}$ 且 $Q\in\mathcal P_\ell$，均相对于某个背景对偶相互作用图 $G$。则该嵌套对易子要么为零，要么也是一个 $G$-local Pauli 矩阵：

$$
\frac{i^a}{2^a}[P_1,[P_2,\ldots,[P_a,Q]\ldots]]\in\mathcal P_{k_1+\cdots+k_a+\ell},
$$

最多差一个 $\pm1$ 的因子，其中 $i=\sqrt{-1}$。

**证明。** 令 $a=1$。由 Definition 2.1 中给出的性质，对 $P\in\mathcal P_{k_1}$ 和 $Q\in\mathcal P_\ell$，$PQ$ 是一个 Pauli 矩阵张量积，最多差一个四次单位根。因此，

$$
[P,Q]=PQ-(PQ)^\dagger
$$

要么为零，如果 $PQ$ 是 Hermitian 的；要么为 $2PQ$，如果 $iPQ$ 是 Hermitian 的。进一步地，

$$
\operatorname{supp}([P,Q])\subset \operatorname{supp}(PQ)\subset \operatorname{supp}(P)\cup\operatorname{supp}(Q),
$$

这表明 $[P,Q]$ 是 $(k_1+\ell)$-$G$-local 的。这证明了 $a=1$ 的情形；一般陈述通过迭代这一情形得到。

## 2.3 量子系统上局域算子的性质

对于描述一个量子系统的哈密顿量，我们考虑访问该系统在特定逆温度 $\beta$ 下热化后达到的相关态。这称为 Gibbs 态。

**Definition 2.11（Gibbs 态）。** 哈密顿量 $H=\sum\lambda_aE_a$ 在逆温度 $\beta>0$ 下的 Gibbs 态为

$$
\rho=\frac{\exp(-\beta H)}{\operatorname{tr}\exp(-\beta H)}
=\frac{\exp\left(-\beta\sum_a\lambda_aE_a\right)}{\operatorname{tr}\exp\left(-\beta\sum_a\lambda_aE_a\right)}.
\tag{7}
$$

一个有用的直觉是，把 $\rho$ 看成在它的本征空间上的分布，其概率正比于本征值。从这个意义上，我们可以讨论相对于该分布的期望和方差。

**Definition 2.12（相对于 Gibbs 态的期望）。** 对于哈密顿量 $H$ 的 Gibbs 态 $\rho$ 和算子 $A\in\mathbb C^{N\times N}$，定义

$$
\langle A\rangle=\operatorname{tr}(A\rho).
$$

Anshu、Arunachalam、Kuwahara 和 Soleimanifar 的先前工作给出了一个关键结果：对于由 Gibbs 态定义的能量分布，一个局域算子的方差有下界。作者对更一般的准局域算子类证明了这一点，但我们只需要局域算子的情形，而在该情形下可以收紧结果。下面给出这个更紧的版本；证明见 Appendix A。

**Theorem 2.13 ([AAKS20, Theorem 33]).** 令 $H$ 是一个 $K$-local 哈密顿量，其对偶相互作用图 $G$ 的最大度为 $d$。令

$$
A=\sum_b\sigma_bP_b
$$

为一个 $K'$-local 算子，其中 $P_b$ 是 Pauli 矩阵乘积，$-1\le\sigma_b\le1$，并且它的对偶相互作用图最大度为 $d'$。对 $\beta>0$，令 $\rho$ 为 $H$ 的相应 Gibbs 态。则

$$
\langle A^2\rangle=\operatorname{tr}(A^2\rho)
\ge
\max_{i\in[n]}\left(c\operatorname{tr}(A_{(i)}^2/N)\right)^{6+c'\beta}.
$$

这里 $c$ 和 $c'$ 是依赖于 $K,d,K'$ 和 $d'$ 的正常数。

经过一些变形，我们可以得出：如果某个局域算子相对于 $\rho$ 的方差很小，则该算子本身必须接近零。有些读者会认出，这相当于“有界度图模型的局域边缘有远离零的下界”这一陈述的量子类似物（例如见 [Bre15]）。

**Corollary 2.14（“局域边缘没有小质量”）。** 令 $H$ 是一个 $K$-local 哈密顿量，其对偶相互作用图 $G$ 的最大度为 $d$。令

$$
A=\sum_{P\in\mathcal P}\sigma_PP
$$

为支撑至多为 $K'$ 的 Pauli 之和，且其对偶相互作用图 $G'$ 的最大度为 $d'$，其中系数 $\sigma_P\in\mathbb R$。则

$$
\operatorname{tr}(X^2\rho)
\ge
\exp(-c_{K,d,K',d'}-c'_{K,d,K',d'}\beta)\max_{Q\in\mathcal P}\sigma_Q^2,
$$

其中 $c_{K,d,K',d'}$ 和 $c'_{K,d,K',d'}$ 是只依赖于 $K,d,K',d'$ 的常数。

**证明。** 令

$$
g^2=\max_{Q\in\mathcal P_\ell}\sigma_Q^2.
$$

则

$$
\operatorname{tr}(X^2\rho)
=g^2\operatorname{tr}((X/g)^2\rho)
$$

$$
\ge
 g^2\max_{i\in[n]}
\left(c\operatorname{tr}((X^{(i)}/g)^2/N)\right)^{6+c'\beta}
$$

由 Theorem 2.13，

$$
=
 g^2\max_{i\in[n]}
\left(
 c\operatorname{tr}\left(\left(\sum_{\substack{P\in\mathcal P_\ell\\ i\in\operatorname{supp}(P)}}\frac{\sigma_P}{g}P\right)^2/N\right)
\right)^{6+c'\beta}
$$

由 Eq. (6)，

$$
=
 g^2\max_{i\in[n]}
\left(
 c\sum_{\substack{P\in\mathcal P_\ell\\ i\in\operatorname{supp}(P)}}\frac{\sigma_P^2}{g^2}
\right)^{6+c'\beta}
$$

由 Definition 2.1，

$$
\ge g^2c^{6+c'\beta}.
$$

这给出所需陈述。

关于局域算子的另一个关键陈述是：当一个局域算子在另一个局域算子的本征向量基中被考虑时，它是近似对角的。

**Theorem 2.15 ([AKL16, Theorem 2.1]).** 令 $H=\sum_{S\subset[n]}h_S$ 是一个哈密顿量，其所有项 $h_S$ 都是半正定的、支撑在至多 $K$ 个量子比特上，并且与任意特定站点相互作用的项具有有界范数：对所有 $i\in[n]$，

$$
\sum_{S:i\in S}\|h_S\|\le g.
$$

令 $A$ 是一个算子，并定义

$$
R=\sum_{X\in C}\|h_X\|,
\qquad
C=\{S\subset[n]\mid [h_S,A]\ne0\},
$$

其中 $C$ 是不与 $A$ 对易的项的集合。则

$$
\|\Pi^{(H)}_{[\sigma,\infty)}A\Pi^{(H)}_{[0,\varsigma]}\|
\le
\|A\|e^{-\frac1{2gK}(\sigma-\varsigma-2R)}.
$$

可以移除 $h_S$ 是 PSD 的假设：如果 $h_S$ 不是 PSD，我们可以把定理应用到 $h_S+I\|h_S\|$，这只会使最后界中的 $g$ 和 $R$ 增大一个因子二。注意这只是给 $H$ 加上恒等矩阵的某个倍数，因此只会平移谱。

**Corollary 2.16.** 令 $H=\sum_{S\subset[n]}h_S$ 是一个哈密顿量，其所有项 $h_S$ 都支撑在至多 $K$ 个量子比特上，并且与任意特定站点相互作用的项有有界范数：对所有 $i\in[n]$，

$$
\sum_{S:i\in S}\|h_S\|\le g.
$$

令 $A$ 是一个算子，并定义

$$
R=\sum_{X\in C}\|h_X\|,
\qquad
C=\{S\subset[n]\mid [h_S,A]\ne0\},
$$

其中 $C$ 是不与 $A$ 对易的项的集合。则

$$
\|\Pi^{(H)}_{[\sigma,\infty)}A\Pi^{(H)}_{[-\infty,\varsigma]}\|
\le
\|A\|e^{-\frac1{4gK}(\sigma-\varsigma-4R)}.
$$

当 $A$ 满足 $|\operatorname{supp}(A)|\le K'$ 时，可以把 $R$ 取为与 $A$ 的支撑相交的项数。在我们的设定中，各项是 Pauli 矩阵，并且对偶相互作用图的最大度为 $d$，因此可以取 $g=d+1$。如果 $A$ 的支撑包含在某一项的支撑中，可以取 $R=d+1$；否则可以取 $R=K'd$。

## 2.4 嵌套对易子的界

对易子 $[A,B]$ 的一个关键性质是：当输入 $A,B$ 是局域项之和时，它们可以很好地组合（回忆 Lemma 2.10）。在本节中，当我们有形式为

$$
[H_1,[H_2,[\ldots[H_\ell,A]\ldots]]]
$$

的嵌套对易子时，将把这些组合性质精确化，其中 $H_1,\ldots,H_\ell$ 是局域算子，而 $A$ 有小支撑。我们使用簇展开论证来控制这些项。

**Definition 2.17.** 令 $M_1,\ldots,M_\ell\in\mathbb C^{N\times N}$ 为算子。如果对所有 $a$，$M_{a+1}$ 的支撑都与

$$
\operatorname{supp}(M_1)\cup\cdots\cup\operatorname{supp}(M_a)
$$

有非空交集，则称有序 $\ell$ 元组 $(M_1,\ldots,M_\ell)$ 形成一个簇。

**Lemma 2.18.** 令 $\mathcal E\subset\mathcal P$ 为一组 Pauli 项，其中每个 $P\in\mathcal E$ 满足 $|\operatorname{supp}(P)|\le K$，并且与 $\mathcal E$ 相关的对偶相互作用图最大度为 $d$。令 $H_1,\ldots,H_\ell$ 是 $\mathcal E$ 中元素的线性组合，写作对所有 $i$，

$$
H_i=\sum_{P\in\mathcal E}\lambda_{i,P}P.
$$

令 $A\in\mathcal E$。则可以把

$$
[H_1,[H_2,[\ldots[H_\ell,A]\ldots]]]
$$

写成如下形式：

$$
2^\ell
\sum_{\substack{P_1,P_2,\ldots,P_\ell\in\mathcal E\\ (A,P_\ell,\ldots,P_1)\text{ 是簇}}}
 c_{P_1,\ldots,P_\ell}Q_{P_1,\ldots,P_\ell}
 \prod_{j=1}^{\ell}\lambda_{j,P_j},
$$

其中常数 $c_{P_1,\ldots,P_m}\in\{0,\pm1,\pm i\}$，并且：

(a) $Q_{P_1,\ldots,P_\ell}\in\mathcal P_{(\ell+1)k}$（如 Definition 2.9 中定义），且在 $G$-距离中与 $A$ 的距离为 $\ell$；

(b) 求和中的项数至多为 $\ell!(d+1)^\ell$。

**证明。** 利用对易子的双线性，可以把嵌套对易子展开为单项之和：

$$
\sum_{P_1,\ldots,P_\ell}
[P_1,[P_2,[\ldots[P_\ell,A]\ldots]]]
\prod_{a=1}^{\ell}\lambda_{a,P_a}.
$$

现在我们论证上述求和中的哪些项非零。注意，要使对易子非零，$P_\ell$ 必须与 $A$ 的支撑相交，$P_{\ell-1}$ 必须与 $\operatorname{supp}(P_\ell)\cup\operatorname{supp}(A)$ 相交，依此类推。这个条件等价于 $A,P_\ell,\ldots,P_1$ 形成一个簇。由 Lemma 2.10，有

$$
[P_1,[P_2,[\ldots[P_\ell,A]\ldots]]]
\in
2^\ell c_{P_1,\ldots,P_\ell}\mathcal P_{\ell+1},
$$

对某些 $c_{P_1,\ldots,P_\ell}\in\{0,\pm1,\pm i\}$ 成立。因为 $(A,P_\ell,\ldots,P_1)$ 是簇，所以也可以推出求和中出现的 $\mathcal P_{\ell+1}$ 元素与 $A$ 的距离至多为 $\ell$。现在只需计数簇的数量。选择 $P_a$ 时，有 $a$ 种选择决定它与 $(A,P_1,\ldots,P_{a-1})$ 中哪一个相交，并且有 $d+1$ 种选择 $\mathcal E$ 中与该元素相交的元素。因此簇总数的上界为

$$
(d+1)\cdot2(d+1)\cdots \ell(d+1)=\ell!(d+1)^\ell.
$$

这完成证明。

我们还需要 [HKT22] 中如下引理，它计数在某种排序下形成簇的不同多重集合的数量。

**Lemma 2.19 ([HKT22, Proposition 3.6]).** 考虑一组项 $\mathcal E\subset\mathcal P$，其对偶相互作用图 $G$ 的最大度为 $d\ge2$。对于固定的 $E_{a_1}\in\mathcal E$，所有多重集合 $E_{a_2},\ldots,E_{a_\ell}\in\mathcal E$ 中，若存在某个排序 $\pi$ 使得

$$
(E_{a_{\pi(1)}},\ldots,E_{a_{\pi(\ell)}})
$$

形成一个簇，则这样的多重集合数至多为

$$
ed(1+e(d-1))^{\ell-1}\le(3d)^\ell.
$$

作为推论，我们可以控制 $\mathcal P_{k\ell}$ 中不同元素的数量。

**Corollary 2.20.** 有

$$
|\mathcal P_{k\ell}|\le m(10kd)^\ell.
$$

进一步，与固定项 $P\in\mathcal P_k$ 的支撑相交的 $\mathcal P_{k\ell}$ 元素数量至多为

$$
(10kd)^{\ell+1}.
$$

## 2.5 平方和多项式

我们需要一些关于多项式和平方和（SoS）框架的预备知识。首先，我们引入一种具有有界系数的平方和表示多项式的概念。我们保留系数界，是因为之后某些采样和近似误差会乘以这些系数。一般的 SoS 框架并不关心如此紧的系数界，因此我们需要在一般框架之外做一些定义。

**Definition 2.21（平方和多项式）。** 如果一个多项式

$$
p(x_1,\ldots,x_m)\in\mathbb R[x_1,\ldots,x_m]
$$

可以写成

$$
p(x_1,\ldots,x_m)=q_1(x_1,\ldots,x_m)^2+\cdots+q_k(x_1,\ldots,x_m)^2
$$

对某些多项式 $q_1,\ldots,q_k\in\mathbb R[x_1,\ldots,x_m]$ 成立，则称它是平方和多项式。

我们有时把平方和简称为 SoS。

**Definition 2.22（有界多项式）。** 若多项式 $p(x_1,\ldots,x_m)\in\mathbb R[x_1,\ldots,x_m]$ 满足：

(a) $p$ 的次数至多为 $d$；

(b) 对 $p$ 中每个次数为 $d'\le d$ 的单项式，其系数绝对值至多为 $C/(d'!)$；

则称 $p$ 是 $(d,C)$-有界的。如果 $p$ 是平方和多项式，

$$
p=q_1^2+\cdots+q_k^2,
$$

并且每个 $q_i$ 都是 $(d,C)$-有界的，则称 $p$ 是一个 $(k,d,C)$-有界平方和多项式。

**Claim 2.23（有界 SoS 多项式的复合）。** 令 $p_1(x_1,x_2)$ 是一个 $(k_1,d_1,C_1)$-有界 SoS 多项式，$p_2(x_1,x_2)$ 是一个 $(k_2,d_2,C_2)$-有界 SoS 多项式。则：

(a) $p_1+p_2$ 是一个 $(k_1+k_2,\max(d_1,d_2),\max(C_1,C_2))$-有界 SoS 多项式；

(b) $p_1p_2$ 是一个

$$
(k_1k_2,d_1+d_2,(d_1+d_2+1)2^{d_1+d_2}C_1C_2)
$$

-有界 SoS 多项式；

(c) 对任意 $t\in[0,1]$，

$$
p_1((1-t)x_1+ty_1,(1-t)x_2+ty_2)
$$

是变量 $x_1,y_1,x_2,y_2$ 中的一个 $(k_1,d_1,C_1)$-有界 SoS 多项式。

**证明。** 在此证明中，令 $[x_1^ix_2^j]p(x_1,x_2)$ 表示 $p$ 中对应于 $x_1^ix_2^j$ 的系数。第一个陈述显然成立，因为可以直接合并两个平方和表示。第二个陈述也通过把两个平方和表示相乘并展开立即得到。为此，我们使用如下事实：当 $r(x_1,x_2)$ 是 $(d_1,C_1)$-有界且 $s(x_1,x_2)$ 是 $(d_2,C_2)$-有界时，$rs$ 是

$$
(d_1+d_2,(d_1+d_2+1)2^{d_1+d_2}C_1C_2)
$$

-有界的。事实上，

$$
[x_1^ix_2^j](rs)
=
\sum_{0\le i'\le i\atop 0\le j'\le j}
|[x_1^{i'}x_2^{j'}]r|\,|[x_1^{i-i'}x_2^{j-j'}]s|
$$

$$
\le
\sum_{0\le i'\le i\atop 0\le j'\le j}
\frac{C_1}{(i'+j')!}\frac{C_2}{(i+j-i'-j')!}
$$

$$
=
\frac{C_1C_2}{(i+j)!}
\sum_{0\le i'\le i\atop 0\le j'\le j}
\binom{i+j}{i'+j'}
\le
\frac{C_1C_2}{(i+j)!}(i+j+1)2^{i+j}.
$$

对于最后一个陈述，写

$$
p_1(x_1,x_2)=q_1(x_1,x_2)^2+\cdots+q_{k_1}(x_1,x_2)^2.
$$

现在直接代入变量替换。新多项式的一个系数为

$$
[x_1^{i_1}y_1^{j_1}x_2^{i_2}y_2^{j_2}]
q_\ell((1-t)x_1+ty_1,(1-t)x_2+ty_2)
$$

$$
=[x_1^{i_1+j_1}x_2^{i_2+j_2}]q_\ell(x_1,x_2)
\binom{i_1+j_1}{i_1}(1-t)^{i_1}t^{j_1}
\binom{i_2+j_2}{i_2}(1-t)^{i_2}t^{j_2}
$$

$$
\le [x_1^{i_1+j_1}x_2^{i_2+j_2}]q_\ell(x_1,x_2),
$$

这表明经过变量替换后，$p_1((1-t)x_1+ty_1,(1-t)x_2+ty_2)$ 仍是一个 $(k_1,d_1,C_1)$-有界 SoS 多项式。

## 2.5.1 平方和框架

现在我们给出平方和证明系统的概览。我们紧密遵循 Barak [Bar] 讲义中的阐述。

**伪分布。** $\mathbb R^m$ 上的离散概率分布由其概率质量函数 $D:\mathbb R^m\to\mathbb R$ 定义，后者必须满足

$$
\sum_{x\in\operatorname{supp}(D)}D(x)=1
\quad\text{且}\quad D\ge0.
$$

我们通过把非负性约束放宽为只要求 $D$ 通过某些低次数非负性测试，来扩展这个定义。所得对象称为伪分布。

**Definition 2.24（伪分布）。** 次数为 $\ell$ 的伪分布是一个有限支撑函数 $D:\mathbb R^m\to\mathbb R$，满足

$$
\sum_xD(x)=1
$$

并且对每个次数至多为 $\ell/2$ 的多项式 $p$，都有

$$
\sum_xD(x)p(x)^2\ge0,
$$

其中求和取遍 $D$ 的支撑中的所有 $x$。

接着，我们定义相关的伪期望概念。

**Definition 2.25（伪期望）。** 函数 $f$ 在 $\mathbb R^m$ 上相对于伪分布 $\mu$ 的伪期望，记为 $\widetilde{\mathbb E}_{\mu(x)}[f(x)]$，定义为

$$
\widetilde{\mathbb E}_{\mu(x)}[f(x)]=\sum_x\mu(x)f(x).
$$

我们使用记号

$$
\widetilde{\mathbb E}_{\mu(x)}[(1,x_1,x_2,\ldots,x_m)^{\otimes \ell}]
$$

表示伪分布 $\mu$ 的次数 $\ell$ 矩张量。特别地，矩张量中的每个条目对应于某个次数至多为 $\ell$ 的单项式的伪期望。

**Definition 2.26（带约束的伪分布）。** 令

$$
\mathcal A=\{p_1\ge0,p_2\ge0,\ldots,p_r\ge0\}
$$

为 $m$ 个变量中 $r$ 个次数至多为 $d$ 的多项式不等式约束系统。令 $\mu$ 是 $\mathbb R^m$ 上的次数 $\ell$ 伪分布。如果对每个子集 $S\subset[r]$ 和每个满足

$$
\deg(q)+\sum_{i\in S}\max(\deg(p_i),d)\le\ell
$$

的平方和多项式 $q$，都有

$$
\widetilde{\mathbb E}_\mu\left[q\prod_{i\in S}p_i\right]\ge0,
$$

则称 $\mu$ 在次数 $\ell\ge1$ 下满足 $\mathcal A$。进一步地，如果上述不等式在加性误差范围内成立：

$$
\widetilde{\mathbb E}_\mu\left[q\prod_{i\in S}p_i\right]
\ge
-2^{-n\ell}\|q\|\prod_{i\in S}\|p_i\|,
$$

其中 $\|\cdot\|$ 表示用单项式基表示时多项式系数的 Euclidean 范数，则称 $\mu$ 近似满足约束系统 $\mathcal A$。

关键地，带约束伪分布的矩张量具有一个高效的分离 oracle。下面给出无约束陈述；带约束陈述类似推出。

**Fact 2.27 ([Sho87; Nes00; Par00; Gri01]).** 对任意 $m,\ell\in\mathbb N$，如下凸集在 [GLS81] 的意义下具有一个 $m^{O(\ell)}$ 时间的弱分离 oracle：[^10]

$$
\left\{
\widetilde{\mathbb E}_{\mu(x)}[(1,x_1,x_2,\ldots,x_m)^{\otimes\ell}]
\ \middle|\
\mu \text{ 是 } \mathbb R^m \text{ 上的次数 }\ell\text{ 伪分布}
\right\}.
$$

[^10]: 凸集 $S\subset\mathbb R^M$ 的分离 oracle 是一种算法，它可以判断向量 $v\in\mathbb R^M$ 是否属于该集合；如果不属于，则给出分离 $v$ 与 $S$ 的超平面。粗略地说，弱分离 oracle 是一种允许该判断存在某个 $\varepsilon$ 松弛的分离 oracle。

这一事实与弱分离和优化等价性 [GLS81] 共同构成平方和算法的基础，因为它允许我们高效地在伪分布上近似优化。

给定一个多项式约束系统 $\mathcal A$，如果它包含形如 $\{\|x\|^2\le1\}$ 的约束，则称它是显式有界的。于是下面事实来自 Fact 2.27 和 [GLS81]：

**Theorem 2.28（在伪分布上高效优化）。** 存在一个 $(m+r)^{O(\ell)}$ 时间算法，给定任何显式有界且可满足的、含 $m$ 个变量和 $r$ 个多项式约束的系统 $\mathcal A$，输出一个次数为 $\ell$ 的伪分布，该伪分布在 Definition 2.26 的意义下近似满足 $\mathcal A$。[^11]

[^11]: 这里我们假设 $\mathcal A$ 中约束的比特复杂度为 $(m+t)^{O(1)}$。

**Remark 2.29（比特复杂度与近似满足）。** 我们最终会把这个结果应用到一个约束系统，该系统可以用具有 $\log(t)$ 比特的数定义，其中 $t$ 是算法的样本复杂度，并按 $m$ 的多项式缩放。因此，我们可以高效运行该算法，而这里产生的误差，即关于 $n$ 指数小的误差，可以看作“机器精度”误差，并且会被其他地方产生的采样误差支配。因此在证明的其余部分，可以安全地忽略精度问题。

找到的伪分布 $D$ 只会近似满足 $\mathcal A$，但是只要 $\mathcal A\vdash B$ 的平方和证明的比特复杂度，即写下该证明所需的比特数，被 $m^{O(\ell)}$ 控制（假设输入中所有数字的比特复杂度为 $m^{O(1)}$），我们就可以在多项式时间内计算到足够好的误差，使得可靠性近似成立。我们所有的平方和证明都会具有这个比特复杂度。

现在陈述一些关于伪分布的标准事实，它们扩展了普通概率分布中成立的事实。这些事实可见于上述先前工作。

**Fact 2.30（伪分布的 Cauchy-Schwarz 不等式）。** 令 $f,g$ 是变量 $x\in\mathbb R^m$ 中次数至多为 $d$ 的多项式。则对任意次数为 $d$ 的伪分布 $\mu$，

$$
\widetilde{\mathbb E}_\mu[fg]
\le
\sqrt{\widetilde{\mathbb E}_\mu[f^2]}
\cdot
\sqrt{\widetilde{\mathbb E}_\mu[g^2]}.
$$

**Fact 2.31（伪分布的 Hölder 不等式）。** 令 $f,g$ 是变量 $x\in\mathbb R^m$ 中次数至多为 $d$ 的多项式。固定 $t\in\mathbb N$。则对任意次数为 $dt$ 的伪分布 $\mu$，

$$
\widetilde{\mathbb E}_\mu[f^{t-1}g]
\le
\left(\widetilde{\mathbb E}_\mu[f^t]\right)^{(t-1)/t}
\cdot
\left(\widetilde{\mathbb E}_\mu[g^t]\right)^{1/t}.
$$

特别地，当 $t$ 为偶数时，

$$
\widetilde{\mathbb E}_\mu[f]^t\le \widetilde{\mathbb E}_\mu[f^t].
$$

**平方和证明。** 除了次要技术细节外，我们的算法是建立一个多项式约束系统，然后调用 Theorem 2.28 来得到未定元 $\{\lambda'_i\mid i\in[m]\}$ 上的伪分布 $\mu$，该伪分布近似满足这些约束。有了这个伪分布后，我们将输出 $\widetilde{\mathbb E}_\mu[\lambda']$ 作为估计的哈密顿量系数。为了证明这些估计接近真实系数 $\lambda$，我们使用在 $\mu$ 下多项式约束成立的事实。也就是说，对约束 $p\ge0$，有 $\widetilde{\mathbb E}_\mu[p]\ge0$。如果我们能够用这些约束推出对每个 $a\in[m]$，

$$
|\widetilde{\mathbb E}_\mu[\lambda'_a]-\lambda_a|\le\varepsilon,
$$

则算法正确。因此我们给出这样一个证明：该证明将在平方和证明系统中给出。

令 $f_1,f_2,\ldots,f_r$ 和 $g$ 是未定元 $x\in\mathbb R^m$ 中的多变量多项式。给定约束 $\{f_1\ge0,\ldots,f_r\ge0\}$，恒等式 $\{g\ge0\}$ 的一个平方和证明，是一组多项式 $\{p_S\}_{S\subseteq[r]}$，使得

$$
g=\sum_{S\subseteq[r]}p_S^2\cdot\prod_{i\in S}f_i.
$$

顾名思义，存在这样的 SoS 证明说明：如果约束 $\{f_i\ge0\mid i\in[r]\}$ 被满足，则恒等式 $g\ge0$ 也被满足。如果对每个集合 $S\subseteq[r]$，多项式 $p_S^2\prod_{i\in S}f_i$ 的次数至多为 $\ell$，则称这个 SoS 证明的次数为 $\ell$。如果存在次数为 $\ell$ 的 SoS 证明，说明 $\{f_i\ge0\mid i\in[r]\}$ 推出 $\{g\ge0\}$，则写作

$$
\{f_i\ge0\mid i\in[r]\}\vdash_x^\ell\{g\ge0\}.
\tag{8}
$$

当不会造成混淆时，我们有时省略 $\vdash_x^\ell$ 中的未定元。对于所有多项式 $f,g:\mathbb R^m\to\mathbb R$，以及所有按坐标定义的多项式 $F:\mathbb R^m\to\mathbb R^{m_F}$、$G:\mathbb R^m\to\mathbb R^{m_G}$、$H:\mathbb R^{m_H}\to\mathbb R^m$，有以下推理规则。[^12]

[^12]: 这个记号应理解如下：给定横线以上的证明，可以推出横线以下的证明。

**加法规则**

$$
\frac{\mathcal A\vdash^\ell\{f\ge0,g\ge0\}}
{\mathcal A\vdash^\ell\{f+g\ge0\}}.
$$

**乘法规则**

$$
\frac{\mathcal A\vdash^\ell\{f\ge0\},\quad \mathcal A\vdash^{\ell'}\{g\ge0\}}
{\mathcal A\vdash^{\ell+\ell'}\{f\cdot g\ge0\}}.
$$

**传递规则**

$$
\frac{\mathcal A\vdash^\ell\mathcal B,\quad \mathcal B\vdash^{\ell'}\mathcal C}
{\mathcal A\vdash^{\ell\cdot\ell'}\mathcal C}.
$$

**代换规则**

$$
\frac{\{F\ge0\}\vdash^\ell\{G\ge0\}}
{\{F(H)\ge0\}\vdash^{\ell\cdot\deg(H)}\{G(H)\ge0\}}.
$$

平方和证明允许我们推出满足某些约束的伪分布的性质。

**Fact 2.32（可靠性）。** 令 $\mu$ 是次数为 $\ell$ 的伪分布。如果 $\mu$ 与次数为 $d_\mathcal A$ 的多项式约束集合 $\mathcal A$ 一致，记为 $\mu\models_{d_\mathcal A}\mathcal A$，并且存在次数为 $d_\mathcal B$ 的平方和证明，说明

$$
\mathcal A\vdash^{d_\mathcal B}\mathcal B,
$$

且 $\ell\ge d_\mathcal A d_\mathcal B$，则

$$
\mu\models_{d_\mathcal A d_\mathcal B}\mathcal B.
$$

我们还有 Fact 2.32 的逆命题：低层伪分布的每个性质都可以由低次数平方和证明推出。

**Fact 2.33（完备性）。** 令 $d\ge r\ge r'$。假设 $\mathcal A$ 是一组次数至多为 $r$ 的多项式约束，并且

$$
\mathcal A\vdash_x\left\{\sum_{i=1}^{m}x_i^2\le1\right\}.
$$

令 $\{g\ge0\}$ 是一个多项式约束。如果每个满足 $D\models_r\mathcal A$ 的次数 $d$ 伪分布也满足 $D\models_{r'}\{g\ge0\}$，则对每个 $\varepsilon>0$，存在一个平方和证明

$$
\mathcal A\vdash^d\{g\ge-\varepsilon\}.
$$

**基本平方和证明。** 现在回忆一些关于平方和证明的基本事实。首先，任何一元多项式不等式在实数上都承认平方和证明。

**Fact 2.34（一元多项式不等式承认 SoS 证明 [Lau09]）。** 令 $p$ 是次数为 $d$ 的多项式。如果对所有 $x\ge0$ 都有 $p(x)\ge0$，则

$$
\vdash_x^d\{p(x)\ge0\}.
$$

如果对所有 $x\in[a,b]$ 都有 $p(x)\ge0$，则

$$
\{x\ge a,x\le b\}\vdash_x^d\{p(x)\ge0\}.
$$

其次，如果 $p\ge0$ 且 $p$ 是二次多项式，则它承认平方和证明。

**Fact 2.35（二次多项式不等式承认 SoS 证明）。** 令 $p$ 是未定元 $x\in\mathbb R^m$ 中的多项式，且 $p$ 的次数为 $2$，并对所有 $x\in\mathbb R^m$ 都有 $p\ge0$。则

$$
\vdash_x^2\{p(x)\ge0\}.
$$

**证明。** 令 $M$ 是唯一的 $(m+1)\times(m+1)$ Hermitian 矩阵，使得对

$$
v(x)=(1,x_1,\ldots,x_m)^\dagger,
$$

有

$$
p(x_1,\ldots,x_m)=v(x)^\dagger Mv(x).
$$

不等式 $p\ge0$ 蕴含 $M$ 是 PSD：考虑向量 $v=(v_1,\ldots,v_{m+1})\in\mathbb R^{m+1}$。如果 $v_1\ne0$，则 $v^\dagger Mv=p(w)\ge0$，其中 $w_1=v_2/v_1,\ldots,w_m=v_{m+1}/v_1$。如果 $v_1=0$，则 $v^\dagger Mv=\lim_{c\to\infty}p(c\cdot w)\ge0$，其中 $w_1=v_2,\ldots,w_m=v_{m+1}$。这表明 $M$ 必须是 PSD，因此可以写为

$$
M=\sum_{i=1}^{m+1}u_iu_i^\dagger
$$

对某些向量 $u_i\in\mathbb R^{m+1}$ 成立。于是

$$
p(x_1,\ldots,x_m)=v(x)^\dagger Mv(x)=\sum_{i=1}^{m+1}\langle u_i,v(x)\rangle^2,
$$

这是次数为 $2$ 的 SoS 多项式，证明完成。

我们还使用以下基本平方和证明。更多细节可参见近期专著 [FKP+19]。

**Fact 2.36（算子范数界）。** 对称矩阵 $A\in\mathbb R^{d\times d}$ 和向量 $v\in\mathbb R^d$ 满足

$$
\vdash_v^2\left\{v^\dagger Av\le\|A\|\|v\|^2\right\}.
$$

**Fact 2.37（近似三角不等式）。** 令 $f_1,f_2,\ldots,f_r$ 为未定元。则

$$
\vdash_{f_1,f_2,\ldots,f_r}^{2t}
\left\{
\left(\sum_{i\le r}f_i\right)^{2t}
\le
r^{2t-1}\left(\sum_{i=1}^{r}f_i^{2t}\right)
\right\}.
$$

**Fact 2.38（SoS Hölder 不等式）。** 令 $w_1,\ldots,w_n$ 为未定元，令 $f_1,\ldots,f_n$ 是变量 $x\in\mathbb R^m$ 中次数为 $d$ 的多项式。令 $k$ 是 $2$ 的幂。则

$$
\{w_i^2=w_i,\ \forall i\in[n]\}\vdash_{x,w}^{2kd}
\left\{
\left(\frac1n\sum_{i=1}^{n}w_if_i\right)^k
\le
\left(\frac1n\sum_{i=1}^{n}w_i\right)^{k-1}
\left(\frac1n\sum_{i=1}^{n}f_i^k\right)
\right\}.
$$

**Fact 2.39（近似平方根）。** 给定标量未定元 $v$，

$$
\{v^2\le1\}\vdash_v^2\{-1\le v\le1\}.
$$

**证明。** 我们知道

$$
(1-v)^2=1+v^2-2v\ge0
$$

以及

$$
(1+v)^2=1+v^2+2v\ge0.
$$

由假设 $\{1-v^2\ge0\}$。因此，由加法规则得到 $\{2+2v\ge0\}$ 和 $\{2-2v\ge0\}$。整理即得结论。

# 3 多项式与嵌套对易子之间的转换

本节中，我们把矩阵的嵌套对易子与其相关本征值的多项式联系起来。我们从技术概览中提到的以下基本观察开始。

**Lemma 3.1（从嵌套对易子到本征多项式）。** 对矩阵 $A,B\in\mathbb C^{n\times n}$，在 $A$ 为对角且对角元为 $A_{ii}=\alpha_i$ 的基中，

$$
AB=B\circ\{\alpha_i\}_{ij},
\qquad
BA=B\circ\{\alpha_j\}_{ij}.
$$

因此，

$$
[A,B]_k=B\circ\{(\alpha_i-\alpha_j)^k\}_{ij}.
$$

进一步，由线性性，对于多项式 $q(x)=\sum_{k=0}^{d}c_kx^k$，

$$
\sum c_k[A,B]_k=B\circ\{q(\alpha_i-\alpha_j)\}_{ij}.
$$

基于上述观察，我们做如下定义，把一个多项式关联到涉及矩阵对易子的表达式。

**Definition 3.2（一元“对易子多项式”）。** 对多项式

$$
p(x)=a_0+a_1x+\cdots+a_dx^d,
$$

给定同样大小的方阵 $X,A$，定义

$$
p(X\mid A)=a_0A+a_1[X,A]_1+\cdots+a_d[X,A]_d.
$$

我们需要上述定义的一个推广，即把二元多项式 $p(x,y)$ 关联到涉及两个矩阵 $X,Y$ 的嵌套对易子表达式。我们主要关注 $X,Y$ 对易或近似对易的情形。首先推广嵌套对易子。

**Definition 3.3（二元嵌套对易子）。** 令 $S\in\{0,1\}^\ell$，并令 $X,Y,A\in\mathbb C^{N\times N}$ 为矩阵。考虑长度为 $\ell$ 的序列 $Z_1,Z_2,\ldots,Z_\ell$，其中每个 $Z_i\in\{X,Y\}$，且当且仅当 $S$ 的第 $i$ 个条目为 $0$ 时 $Z_i=X$。定义

$$
[(X,Y)_S,A]=[Z_1,[Z_2,[\ldots[Z_\ell,A]\ldots]]].
$$

对于单项式 $x^iy^j$，我们希望把它关联到一个嵌套对易子 $[(X,Y)_S,A]$，其中 $S$ 中 $0$ 和 $1$ 的数量分别为 $i$ 和 $j$。这样的对易子有很多种，反映出 $X$ 与 $Y$ 不一定对易。我们将证明，当 $X,Y$ 接近对易时，这些嵌套对易子也彼此接近，因此 $S$ 中的顺序并不重要。当 $|S|=2$ 时，这来自下面的恒等式。

**Fact 3.4（Jacobi 恒等式）。** 有恒等式

$$
[X,[Y,A]]-[Y,[X,A]]=[[X,Y],A].
$$

我们把它扩展到高阶对易子。

**Lemma 3.5（重排二元嵌套对易子）。** 对任意两个序列 $S,S'\in\{0,1\}^\ell$，如果它们具有相同数量的 $0$ 和 $1$，并令 $t\le\ell^2$ 为把 $S$ 变换为 $S'$ 所需的相邻交换次数，则存在系数 $c_1,\ldots,c_t\in\{-1,1\}$，以及序列 $S_1,T_1,\ldots,S_t,T_t$，满足 $\operatorname{len}(S_i)+\operatorname{len}(T_i)=\ell-2$，使得

$$
[(X,Y)_S,A]-[(X,Y)_{S'},A]
=
\sum_{i=1}^{t}c_i[(X,Y)_{S_i},[[X,Y],[(X,Y)_{T_i},A]]].
$$

**证明。** 考虑 $S,S'$ 只相差一次相邻元素交换的情形。此时由 Fact 3.4，左端差值恰好等于如下形式的一项：

$$
[(X,Y)_{S_i},[[X,Y],[(X,Y)_{T_i},A]]],
$$

其中 $S_i$ 是到 $S,S'$ 发生差异位置之前的前缀，$T_i$ 是后缀。现在可以反复应用这一步，通过交换 $S$ 的相邻元素直到它与 $S'$ 匹配。每个剩余项都具有右端给出的形式，因此证明完成。

现在我们通过为每个单项式任意选择一个相关的 $S$ 顺序，定义二元多项式与二元嵌套对易子之间的对应。

**Definition 3.6（二元“对易子多项式”）。** 给定一个二元次数为 $d$ 的多项式

$$
p(x,y)=\sum_{i+j\le d}a_{ij}x^iy^j,
$$

我们把它与矩阵 $X,Y,A\in\mathbb C^{n\times n}$ 相关联的矩阵对易子多项式定义为

$$
p(X,Y\mid A)=\sum_{i+j\le d}a_{ij}[X,[Y,A]_j]_i.
$$

我们需要的关键性质是：某些多项式恒等式，即原二元多项式中的恒等式，在这种转换下基本保持。我们先对单项式证明这一点。下面的事实给出 $A$ 上的对易子多项式与 $B$ 上的对易子多项式之间的关系。

**Fact 3.7.** 对任意 Hermitian 矩阵 $X$ 以及矩阵 $A,B,\rho$，有恒等式

$$
\operatorname{tr}([X,A]B^\dagger\rho)
-
\operatorname{tr}(A[X,B]^\dagger\rho)
=
-\operatorname{tr}(AB^\dagger[X,\rho]).
$$

**证明。**

$$
\operatorname{tr}([X,A]B^\dagger\rho)-\operatorname{tr}(A[X,B]^\dagger\rho)
$$

$$
=\operatorname{tr}(XAB^\dagger\rho-AXB^\dagger\rho)
-\operatorname{tr}(AB^\dagger X\rho-AXB^\dagger\rho)
$$

$$
=\operatorname{tr}(XAB^\dagger\rho)-\operatorname{tr}(AB^\dagger X\rho)
$$

$$
=\operatorname{tr}(AB^\dagger\rho X)-\operatorname{tr}(AB^\dagger X\rho)
$$

$$
=-\operatorname{tr}(AB^\dagger[X,\rho]).
$$

这可以扩展到一般单项式。

**Lemma 3.8（对易子单项式等价）。** 令 $p(x,y)=x^{i_1}y^{i_2}$、$q(x,y)=x^{j_1}y^{j_2}$，并令 $r(x,y)=p(x,y)q(x,y)$。令 $d=\deg(r)$。则对某个 $\ell\le d^2$，可以写成

$$
\operatorname{tr}\!\left(p(X,Y\mid A)q(X,Y\mid B)^\dagger\rho\right)
-
\operatorname{tr}\!\left(A\cdot r(X,Y\mid B)^\dagger\rho\right)
=
\sum_{i=1}^{\ell}Z_i,
$$

其中每个 $Z_i$ 都是以下三类误差之一：

1. 
$$
\pm\operatorname{tr}\!\left([(X,Y)_S,A][(X,Y)_T,B]^\dagger[X,\rho]\right),
$$
其中 $\operatorname{len}(S)+\operatorname{len}(T)=d-1$；

2. 
$$
\pm\operatorname{tr}\!\left([(X,Y)_S,A][(X,Y)_T,B]^\dagger[Y,\rho]\right),
$$
其中 $\operatorname{len}(S)+\operatorname{len}(T)=d-1$；

3. 
$$
\pm\operatorname{tr}\!\left(A[(X,Y)_S,[[X,Y],[(X,Y)_T,B]]]^\dagger\rho\right),
$$
其中 $\operatorname{len}(S)+\operatorname{len}(T)=d-2$。

**证明。** 我们的目标是把

$$
\operatorname{tr}\!\left([X,[Y,A]_{i_2}]_{i_1}[X,[Y,B]_{j_2}]_{j_1}^{\dagger}\rho\right)
-
\operatorname{tr}\!\left(A[X,[Y,B]_{i_2+j_2}]_{i_1+j_1}^{\dagger}\rho\right)
$$

表达成误差之和。观察到 Fact 3.7 允许我们从 $A$ 前面的对易子中移除一个 $X$ 或 $Y$，并把它移动到 $B$ 前面的对易子上，代价是产生一个类型 1 或类型 2 的误差项。因此，我们可以反复应用 Fact 3.7，把 $A$ 前面对易子中的所有 $X$ 和 $Y$ 移动到 $B$ 前面的对易子上，并把

$$
\operatorname{tr}\!\left([X,[Y,A]_{i_2}]_{i_1}[X,[Y,B]_{j_2}]_{j_1}^{\dagger}\rho\right)
-
\operatorname{tr}\!\left(A[Y,[X,[Y,B]_{j_2}]_{j_1+i_1}]_{i_2}^{\dagger}\rho\right)
$$

写成 $i_1$ 个类型 1 项和 $i_2$ 个类型 2 项之和。接着，我们可以应用 Lemma 3.5，以类型 3 误差项为代价，重新排列 $B$ 前面对易子中 $X$ 和 $Y$ 的序列。这使我们可以把

$$
\operatorname{tr}\!\left(A[Y,[X,[Y,B]_{j_2}]_{j_1+i_1}]_{i_2}^{\dagger}\rho\right)
-
\operatorname{tr}\!\left(A[X,[Y,B]_{i_2+j_2}]_{i_1+j_2}^{\dagger}\rho\right)
$$

写成 $i_2(j_1+i_1)$ 个类型 3 项之和。合并后得到所需界。

**Theorem 3.9（从多项式恒等式到嵌套对易子恒等式）。** 考虑两个变量中的形式多项式恒等式

$$
p_1(x,y)q_1(x,y)+\cdots+p_k(x,y)q_k(x,y)=0,
$$

其中每个多项式 $p_i,q_i$ 都是 $(d,C)$-有界的。令 $X,Y\in\mathbb C^{N\times N}$ 为 Hermitian 矩阵，$\rho,A,B\in\mathbb C^{N\times N}$ 为任意矩阵。则可以写成

$$
\operatorname{tr}\!\left(
\left(p_1(X,Y\mid A)q_1(X,Y\mid B)^\dagger+\\cdots+
p_k(X,Y\mid A)q_k(X,Y\mid B)^\dagger\right)\rho
\right)
=
\sum_{i=1}^{t}c_iZ_i,
$$

其中 $t\le4kd^6$，系数 $c_i$ 满足 $|c_i|\le C^22^{2d}$，并且每个 $Z_i$ 都是以下三类误差之一：

1. 
$$
\pm\frac1{(\operatorname{len}(S)+\operatorname{len}(T))!}
\operatorname{tr}\!\left([(X,Y)_S,A][(X,Y)_T,B]^\dagger[X,\rho]\right),
$$
其中 $\operatorname{len}(S)+\operatorname{len}(T)\le2d$；

2. 
$$
\pm\frac1{(\operatorname{len}(S)+\operatorname{len}(T))!}
\operatorname{tr}\!\left([(X,Y)_S,A][(X,Y)_T,B]^\dagger[Y,\rho]\right),
$$
其中 $\operatorname{len}(S)+\operatorname{len}(T)\le2d$；

3. 
$$
\pm\frac1{(\operatorname{len}(S)+\operatorname{len}(T))!}
\operatorname{tr}\!\left(A[(X,Y)_S,[[X,Y],[(X,Y)_T,B]]]^\dagger\rho\right),
$$
其中 $\operatorname{len}(S)+\operatorname{len}(T)\le2d$。

**证明。** 令 $r_\ell(x,y)=p_\ell(x,y)q_\ell(x,y)$。由假设的形式多项式恒等式，

$$
\operatorname{tr}\!\left((Ar_1(X,Y\mid B)^\dagger+\cdots+Ar_k(X,Y\mid B)^\dagger)\rho\right)=0.
$$

因此，只需把每个乘积

$$
\operatorname{tr}\!\left(p_\ell(X,Y\mid A)q_\ell(X,Y\mid B)^\dagger\rho\right)
-
\operatorname{tr}\!\left(Ar_\ell(X,Y\mid B)^\dagger\rho\right)
$$

表达为误差的线性组合。写

$$
p_\ell=\sum_{i_1,i_2}a_{\ell,i_1,i_2}x^{i_1}y^{i_2},
\qquad
q_\ell=\sum_{j_1,j_2}b_{\ell,j_1,j_2}x^{j_1}y^{j_2}.
$$

可以把上述表达式展开为对易子单项式：

$$
\operatorname{tr}\!\left(p_\ell(X,Y\mid A)q_\ell(X,Y\mid B)^\dagger\rho\right)
-
\operatorname{tr}\!\left(Ar_\ell(X,Y\mid B)^\dagger\rho\right)
$$

$$
=
\sum_{i_1,i_2,j_1,j_2}a_{\ell,i_1,i_2}b_{\ell,j_1,j_2}
\left(
\operatorname{tr}([X,[Y,A]_{i_2}]_{i_1}[X,[Y,B]_{j_2}]_{j_1}^{\dagger}\rho)
-
\operatorname{tr}(A[X,[Y,B]_{i_2+j_2}]_{i_1+j_1}^{\dagger}\rho)
\right).
$$

Lemma 3.8 表明如何把每个求和项展开为误差项；注意该乘积的次数是 $i_1+j_1+i_2+j_2\le2d$。每个求和项至多有 $(2d)^2$ 个误差项，而每个乘积 $p_\ell q_\ell$ 有 $d^4$ 个求和项。这给出误差项总数上界 $4kd^6$，如所需。剩下只需控制系数大小。对与某个特定求和项相关的任意类型误差项，其系数是 $a_{\ell,i_1,i_2}b_{\ell,j_1,j_2}$。令 $S,T$ 是与该误差项相关的序列。因为 $p_\ell$ 和 $q_\ell$ 是 $(d,C)$-有界的，可以控制

$$
|a_{\ell,i_1,i_2}b_{\ell,j_1,j_2}|
\le
\frac{C^2}{(i_1+i_2)!(j_1+j_2)!}
\le
\frac{C^22^{2d}}{(i_1+i_2+j_1+j_2)!}
\le
\frac{C^22^{2d}}{(\operatorname{len}(S)+\operatorname{len}(T))!}.
$$

最后一个不等式成立，因为在所有误差类型中，$\operatorname{len}(S)+\operatorname{len}(T)$ 至多为该乘积的次数。

# 4 指数函数的多项式近似

本节目标是构造一个对 $e^x$ 的多项式近似，满足算法所需的性质。特别地，我们需要一个在区间 $[-\kappa,\kappa]$ 上近似 $e^x$ 的多项式，并额外要求该多项式在近似区域外增长不要过快。

**Definition 4.1（指数函数的平坦近似）。** 给定 $\varepsilon,\eta\in(0,1)$ 和 $\kappa\ge1$，如果多项式 $p(x)$ 满足：

1. 对 $x\in[-\kappa,\kappa]$，
$$
|p(x)-e^x|\le\varepsilon;
$$

2. 
$$
|p(x)|\le \max(1,e^x)e^{\eta|x|},
$$

则称 $p(x)$ 是一个 $(\kappa,\eta,\varepsilon)$-平坦指数近似。

指数函数 $e^x$ 的典范多项式近似是其 Taylor 级数截断。

**Definition 4.2.** 令

$$
s_\ell(x)=\sum_{k=0}^{\ell}\frac{x^k}{k!}
$$

表示 $e^x$ 的次数 $\ell$ Taylor 级数截断。

**Remark 4.3.** Taylor 级数截断 $s_\ell(x)$ 不满足 Definition 4.1 中所需的近似性质，即使 $\ell$ 很大也不满足。这是因为该截断在负尾部增长过快：

$$
|s_\ell(-\ell)|\asymp e^\ell>e^{\eta\ell}.
$$

传统指数近似也有相同问题，例如 Chebyshev 级数截断和 QSVT 风格的 Chebyshev 级数“有界”近似 [GSLW19; TT23]：这些次数为 $\ell$ 的截断在 $-\ell$ 附近区域失效，因此值得注意的是，增加次数并不会改善这些近似的平坦性参数。

虽然用于近似指数函数的标准技术不够充分，但我们构造了一个修正多项式，它是指数函数的平坦近似。

**Definition 4.4（迭代截断 Taylor 级数）。** 对正整数 $k,\ell$，定义

$$
p_{k,\ell}(x)=s_{2\ell}(x/k)\cdot s_{4\ell}(x/k)\cdots s_{2^k\ell}(x/k),
$$

为 $k$ 个几何递增 Taylor 级数截断的乘积。接着，定义 $p_{k,\ell}(x)$ 的移位积分为

$$
q_{k,\ell}(x)=1+\int_0^x p_{k,\ell}(y)\,dy.
$$

$p_{k,\ell}(x)$ 和 $q_{k,\ell}$ 的次数分别为 $(2^{k+1}-1)\ell$ 和 $(2^{k+1}-1)\ell+1$。

同样重要的是，$p_{k,\ell}$ 总是非负的，因此 $q_{k,\ell}$ 单调递增。本节证明的主要定理如下。

**Theorem 4.5（指数函数的平坦近似）。** 给定 $\varepsilon,\eta\in(0,1)$ 和 $\kappa\ge1$，令 $k\ge5/\eta$ 且 $\ell\ge100(\kappa+\log(k/\varepsilon))$。则多项式 $p_{k,\ell},q_{k,\ell}$ 是 $(\kappa,\eta,\varepsilon)$-平坦指数近似。

**Theorem 4.6（平坦近似的单调性）。** 对任意正整数 $k,\ell$，有如下结论：

$$
\vdash_{x,y}^{2^{k+1}\ell+20}
\left\{
0.5(x-y)(1+0.25(x-y)^2)(q_{k,\ell}(x)-q_{k,\ell}(y))
-0.00025(x-y)^2p_{k,\ell}(x)
\ge0
\right\}.
$$

此外，左端是变量 $x,y$ 中的一个 $(10^{2^k\ell},2^k\ell+10,200^{2^k\ell})$-有界平方和多项式。

**Remark 4.7.** 注意 Theorem 4.6 来自如下直觉：粗略地说，应当有

$$
q_{k,\ell}(x)-q_{k,\ell}(y)
=
\int_y^x p_{k,\ell}(y)\,dy
\ge
(x-y)(p_{k,\ell}(x)-p_{k,\ell}(y)).
$$

不过上式并不完全正确，因此 Theorem 4.6 中的附加项用于补偿这一点。差值不仅非负，而且是平方和多项式，这一点将在之后的算法分析中至关重要。

我们将在本节证明 Theorem 4.5。Theorem 4.6 的证明较长且偏计算性，因此推迟到附录。我们先建立关于截断 Taylor 级数以及多项式 $p$ 和 $q$ 的一些基本事实。下面事实来自 Taylor 定理；该定理蕴含对每个 $x\in\mathbb R$，存在某个 $c\in[0,1]$，使得

$$
e^x-s_\ell(x)=e^{cx}\frac{x^{\ell+1}}{(\ell+1)!}.
\tag{9}
$$

**Fact 4.8（$e^x$ 的截断 Taylor 级数的界）。** 对 $x\ge0$，所有 $\ell$ 都有 $e^x\ge s_\ell(x)$。对 $x<0$，所有 $\ell$ 都有

$$
s_{2\ell-1}(x)\le e^x\le s_{2\ell}(x).
$$

**Corollary 4.9（偶数截断非负）。** 对任意 $\ell\in\mathbb N$，对所有 $x\in\mathbb R$，有

$$
s_{2\ell}(x)\ge0.
$$

**Lemma 4.10（$e^x$ 的 Taylor 级数截断）。** 给定 $\varepsilon\in(0,1)$ 和 $b\ge0$，令 $\ell\ge10b+\log(1/\varepsilon)$。则对 $x\in[-b,b]$，

$$
|s_\ell(x)-e^x|\le\varepsilon.
$$

**证明。** 该陈述也来自 Taylor 定理 (9)。由此，对所有 $x$，Taylor 级数截断的近似误差满足

$$
|s_{\ell-1}(x)-e^x|
\le
\frac{e^{|x|}|x|^\ell}{\ell!}
\le
 e^{|x|}\left(\frac{e|x|}{\ell}\right)^\ell.
$$

取

$$
\ell\ge e^2|x|+\log(e^{|x|}/\varepsilon)
$$

即可使上述表达式被 $\varepsilon$ 控制。[^13] 最终界来自取 $|x|\le b$。

[^13]: 这可以改进一个 $\log\log$ 因子 [GSLW19, Lemma 59]，但这并不会改善我们应用中参数设定下的次数。

**Claim 4.11.** 多项式 $p_{k,\ell}$ 是 $((2^{k+1}-1)\ell,1)$-有界的，多项式 $q_{k,\ell}$ 是 $((2^{k+1}-1)\ell+1,1)$-有界的。

**证明。** 注意 $p_{k,\ell}$ 中单项式系数全为正，并且全都小于以下表达式中相应单项式系数：

$$
\left(1+\frac{x/k}{1!}+\frac{(x/k)^2}{2!}+\cdots\right)^k,
$$

这里把每个截断和替换为完整无穷和。然而上式恰好等于

$$
1+x+\frac{x^2}{2!}+\cdots.
$$

因此，对任意次数 $d$，$p_{k,\ell}(x)$ 中 $x^d$ 的系数至多为 $1/d!$。由于 $p_{k,\ell}$ 的次数是 $(2^{k+1}-1)\ell$，所以 $p_{k,\ell}$ 是 $((2^{k+1}-1)\ell,1)$-有界的。回忆 $q_{k,\ell}$ 是通过对 $p$ 积分得到的，因此立刻得到 $q_{k,\ell}$ 的系数也满足同样类型的界，即它是 $((2^{k+1}-1)\ell+1,1)$-有界的，证明完成。

现在转向 Theorem 4.5 的证明。

**Theorem 4.5 的证明。** 我们先证明 $p_{k,\ell}$ 的陈述。由 Lemma 4.10（其中 $\varepsilon\leftarrow\varepsilon/(k2^{2\kappa})$），对所有 $x\in[-\kappa,\kappa]$，

$$
\left|\frac{s_{2^j\ell}(x/k)}{e^{x/k}}-1\right|
\le
\frac{\varepsilon}{k\cdot e^{2\kappa}}.
$$

因此，

$$
1-\frac{\varepsilon}{e^{2\kappa}}
\le
\frac{p_{k,\ell}(x)}{e^x}-1
\le
1+\frac{\varepsilon}{e^{2\kappa}},
$$

所以在区间 $[-\kappa,\kappa]$ 上有 $|p_{k,\ell}(x)-e^x|\le\varepsilon/\kappa$。通过对上述不等式积分，立刻得到 $q_{k,\ell}(x)$ 的相同保证。

现在证明 $p_{k,\ell}$ 的第二个条件。对 $x\ge0$，由 Fact 4.8 直接得到 $e^x$ 上界。对 $x\le0$，令 $j_0$ 为满足 $-x<2^{j_0+1}k\ell$ 的最小正整数。则对所有 $1\le j<j_0$，

$$
s_{2^j\ell}(x/k)\le \frac{(x/k)^{2^j\ell}}{(2^j\ell)!}.
$$

而对所有 $j>j_0+2$，

$$
s_{2^j\ell}(x/k)
=s_{(2^j\ell)-1}(x/k)+\frac{(x/k)^{2^j\ell}}{(2^j\ell)!}
\le
 e^{x/k}+\left(\frac{3x}{2^j\ell k}\right)^{2^j\ell}
\le1,
\tag{10}
$$

其中使用了 Fact 4.8。最后，对 $j_0\le j\le j_0+2$，

$$
s_{2^j\ell}(x/k)
=s_{(2^j\ell)-1}(x/k)+\frac{(x/k)^{2^j\ell}}{(2^j\ell)!}
\le
1+\frac{(x/k)^{2^j\ell}}{(2^j\ell)!}
\le
2\max\left(\frac{(x/k)^{2^j\ell}}{(2^j\ell)!},1\right).
\tag{11}
$$

总体而言，合并上述不等式可得

$$
p_{k,\ell}(x)=s_{2\ell}(x/k)\cdots s_{2^k\ell}(x/k)
\le
8\prod_{j=1}^{k}\max\left(\frac{(x/k)^{2^j\ell}}{(2^j\ell)!},1\right),
\tag{12}
$$

其中因子 $8$ 是因为需要在至多 $3$ 项上应用 (11)。注意存在某个 $k_0\in\{j_0,j_0+1,j_0+2\}$，使得

$$
\frac{(x/k)^{2^j\ell}}{(2^j\ell)!}>1
$$

恰好当 $j\le k_0$ 时成立。于是可以如下上界 Eq. (12)：

$$
p_{k,\ell}(x)
\le
\frac{8(x/k)^{(2^{k_0+1}-2)\ell}}{(2\ell)!\cdots(2^{k_0}\ell)!}.
\tag{13}
$$

进一步地，

$$
(2\ell)!\cdots(2^{k_0}\ell)!
\ge
\frac{((2^{k_0+1}-2)\ell)!}{4^{(2^{k_0+1}-2)\ell}}.
$$

代回 Eq. (13)，得到

$$
p_{k,\ell}(x)
\le
\frac{(5x/k)^{(2^{k_0+1}-2)\ell}}{((2^{k_0+1}-2)\ell)!}
\le e^{5|x|/k}.
\tag{14}
$$

由 $q$ 是通过对 $p$ 积分得到的定义，也得到 $q$ 的所需界。

# 5 访问 Gibbs 态：量子部分

现在我们描述算法如何使用 $\rho$ 的拷贝。这是算法中唯一访问 $\rho$ 的位置；算法其余部分完全是经典的。通过对 $\rho$ 的拷贝进行测量，我们可以估计各种矩阵 $X$ 的可观测量期望 $\operatorname{tr}(X\rho)$。这些估计随后将用于学习算法。

**Lemma 5.1.** 令 $X=UDU^\dagger\in\mathbb C^{N\times N}$ 是一个可酉对角化的矩阵，并假设给定密度矩阵为 $\rho\in\mathbb C^{N\times N}$ 的量子态拷贝。则可以使用

$$
O\left(\frac1{\varepsilon^2}\log\frac1\delta\right)
$$

份 $\rho$ 拷贝，以概率至少 $1-\delta$，把 $\operatorname{tr}(X\rho)$ 估计到 $\varepsilon\|X\|$ 误差。运行时间为样本数乘以把 $U^\dagger$ 施加到量子态并在计算基中测量的代价。

**证明。** 考虑取 $\rho$ 并施加 $U^\dagger$，形成 $U^\dagger\rho U$，然后在计算基中测量。以概率 $\langle u_i|\rho|u_i\rangle$ 看到结果 $i$，其中 $u_i$ 是 $U$ 的第 $i$ 列。令 $z$ 为执行该测量后取 $z=D_{i,i}$ 所得随机变量；则

$$
\mathbb E[z]=\sum_iD_{i,i}\langle u_i|\rho|u_i\rangle=\operatorname{tr}(X\rho),
$$

并且 $z$ 总被 $\max_i|D_{i,i}|=\|X\|$ 控制。由 Chernoff 界可得，平均

$$
O\left(\frac1{\varepsilon^2}\log\frac1\delta\right)
$$

个独立估计器的拷贝给出所需误差界。

我们希望对许多不同的 Pauli 可观测量 $X$ 估计 $\operatorname{tr}(X\rho)$，因此可以简单地对每一个运行 Lemma 5.1。不过，我们可以使用类似 classical shadows 的过程 [HKP20] 一次性估计它们。

**Lemma 5.2（计算 Gibbs 态可观测量的期望）。** 令

$$
H=\sum_{a=1}^{m}\lambda_aE_a
$$

是 $n$ 个量子比特上的 $K$-local 哈密顿量，其对偶相互作用图 $G$ 的最大度为 $d$。考虑 $\ell$-$G$-local Paulis 的集合 $\mathcal P_\ell$。存在一个量子算法，以概率至少 $1-\delta$ 输出对所有 $P_1,P_2,P_3\in\mathcal P_\ell$ 的 $\operatorname{tr}(P_1P_2P_3\rho)$ 的估计，误差为 $\varepsilon$。该算法使用

$$
t=O\left(\frac{4^{3\ell}}{\varepsilon^2}\log\frac{|\mathcal P_\ell|^3}{\delta}\right)
$$

个样本、$O(nt)$ 个量子门，以及 $\operatorname{poly}(t,n,|\mathcal P_\ell|)$ 经典后处理时间。

**证明。** 考虑如下过程：输入一份 $\rho$，随机均匀选择一个 Pauli 矩阵 $P\in\mathcal P$，旋转到其本征基，然后在计算基中测量，得到测量结果 $b\in\{0,1\}^n$。取

$$
t=O\left(\frac{4^{3\ell}}{\varepsilon^2}\log\frac{|\mathcal P_\ell|^3}{\delta}\right)
$$

个这样的样本 $(P,b)$，并把集合记为 $S$。

现在考虑估计某个 $\operatorname{tr}(X\rho)$，其中 $X=UDU^\dagger\in\mathcal P$ 且 $\operatorname{supp}(X)\le3\ell$；$P_1P_2P_3$ 最多差一个单位根，正是这样的 $X$。由于

$$
\operatorname{tr}(X\rho)
=
\operatorname{tr}_{\operatorname{supp}(X)}\left(X^{(\operatorname{supp}(X))}\operatorname{tr}_{[n]\setminus\operatorname{supp}(X)}(\rho)\right),
$$

只需考虑 $\rho$ 在 $X$ 的支撑上的限制。令 $T\subset S$ 为 Pauli 矩阵在 $X$ 的支撑上与 $X$ 一致的样本集合。然后可以使用这个子样本来运行 Lemma 5.1 并估计 $\operatorname{tr}(X\rho)$，因为使用 Lemma 5.1 所需的只是 $X$ 对角化基中的测量。任意给定样本处于一个使 $X$ 对角化的基中的概率至少为 $4^{-3\ell}$，因此用 $t$ 个样本即可保证以失败概率 $\delta/|\mathcal P_\ell|^3$ 得到 $\operatorname{tr}(X\rho)$ 的 $\varepsilon$-好估计。由 union bound 可得，我们的样本集合可以以概率至少 $1-\delta$ 给出每个 $\operatorname{tr}(P_1P_2P_3\rho)$ 的 $\varepsilon$-好估计。

运行时间可见为 $\operatorname{poly}(t,n,|\mathcal P_\ell|)$。注意，对任意 Pauli 乘积 $P\in\mathcal P$，可以用 $O(n)$ 个门施加旋转到其本征基的量子门，因此量子门复杂度为

$$
O(nt)=O\left(\frac{4^{3\ell}n}{\varepsilon^2}\log\frac{|\mathcal P_\ell|^3}{\delta}\right).
$$

# 6 算法与分析

现在我们准备给出学习算法。我们求解如下哈密顿量学习问题。

**Problem 1（哈密顿量学习）。** 回忆 Definitions 2.7 和 2.8 中描述的设定，令

$$
H=\sum_{a=1}^{m}\lambda_aE_a\in\mathbb C^{N\times N}
$$

为 $n$ 个量子比特上的 $K$-local 哈密顿量，其项 $E_a$ 是已知的、互不相同的、非恒等 Pauli 算子，并且其系数 $\lambda_a\in\mathbb R$ 满足 $|\lambda_a|\le1$。令 $d$ 表示与该哈密顿量相关的对偶相互作用图中顶点的最大度。给定 $\varepsilon,\delta>0$，以及与 $H$ 在已知逆温度 $\beta>0$ 下对应的 Gibbs 态

$$
\rho=\frac{\exp(-\beta H)}{\operatorname{tr}\exp(-\beta H)}
$$

的拷贝，求估计 $\hat\lambda_a$，使得以概率至少 $1-\delta$，对所有 $a\in[m]$ 都有

$$
(\hat\lambda_a-\lambda_a)^2\le\varepsilon^2.
$$

**Theorem 6.1（高效学习量子哈密顿量）。** 令

$$
H=\sum_{a=1}^{m}\lambda_aE_a\in\mathbb C^{N\times N}
$$

为 $n$ 个量子比特上的 $K$-local 哈密顿量，其对偶相互作用图的度为 $d$（如 Problem 1）。假设给定各项 $\{E_a\}_{a\in[m]}$、$\varepsilon>0$、$\delta>0$，以及 Gibbs 态 $\rho$ 在已知逆温度 $\beta>0$ 下的拷贝。则存在一个算法，能够输出估计 $\tilde\lambda_a$，使得以概率至少 $1-\delta$，对所有 $a\in[m]$ 都有

$$
(\hat\lambda_a-\lambda_a)^2\le\varepsilon^2.
$$

该算法使用

$$
O\left(
(m^6/\varepsilon^{e^{f(K,d)\beta}})\log(m/\delta)
+
\frac{f(K,d)}{\beta^2\varepsilon^2}\log(m/\delta)
\right)
$$

份 Gibbs 态拷贝，运行时间为

$$
\operatorname{poly}(m,\log(1/\delta))\cdot (1/\varepsilon)^{e^{f(K,d)\beta}}
+
\frac{f(K,d)m}{\beta^2\varepsilon^2}\log(m/\delta),
$$

其中 $f(K,d)$ 是只依赖于 $K$ 和 $d$ 的正函数。

具体地，我们证明当对某个正函数 $g$ 有 $\beta>g(K,d)$ 时，存在一个算法，以

$$
(m^6/\varepsilon^{e^{f(K,d)\beta}})\log(m/\delta)
$$

的样本复杂度和

$$
\operatorname{poly}(m,\log(1/\delta))\cdot(1/\varepsilon)^{e^{f(K,d)\beta}}
$$

的时间复杂度成功，其中 $f(K,d)$ 是某个正函数。我们通过把 $g$ 取为高温算法 [HKT22] 停止工作的阈值，并把我们的复杂度界与高温算法的复杂度界结合，得到 Theorem 6.1。要求 $\beta$ 有常数下界只是简化；适当调整后，相同的算法和分析应当适用于任意温度。

我们关注 $K$ 和 $d$ 为常数的设定，也就是哈密顿量是低相交的设定，因此不试图优化对这些参数的依赖。进一步地，我们假设 $n=O(m)$；这不失一般性，因为为了使哈密顿量的支撑覆盖所有 $n$ 个量子比特，必须有 $m\ge n/K$。

我们的主定理来自如下事实：一个精心选择的多项式系统的低次数平方和松弛可以被舍入，从而得到真实系数 $\{\lambda_a\}_{a\in[m]}$ 的精确估计。我们先建立该系统，然后逐步得到完整算法（Algorithm 6.2）。

**给出多项式系统。** 首先建立精确的多项式系统，之后我们将求解它。令

$$
\varepsilon_0=\frac{\varepsilon^{10 C_{K,d}\beta}}{m^3}
$$

其中 $C_{K,d}$ 是只依赖于 $K$ 和 $d$ 的足够大常数。接着令

$$
\ell_0=2C_{K,d}\beta\log(1/\varepsilon),
\qquad
\ell_1=4K,
$$

并定义

$$
\mathcal A=\mathcal P_{\ell_0}^{4C_{K,d}\beta},
\qquad
\mathcal B=\mathcal P_{\ell_1}
$$

（如 Definition 2.9 中）。

令

$$
\lambda'=[\lambda'_1,\lambda'_2,\ldots,\lambda'_m]
$$

为一组未定元。我们将在这些未定元中求解一个多项式系统，然后用它提取真实系数的估计。在该系统中，以及全文中，记

$$
H'=\sum_a\lambda'_aE_a.
$$

这个对象 $H'$ 只是记号便利：我们并不优化这个指数大小的对象。我们只需要处理 $H'$ 的迹，因此我们的多项式系统有一个简洁的、多项式大小的表示。

我们首先使用 Lemma 5.2，对所有 $A_1,A_2,A_3\in\mathcal A$ 测量 $\rho$，构造 $\operatorname{tr}(A_1A_2A_3\rho)$ 的 $\varepsilon_0$-精确估计。令 $\widetilde{\operatorname{tr}}$ 表示从 $A_1A_2A_3\rho$ 映到我们对 $\operatorname{tr}(A_1A_2A_3\rho)$ 的估计的映射，并按线性性扩展到我们已估计的此类矩阵的线性组合。[^14] 再次说明，这只是多项式系统中的记号便利。

[^14]: 为使其良定义，需要保证我们只估计一组线性无关的 $A_1A_2A_3$。这只需要在相位意义下去除重复项。

由 Corollary 2.20，

$$
|\mathcal A|\le m(10d)^{4C_{K,d}\beta\ell_0}
\le m(1/\varepsilon)^{10C_{K,d}\beta},
$$

因此可以在 $\operatorname{poly}_{\beta,K,d}(m,1/\varepsilon)$ 运行时间和样本复杂度

$$
O\left(
\frac{4^{3\cdot4C_{K,d}\beta\ell_0}}{\varepsilon_0^2}
\log\frac{|\mathcal P_{\ell_0}^{4C_{K,d}\beta}|}{\delta}
\right)
=
O\left(
\frac{m^6}{\varepsilon^{20C_{K,d}\beta}}
\log\frac{m}{\delta}
\right)
\tag{15}
$$

下产生这些估计。这就是整个算法的样本复杂度，因为这是我们所需的全部关于 $\rho$ 的信息。然后写出如下多项式系统：

$$
\mathcal C_{\lambda'}=
\left\{
\begin{array}{ll}
\forall a\in[m], & -1\le\lambda'_a\le1,\\[1mm]
& H'=\sum_{a\in[m]}\lambda'_a\cdot E_a,\\[1mm]
\forall A_1,A_2\in\mathcal A, &
\left|\widetilde{\operatorname{tr}}\big(A_1A_2(H'\rho-\rho H')\big)\right|^2\le\varepsilon_0^2,\\[1mm]
\forall B_1,B_2\in\mathcal B, &
\left|\widetilde{\operatorname{tr}}\big(B_2q_{C_{K,d}\beta,\ell_0}(-\beta H'\mid B_1)\rho\big)-\widetilde{\operatorname{tr}}(B_1B_2\rho)\right|^2\le\varepsilon^2.
\end{array}
\right.
\tag{16}
$$

其中 $q$ 是 Definition 4.4 中的多项式，并使用 Definition 3.6 扩展到对易子。采用这组参数时，由 Theorem 4.5，

$$
\deg(q_{C_{K,d}\beta,\ell_0})
\le
2\cdot 4^{C_{K,d}\beta}\log(1/\varepsilon)+1,
\tag{17}
$$

并且

$$
q_{C_{K,d}\beta,\ell_0}
\text{ 是一个 }
\left(0.001\cdot2^{C_{K,d}\beta}\log(1/\varepsilon),\frac5{C_{K,d}\beta},0.001\varepsilon\right)
\text{-平坦指数近似。}
\tag{18}
$$

**表示多项式系统。** 理解上述系统如何作为 $\lambda'$ 中具有实系数且大小关于 $m$ 多项式的多项式系统表示很重要。关键是，我们可以把迹中的表达式写成

$$
\left(\sum_\alpha \alpha(\lambda')M_\alpha\right)\rho
$$

的形式，其中 $\alpha$ 遍历低次数单项式，而 $M_\alpha$ 是重标化 Pauli 矩阵，可以被显式且简洁地表示。然后，由 $\widetilde{\operatorname{tr}}$ 的线性性，可以通过代入对 $\widetilde{\operatorname{tr}}(M_\alpha\rho)$ 的估计写出该系统。例如，对第一个约束，可以写成

$$
\widetilde{\operatorname{tr}}(A_1A_2(H'\rho-\rho H'))
=
\widetilde{\operatorname{tr}}((A_1A_2H'-H'A_1A_2)\rho)
$$

$$
=
\sum_a\lambda'_a\left(
\widetilde{\operatorname{tr}}(A_1A_2E_a\rho)-\widetilde{\operatorname{tr}}(E_aA_1A_2\rho)
\right).
$$

随后可代入由 Lemma 5.2 得到的估计 $\widetilde{\operatorname{tr}}(A_1A_2E_a\rho)$ 和 $\widetilde{\operatorname{tr}}(E_aA_1A_2\rho)$。这些迹估计可能是复值的，因此

$$
\widetilde{\operatorname{tr}}(A_1A_2E_a\rho)-\widetilde{\operatorname{tr}}(E_aA_1A_2\rho)=\psi_a+i\chi_a
$$

对某些 $\psi_a,\chi_a\in\mathbb R$ 成立。可以把它改写为

$$
\left|\sum_a\lambda'_a(\chi_a+i\psi_a)\right|^2\le\varepsilon_0^2
\Longleftrightarrow
\left(\sum_a\lambda'_a\chi_a\right)^2+
\left(\sum_a\lambda'_a\psi_a\right)^2
\le\varepsilon_0^2,
$$

从而显示这是一个 $\lambda'$ 中具有实系数的多项式约束。对第二个约束，$q_{C_{K,d}\beta,\ell_0}(-\beta H'\mid B_1)$ 是嵌套对易子

$$
[E_{a_\ell},[E_{a_{\ell-1}},[\ldots[E_{a_1},B_1]]]]
$$

的线性组合，其中

$$
\ell\le2\cdot4^{C_{K,d}\beta}\log(1/\varepsilon)+1.
$$

因此由 Lemma 2.10，这样的对易子是 $\mathcal A$ 中的一个元素。与该嵌套对易子相关的系数是

$$
(-\beta)^\ell\lambda'_{a_\ell}\cdots\lambda'_{a_1},
$$

所以对某些多项式 $p_A(\lambda')$，可以写为

$$
\widetilde{\operatorname{tr}}\big(B_2q_{C_{K,d}\beta,\ell_0}(-\beta H'\mid B_1)\rho\big)
=
\sum_{A\in\mathcal A}p_A(\lambda')\widetilde{\operatorname{tr}}(B_2A\rho).
$$

和以前一样，可以代入 $\widetilde{\operatorname{tr}}$ 的估计，因此这个表达式是良定义的。进一步可得，相关约束可以写成 $\lambda'$ 中具有实系数的多项式约束。回忆 $|\mathcal A|\le m(1/\varepsilon)^{10C_{K,d}\beta}$。此外，由 Lemma 2.19，所有 $p_A$ 中出现的 $\lambda'$ 的不同单项式至多有

$$
m(10d)^{4C_{K,d}\beta\ell_0}\le m(1/\varepsilon)^{10C_{K,d}\beta}
$$

个，因此整个表示的大小为 $\operatorname{poly}(m,1/\varepsilon)$。

**Algorithm 6.2（从 Gibbs 态学习哈密顿量，Theorem 6.1）。**

**输入：** $K$-local 哈密顿量项 $\{E_a\}_{a\in[m]}$ 的描述，其对偶相互作用图度为 $d$；精度和失败概率参数 $\varepsilon,\delta\in(0,1)$；逆温度 $\beta>0$；未知哈密顿量

$$
H=\sum_a\lambda_aE_a
$$

的 Gibbs 态

$$
\rho=\frac{\exp(-\beta H)}{\operatorname{tr}\exp(-\beta H)}
$$

的

$$
(m^6/\varepsilon^{e^{f(K,d)\beta}})\log(m/\delta)
$$

份拷贝。

**操作：**

1. 设

$$
\varepsilon_0=\frac{\varepsilon^{10 C_{K,d}\beta}}{m^3},
$$

其中 $C_{K,d}$ 是只依赖于 $K,d$ 的足够大常数；

2. 设

$$
\ell_0=2C_{K,d}\beta\log(1/\varepsilon),
\qquad
\ell_1=4K;
$$

3. 定义

$$
\mathcal A=\mathcal P_{\ell_0}^{4C_{K,d}\beta},
\qquad
\mathcal B=\mathcal P_{\ell_1};
$$

4. 对所有 $A_1,A_2,A_3\in\mathcal A$，使用 Lemma 5.2 计算 $\operatorname{tr}(A_1A_2A_3\rho)$ 的估计 $\widetilde{\operatorname{tr}}(A_1A_2A_3\rho)$，误差为 $\varepsilon_0$；

5. 考虑约束系统

$$
\mathcal C_{\lambda'}=
\left\{
\begin{array}{ll}
\forall a\in[m], & -1\le\lambda'_a\le1,\\[1mm]
& H'=\sum_{a\in[m]}\lambda'_a\cdot E_a,\\[1mm]
\forall A_1,A_2\in\mathcal A, &
\left|\widetilde{\operatorname{tr}}\big(A_1A_2(H'\rho-\rho H')\big)\right|^2\le\varepsilon_0^2,\\[1mm]
\forall B_1,B_2\in\mathcal B, &
\left|\widetilde{\operatorname{tr}}\big(B_2q_{C_{K,d}\beta,\ell_0}(-\beta H'\mid B_1)\rho\big)-\widetilde{\operatorname{tr}}(B_1B_2\rho)\right|^2\le\varepsilon^2.
\end{array}
\right.
$$

6. 计算一个与 $\mathcal C_{\lambda'}$ 一致的次数为 $O(2^{C_{K,d}\beta}\ell_0)$ 的伪分布 $\mu$；

7. 设

$$
\hat\lambda=\widetilde{\mathbb E}_\mu[\lambda'].
$$

**输出：** $\hat\lambda$，使得以至少 $1-\delta$ 的概率，对所有 $a\in[m]$，有 $|\hat\lambda_a-\lambda_a|^2\le\varepsilon^2$。

**分析多项式系统。** 现在我们已经描述了算法主体（Algorithm 6.2）。为了得到 Theorem 6.1，我们证明以下中间引理。根据 Lemma 5.2，可以假设所有估计均以高概率准确到 $\varepsilon_0$。

**Assumption 6.3（测量 Gibbs 态）。** 对所有 $A_1,A_2,A_3\in\mathcal A$，我们的估计满足

$$
\left|\widetilde{\operatorname{tr}}(A_1A_2A_3\rho)-\operatorname{tr}(A_1A_2A_3\rho)\right|\le\varepsilon_0.
$$

第一个引理说明，当我们的估计准确时，真实系数，即 $\lambda'=\lambda$，是该系统的一个可行解。

**Lemma 6.4（约束系统的可行性）。** 如果 Assumption 6.3 成立，则当 $\lambda'=\lambda$，从而 $H'=H$ 时，Equation (16) 中系统 $\mathcal C_{\lambda'}$ 的约束被满足。

接着，需要证明可靠性。可靠性证明分为两个关键步骤。首先，我们证明系统的任意解都必须使

$$
H'=\sum_a\lambda'_aE_a
$$

与 $H$ 近似对易。

**Remark 6.5（关于平方和证明次数）。** 我们所有的平方和证明次数都将是

$$
\log(1/\varepsilon)2^{f(K,d)\beta}.
$$

为简洁起见，我们在后续陈述中省略精确次数。

**Lemma 6.6（SoS 找到一个近似对易态）。** 假设 Assumption 6.3 成立。令

$$
H'=\sum_a\lambda'_aE_a
$$

并写

$$
i[H,H']=\sum \gamma_bF_b,
$$

其中 $F_b$ 是某些 $2K$-$G$-local 项，而每个 $\gamma_b$ 都是 $\lambda'_a$ 的线性表达式；这样的表示由 Lemma 2.10 存在。则

$$
\{\mathcal C_{\lambda'}\}\vdash_{\lambda'}
\left\{
-e^{O_{K,d}(\beta)}m^{1.5}\sqrt{\varepsilon_0}
\le
\gamma_b
\le
 e^{O_{K,d}(\beta)}m^{1.5}\sqrt{\varepsilon_0}
\right\}.
$$

利用上述引理，可以在平方和证明系统中推出每个参数的可识别性。

**Lemma 6.7（可识别性的平方和证明）。** 假设 Assumption 6.3 成立。给定约束系统 $\mathcal C_{\lambda'}$，对任意项 $a^*\in[m]$，有

$$
\{\mathcal C_{\lambda'}\}\vdash_{\lambda'}
\left\{(\lambda_{a^*}-\lambda'_{a^*})^2\le 2^{C_{K,d}\beta}\varepsilon\right\}.
$$

合并上述引理后，我们几乎可以证明 Theorem 6.1。我们先说明如何立即得到相同学习保证和相同样本复杂度，但运行时间稍差。随后在 Section 10 中说明如何改进运行时间并完成更强的 Theorem 6.1 的证明。

**Theorem 6.8（Theorem 6.1 的较弱版本）。** 令

$$
H=\sum_{a=1}^{m}\lambda_aE_a\in\mathbb C^{N\times N}
$$

为 $n$ 个量子比特上的 $K$-local 哈密顿量，其对偶相互作用图的度为 $d$（如 Problem 1）。假设给定各项 $\{E_a\}_{a\in[m]}$、$\varepsilon>0$、$\delta>0$，以及在已知逆温度

$$
\beta>(10(d+1))^{-10}
$$

下的 Gibbs 态 $\rho$ 的拷贝。则存在一个算法，能够输出估计 $\tilde\lambda_a$，使得以概率至少 $1-\delta$，对所有 $a\in[m]$ 都有

$$
(\hat\lambda_a-\lambda_a)^2\le\varepsilon^2.
$$

该算法使用

$$
O\left((m^6/\varepsilon^{e^{f(K,d)\beta}})\log(m/\delta)\right)
$$

份 Gibbs 态拷贝，运行时间为

$$
(m/\varepsilon)^{\log(1/\varepsilon)\cdot\exp(f(K,d)\cdot\beta)},
$$

其中 $f(K,d)$ 是只依赖于 $K$ 和 $d$ 的正函数。

**Theorem 6.8 的证明。** 给定

$$
O\left((m^6/\varepsilon^{e^{f(K,d)\beta}})\log(m/\delta)\right)
$$

份 Gibbs 态 $\rho$，由 Lemma 5.2 可知，以至少 $1-\delta$ 的概率，Assumption 6.3 成立。条件化在这一事件上，由 Lemma 6.4 得到约束系统 $\mathcal C_{\lambda'}$ 可行。给定次数

$$
t=\Omega(2^{C_{K,d}\beta}\log(1/\varepsilon))
$$

的伪分布 $\mu$，其中 $C_{K,d}$ 是只依赖于 $K,d$ 的固定通用常数，由 Lemma 6.7（并适当把 $\varepsilon$ 重新定义为 $(\varepsilon/2^{C_{K,d}\beta})^2$）可得，对所有 $a\in[m]$，

$$
\left(\lambda_{a^*}-\widetilde{\mathbb E}_\mu[\lambda'_{a^*}]\right)^2
\le
\widetilde{\mathbb E}_\mu\left[(\lambda_{a^*}-\lambda'_{a^*})^2\right]
\le \varepsilon^2.
$$

运行时间由计算一个 $m$ 个未定元、以及

$$
|\mathcal A|+|\mathcal B|\le m^{O(1)}(1/\varepsilon)^{\exp(O(C_{K,d}\beta))}
$$

个约束上的次数 $t$ 伪分布主导。由 Theorem 2.28 可知，总运行时间至多为

$$
(m/\varepsilon)^{\log(1/\varepsilon)\exp(O(C_{K,d}\beta))},
$$

从而完成证明。

# 7 可行性证明（Lemma 6.4）

本节目标是证明 Lemma 6.4。由于我们处理的是真实哈密顿量 $H$，所以可以放松要求，因为证明不必位于平方和系统中。

**Lemma 7.1（对易子的可行性）。** 对所有矩阵 $A$ 和 $K$-local 哈密顿量

$$
H=\sum_{a\in[m]}\lambda_aH_a,
$$

若对所有 $a\in[m]$ 有 $|\lambda_a|\le1$，则

$$
\operatorname{tr}(A(H\rho-\rho H))=0.
$$

**证明。** 按假设，$|\lambda_a|\le1$。接着，由于 $H$ 与 $\rho$ 对易，对所有 $A$，

$$
\operatorname{tr}(A(H\rho-\rho H))=0.
$$

接着，考虑 $\operatorname{tr}(B_2q(-\beta H\mid B_1)\rho)$，其中 $q$ 是对指数函数 $e^x$ 的一个良好平坦近似（回忆 Definition 4.1）。这些量为什么近似于 $\operatorname{tr}(B_1B_2\rho)$，直觉如下：不失一般性地在 $H$ 的对角基中工作，令其本征值为 $\sigma_i$，则

$$
\operatorname{tr}((B_2q(-\beta H\mid B_1)-B_1B_2)\rho)
=
\operatorname{tr}\!\left((B_2(B_1\circ\{q(-\beta(\sigma_i-\sigma_j))\}_{ij})-B_1B_2)\rho\right)
$$

$$
\approx
\operatorname{tr}\!\left((B_2(B_1\circ\{e^{-\beta(\sigma_i-\sigma_j)}\}_{ij})-B_1B_2)\rho\right)
$$

$$
=
\operatorname{tr}((B_2\rho B_1\rho^{-1}-B_1B_2)\rho)
=
\operatorname{tr}(B_2\rho B_1-B_1B_2\rho)=0,
$$

其中第二个等号使用了 $q$ 是 $e^x$ 的良好近似。现在我们给出指数近似器可行性的形式化推导。在下面的引理中，我们精确化上述直觉，说明当 $q$ 是足够好的平坦指数近似时，上述推导确实在小误差内成立。

**Lemma 7.2（多项式近似的可行性）。** 对 $A,B\in\mathcal P_K$、$K$-local 且相互作用度为 $d$ 的哈密顿量 $H$、温度 $\beta$，以及一个 $(\kappa,\eta,\varepsilon)$-平坦指数近似多项式 $q$，如果

- $\kappa\ge C\beta\log(1/\varepsilon)$，其中 $C$ 是只依赖于 $K,d$ 的足够大常数；
- $\eta<c/\beta$，其中 $c$ 是只依赖于 $K,d$ 的足够小常数，

则

$$
|\operatorname{tr}(Bq(-\beta H\mid A)\rho)-\operatorname{tr}(AB\rho)|
\le20\varepsilon\|A\|\|B\|.
$$

**证明。** 在 $H$ 对角的基中工作，即 $H_{ii}=\sigma_i$。

$$
\operatorname{tr}(B\cdot q(-\beta H\mid A)\cdot\rho)-\operatorname{tr}(AB\rho)
=
\operatorname{tr}(B\cdot q(-\beta H\mid A)\cdot\rho)-\operatorname{tr}(B\rho A)
$$

$$
=
\frac1{\operatorname{tr}e^{-\beta H}}
\sum_{i,j=1}^{N}
\left(B_{ji}[q(-\beta H\mid A)]_{ij}e^{-\beta\sigma_j}-B_{ji}A_{ij}e^{-\beta\sigma_i}\right)
$$

$$
=
\frac1{\operatorname{tr}e^{-\beta H}}
\sum_{i,j=1}^{N}
\left(B_{ji}A_{ij}q(\beta(\sigma_j-\sigma_i))e^{-\beta\sigma_j}-B_{ji}A_{ij}e^{-\beta\sigma_i}\right)
$$

$$
=
\frac1{\operatorname{tr}e^{-\beta H}}
\sum_{i,j=1}^{N}B_{ji}A_{ij}
\left(q(\beta(\sigma_j-\sigma_i))-e^{\beta(\sigma_j-\sigma_i)}\right)e^{-\beta\sigma_j}.
\tag{19}
$$

第一个等号来自迹的循环性，第二个使用定义，第三个使用 Definition 3.2，第四个把相关项合并。现在利用关于 $q$ 已证明的近似性质来控制上述量。令 $L=\kappa/(3\beta)$，并令

$$
S_a=\{i\in[N]:\sigma_i\in[aL,(a+1)L)\},
$$

使得

$$
[N]=\bigsqcup_{a=-\infty}^{\infty}S_a.
$$

于是

$$
\frac1{\operatorname{tr}e^{-\beta H}}
\sum_{i,j=1}^{N}B_{ji}A_{ij}
\left(q(\beta(\sigma_j-\sigma_i))-e^{\beta(\sigma_j-\sigma_i)}\right)e^{-\beta\sigma_j}
$$

$$
=
\sum_{a,b}\frac1{\operatorname{tr}e^{-\beta H}}
\sum_{i\in S_a}\sum_{j\in S_b}
B_{ji}A_{ij}
\left(q(\beta(\sigma_j-\sigma_i))-e^{\beta(\sigma_j-\sigma_i)}\right)e^{-\beta\sigma_j}
$$

$$
=
\sum_{\alpha}\frac1{\operatorname{tr}e^{-\beta H}}
\sum_a\sum_{i\in S_a}\sum_{j\in S_{a+\alpha}}
B_{ji}A_{ij}
\left(q(\beta(\sigma_j-\sigma_i))-e^{\beta(\sigma_j-\sigma_i)}\right)e^{-\beta\sigma_j}.
\tag{20}
$$

现在，我们按 $\alpha$ 的取值分情形控制 (20) 中的项。对 $-2\le\alpha\le2$，因为 $3\beta L\le\kappa$，由 Definition 4.1 可知

$$
\left|q(\beta(\sigma_j-\sigma_i))-e^{\beta(\sigma_i-\sigma_j)}\right|
\le \varepsilon.
$$

因此

$$
\sum_{i\in S_a}\sum_{j\in S_{a+\alpha}}
B_{ji}A_{ij}
\left(q(\beta(\sigma_j-\sigma_i))-e^{\beta(\sigma_j-\sigma_i)}\right)e^{-\beta\sigma_j}
$$

$$
\le
\varepsilon\max_{j\in S_{a+\alpha}}\left(\sum_{i\in S_a}|B_{ji}A_{ij}|\right)
\sum_{j\in S_{a+\alpha}}e^{-\beta\sigma_j}
$$

$$
\le
\varepsilon\max_{j\in S_{a+\alpha}}
\left(\sum_{i\in S_a}|B_{ji}|^2\sum_{i\in S_a}|A_{ij}|^2\right)^{1/2}
\sum_{j\in S_{a+\alpha}}e^{-\beta\sigma_j}
$$

$$
\le
\varepsilon\|A_{S_a,S_{a+\alpha}}\|\|B_{S_a,S_{a+\alpha}}\|
\sum_{j\in S_{a+\alpha}}e^{-\beta\sigma_j}.
\tag{21}
$$

这里 $A_{S_a,S_b}$ 表示在 $H$ 的本征基中由 $i\in S_a,j\in S_b$ 索引的 $A$ 的子矩阵，$B_{S_a,S_b}$ 类似定义。接着，对 $\alpha\ge3$，当 $j\in S_{a+\alpha}$、$i\in S_a$ 时有 $\sigma_j>\sigma_i$，因此

$$
\sum_{i\in S_a}\sum_{j\in S_{a+\alpha}}
B_{ji}A_{ij}
\left(q(\beta(\sigma_j-\sigma_i))-e^{\beta(\sigma_j-\sigma_i)}\right)e^{-\beta\sigma_j}
$$

$$
\le
\sum_{i\in S_a}\sum_{j\in S_{a+\alpha}}
|B_{ji}A_{ij}|
\left(q(\beta(\sigma_j-\sigma_i))e^{\beta(\sigma_i-\sigma_j)}-1\right)e^{-\beta\sigma_i}
$$

$$
\le
(1+e^{(\alpha+1)\eta\beta L})
\max_{i\in S_a}\left(\sum_{j\in S_{a+\alpha}}|B_{ji}A_{ij}|\right)
\sum_{i\in S_a}e^{-\beta\sigma_i}
$$

$$
\le
(1+e^{(\alpha+1)\eta\beta L})
\|A_{S_a,S_{a+\alpha}}\|\|B_{S_a,S_{a+\alpha}}\|
\sum_{i\in S_a}e^{-\beta\sigma_i}.
\tag{22}
$$

最后，对 $\alpha\le-3$，当 $j\in S_{a+\alpha}$、$i\in S_a$ 时有 $\sigma_j<\sigma_i$，因此

$$
\sum_{i\in S_a}\sum_{j\in S_{a+\alpha}}
B_{ji}A_{ij}
\left(q(\beta(\sigma_j-\sigma_i))-e^{\beta(\sigma_j-\sigma_i)}\right)e^{-\beta\sigma_j}
$$

$$
\le
\sum_{i\in S_a}\sum_{j\in S_{a+\alpha}}
|B_{ji}A_{ij}|(e^{-\beta\sigma_i}+e^{-\beta\sigma_j}e^{(|\alpha|+1)\eta\beta L})
$$

$$
\le
\|A_{S_a,S_{a+\alpha}}\|\|B_{S_a,S_{a+\alpha}}\|
\left(
\sum_{i\in S_a}e^{-\beta\sigma_i}
+e^{(|\alpha|+1)\eta\beta L}\sum_{j\in S_{a+\alpha}}e^{-\beta\sigma_j}
\right).
\tag{23}
$$

最后，由 Lemma 2.16，对某个只依赖于 $K,d$ 的绝对常数 $c$，

$$
\|A_{S_a,S_{a+\alpha}}\|\le2\|A\|e^{-c(|\alpha|-1)L},
\qquad
\|B_{S_a,S_{a+\alpha}}\|\le2\|B\|e^{-c(|\alpha|-1)L}.
$$

由于 $\eta$ 足够小，可以保证当 $|\alpha|\ge3$ 时，

$$
(|\alpha|+1)\eta\beta\le c(|\alpha|-1).
$$

因此，把 (21)、(22)、(23) 与上述界结合，得到

$$
\sum_{\alpha}\sum_a\sum_{i\in S_a}\sum_{j\in S_{a+\alpha}}
B_{ji}A_{ij}
\left(q(\beta(\sigma_j-\sigma_i))-e^{\beta(\sigma_j-\sigma_i)}\right)e^{-\beta\sigma_j}
$$

$$
\le
10\operatorname{tr}(e^{-\beta H})\|A\|\|B\|\left(
\varepsilon+
\sum_{\alpha,|\alpha|\ge3}(1+e^{(|\alpha|+1)\eta\beta L})e^{-2c(|\alpha|-1)L}
\right)
$$

$$
\le
10\operatorname{tr}(e^{-\beta H})\|A\|\|B\|
\left(\varepsilon+
\sum_{\alpha,|\alpha|\ge3}2e^{-c(|\alpha|-1)L}
\right)
$$

$$
\le
20\varepsilon\operatorname{tr}(e^{-\beta H})\|A\|\|B\|,
$$

其中最后一步使用 $L=\kappa/(3\beta)\ge C\log(1/\varepsilon)$，且 $C$ 是关于 $K,d$ 足够大的常数。将其代回开头的关系，得到

$$
|\operatorname{tr}(Bq(-\beta H\mid A)\rho)-\operatorname{tr}(AB\rho)|
\le20\varepsilon\|A\|\|B\|,
$$

如所需。

还需要一个中间引理，把 Assumption 6.3 中的采样误差与 SoS 程序中实际约束的误差联系起来。

**Lemma 7.3.** 假设 Assumption 6.3 成立。则对所有 $B_1,B_2\in\mathcal B$，

$$
|\widetilde{\operatorname{tr}}(B_1B_2\rho)-\operatorname{tr}(B_1B_2\rho)|\le0.1\varepsilon,
$$

$$
|\widetilde{\operatorname{tr}}(B_2q_{C_{K,d}\beta,\ell_0}(-\beta H\mid B_1)\rho)
-
\operatorname{tr}(B_2q_{C_{K,d}\beta,\ell_0}(-\beta H\mid B_1)\rho)|
\le0.1\varepsilon.
$$

**证明。** 显然，Assumption 6.3 蕴含对所有 $B_1,B_2$，

$$
|\widetilde{\operatorname{tr}}(B_1B_2\rho)-\operatorname{tr}(B_1B_2\rho)|\le0.1\varepsilon.
$$

接着，由 Lemma 2.18 和 Claim 4.11，可以把 $q_{C_{K,d}\beta,\ell_0}(-\beta H\mid B_1)$ 写成如下形式的线性组合：

$$
\sum_{A\in\mathcal A}c_AA,
$$

其中 $A\subset\mathcal P^{2C_{K,d}\beta+1}_{\ell_0K}$，且系数满足

$$
\sum_{A\in\mathcal A}|c_A|
\le
((1+\beta)d)^{2^{C_{K,d}\beta+5}\ell_0}.
$$

因此，在 Assumption 6.3 成立的事件上，有

$$
|\widetilde{\operatorname{tr}}(B_2q_{C_{K,d}\beta,\ell_0}(-\beta H\mid B_1)\rho)
-
\operatorname{tr}(B_2q_{C_{K,d}\beta,\ell_0}(-\beta H\mid B_1)\rho)|
\le0.1\varepsilon.
$$

现在可以完成 Lemma 6.4 的证明。

**Lemma 6.4 的证明。** 前四个约束由 Lemma 7.1 满足。剩下需要证明最后两个约束被满足。由 Theorem 4.5，并如 (18) 所述，多项式 $q_{C_{K,d}\beta,\ell_0}$ 是参数为

$$
\left(0.001\cdot2^{C_{K,d}\beta}\log(1/\varepsilon),\frac5{C_{K,d}\beta},0.001\varepsilon\right)
$$

的平坦指数近似。因此，由 Lemma 7.2，有

$$
|\operatorname{tr}(B_2q_{C_{K,d}\beta,\ell_0}(-\beta H\mid B_1)\rho)-\operatorname{tr}(B_1B_2\rho)|
\le0.1\varepsilon
$$

对所有 $B_1,B_2\in\mathcal B$ 成立。把上述结果与 Lemma 7.3 结合，立即推出所有约束均被满足。

# 8 对易子很小的平方和证明（Lemma 6.6）

本节证明 Lemma 6.6。我们只使用约束的一个子集，也就是涉及

$$
\widetilde{\operatorname{tr}}(A(H'\rho-\rho H'))
$$

的对易子约束来证明。该证明包含两部分。首先，我们证明这些约束蕴含

$$
\operatorname{tr}([H,H'](H'\rho-\rho H'))
$$

很小。然后，我们证明 $\operatorname{tr}([H,H'](H'\rho-\rho H'))$ 很小实际上蕴含 $[H,H']$ 必须很小。

**Lemma 8.1（迹内积有界）。** 在 Assumption 6.3 下，有

$$
\{\mathcal C_{\lambda'}\}\vdash_{\lambda'}
\left\{
\operatorname{tr}([H,H'](H'\rho-\rho H'))
\le
m^2(10K d)^5\varepsilon_0
\right\}.
$$

**证明。** 由 Lemma 2.10，可以写

$$
[H,H']=\sum_{F\in\mathcal P_{2K}} f_a(\lambda')F,
$$

其中每个 $f_a$ 都是 $\lambda'_1,\ldots,\lambda'_m$ 的线性函数。进一步有以下性质：

- 每个 $f_a$ 在至多 $d$ 项上系数非零；
- 每个 $f_a$ 的所有系数的绝对值至多为 $1$。

总共有至多 $m(10Kd)^2$ 个项 $F\in\mathcal P_{2K}$（回忆 Corollary 2.20）。对每个 $F\in\mathcal P_{2K}$，我们有约束

$$
-\varepsilon_0\le\widetilde{\operatorname{tr}}(F(H'\rho-\rho H'))\le\varepsilon_0.
$$

因此，对 $F$ 求和，得到

$$
\{\mathcal C_{\lambda'}\}\vdash_{\lambda'}
\left\{
\widetilde{\operatorname{tr}}([H,H'](H'\rho-\rho H'))
=
\widetilde{\operatorname{tr}}\left(\sum_{F\in\mathcal P_{2K}}f_a(\lambda')F(H'\rho-\rho H')\right)
\right.
$$

$$
\left.
\le
 d\sum_{F\in\mathcal P_{2K}}\widetilde{\operatorname{tr}}(F(H'\rho-\rho H'))
\le
m10^{2K}d^3\varepsilon_0
\right\}.
\tag{24}
$$

第一个不等式来自约束 $-1\le\lambda'_i\le1$ 以及每个 $f_a$ 至多有 $d$ 个非零项；第二个不等式来自 $F\in\mathcal P_{2K}$ 至多有 $m(10Kd)^2$ 项，并且相应迹至多为 $\varepsilon_0$，由约束给出。类似地可推出

$$
\{\mathcal C_{\lambda'}\}\vdash_{\lambda'}
\left\{
\widetilde{\operatorname{tr}}([H,H'](H'\rho-\rho H'))
\ge
-m10^{2K}d^3\varepsilon_0
\right\}.
\tag{25}
$$

接着，再把 $H$ 和 $H'$ 展开到 Pauli 基，有

$$
\vdash_{\lambda'}
\left\{
\operatorname{tr}([H,H'](H'\rho-\rho H'))
=
\sum_{F_1,F_2\in\mathcal P_{2K}}g_{F_1,F_2}(\lambda')\operatorname{tr}(F_1F_2\rho)
\right\},
\tag{26}
$$

其中 $g_{F_1,F_2}(\lambda')$ 是 $\lambda'$ 的二次函数，每个函数至多有 $d$ 个非零单项式，且系数在 $\pm2$ 之间。类似地，

$$
\vdash_{\lambda'}
\left\{
\widetilde{\operatorname{tr}}([H,H'](H'\rho-\rho H'))
=
\sum_{F_1,F_2\in\mathcal P_{2K}}g_{F_1,F_2}(\lambda')\widetilde{\operatorname{tr}}(F_1F_2\rho)
\right\}.
\tag{27}
$$

使用 Assumption 6.3 和约束 $-1\le\lambda'_i\le1$，有

$$
\{\mathcal C_{\lambda'}\}\vdash_{\lambda'}
\left\{
\operatorname{tr}([H,H'](H'\rho-\rho H'))
\le
\sum_{F_1,F_2\in\mathcal P_{2K}}g_{F_1,F_2}(\lambda')\widetilde{\operatorname{tr}}(F_1F_2\rho)
+
\varepsilon_0\sum_{F_1,F_2\in\mathcal P_{2K}}g_{F_1,F_2}(\lambda')
\right.
$$

$$
\left.
=
\widetilde{\operatorname{tr}}([H,H'](H'\rho-\rho H'))
+
\varepsilon_0\sum_{F_1,F_2\in\mathcal P_{2K}}g_{F_1,F_2}(\lambda')
\le
m^2(10Kd)^5\varepsilon_0
\right\}.
\tag{28}
$$

第一个不等式来自 (26)、(27) 和 Assumption 6.3；第二个来自 (24)，以及 $g$ 的系数在 $[-2,2]$ 之间、且 $F_1,F_2\in\mathcal P_{2K}$ 至多有 $m^2(10Kd)^4$ 项。类似地，使用 (25) 中的下界估计，得到

$$
\{\mathcal C_{\lambda'}\}\vdash_{\lambda'}
\left\{
\operatorname{tr}([H,H'](H'\rho-\rho H'))
\ge
-m^2(10Kd)^5\varepsilon_0
\right\},
\tag{29}
$$

从而完成证明。

接着进入证明的第二部分。首先证明下面的不等式，把 $\operatorname{tr}([H,H'](H'\rho-\rho H'))$ 与 $\operatorname{tr}((i[H',H])^2\rho)$ 联系起来。注意我们考虑表达式 $i[H',H]$，以保证该矩阵是 Hermitian，且 $\lambda'_i$ 的系数为实数。

**Lemma 8.2（在任意温度下给对易子下界）。** 给定 $0<\beta$，

$$
H'=\sum_{i\in[m]}\lambda'_iE_i,
\qquad
H=\sum_{i\in[m]}\lambda_iE_i,
\qquad
\rho=e^{-\beta H},
$$

则

$$
\vdash_{\lambda'}
\left\{
\frac{\beta}{1+2\beta\|H\|}\operatorname{tr}((i[H',H])^2\rho)
\le
\operatorname{tr}([H',H](H'\rho-\rho H'))
\right\}.
$$

**证明。** 考虑 $H$ 对角的基，并令其本征值为 $\sigma_i$。令 $Z=\operatorname{tr}(e^{-\beta H})$。则

$$
\vdash_{\lambda'}
\left\{
\operatorname{tr}([H',H](H'\rho-\rho H'))
=
\operatorname{tr}((H'H-HH')(H'\rho-\rho H'))
\right.
$$

$$
=
\frac1Z\operatorname{tr}\left((H'\circ\{\sigma_j-\sigma_i\}_{ij})(H'\circ\{e^{-\beta\sigma_j}-e^{-\beta\sigma_i}\}_{ij})\right)
$$

$$
=
\frac1Z\sum_{i,j}H'_{ij}H'_{ji}(\sigma_j-\sigma_i)(e^{-\beta\sigma_i}-e^{-\beta\sigma_j})
$$

$$
=
\frac1Z\sum_{i,j}|H'_{ij}|^2(\sigma_j-\sigma_i)(e^{-\beta\sigma_i}-e^{-\beta\sigma_j})
$$

$$
\left.
=
\frac1Z\sum_{i,j}|H'_{ij}|^2(\sigma_j-\sigma_i)(1-e^{-\beta(\sigma_j-\sigma_i)})e^{-\beta\sigma_i}
\right\}.
\tag{30}
$$

类似地，

$$
\vdash_{\lambda'}
\left\{
\operatorname{tr}((i[H',H])^2\rho)
=
\frac1Z\operatorname{tr}\left((H'\circ\{\sigma_j-\sigma_i\}_{ij})(H'\circ\{(\sigma_i-\sigma_j)e^{-\beta\sigma_j}\}_{ij})\right)
\right.
$$

$$
\left.
=
\frac1Z\sum_{i,j}|H'_{ij}|^2(\sigma_j-\sigma_i)^2e^{-\beta\sigma_i}
\right\}.
\tag{31}
$$

观察到因为 $e^x\ge1+x$，所以 $e^{-x}\le1/(1+x)$，并且

$$
x(1-e^{-\beta x})
\ge
|x|(1-e^{-\beta|x|})
\ge
\frac{\beta x^2}{1+|\beta x|}.
$$

将该不等式用于 $x=\sigma_j-\sigma_i$，这些在平方和证明系统中是常数，并代回 (30)，得到

$$
\vdash_{\lambda'}
\left\{
\operatorname{tr}([H',H](H'\rho-\rho H'))
=
\frac1Z\sum_{i,j}|H'_{ij}|^2(\sigma_j-\sigma_i)(1-e^{-\beta(\sigma_j-\sigma_i)})e^{-\beta\sigma_i}
\right.
$$

$$
\ge
\frac1Z\sum_{i,j}|H'_{ij}|^2(\sigma_j-\sigma_i)^2\frac{\beta}{1+|\beta||\sigma_j-\sigma_i|}e^{-\beta\sigma_i}
$$

$$
\left.
\ge
\frac{\beta}{1+2\beta\|H\|}
\frac1Z\sum_{i,j}|H'_{ij}|^2(\sigma_j-\sigma_i)^2e^{-\beta\sigma_i}
=
\frac{\beta}{1+2\beta\|H\|}\operatorname{tr}((i[H',H])^2\rho)
\right\}.
\tag{32}
$$

第二个不等式来自 $|\sigma_j-\sigma_i|\le2\|H\|$，最后一个等号来自 (31)。

**Lemma 8.3.** 令

$$
H'=\sum_{a=1}^{m}\lambda'_aE_a,
$$

并把

$$
i[H,H']=\sum_{b=1}^{|\mathcal P_{2K}|}\gamma_bF_b
$$

写成 $2K$-local Pauli 矩阵 $F_b$ 的线性组合，其中每个 $\gamma_b$ 都是 $\lambda'_a$ 的线性表达式。则对每个 $\gamma_b$，有

$$
\{\mathcal C_{\lambda'}\}\vdash_{\lambda'}
\left\{
\gamma_b^2\le e^{O_{K,d}(\beta)}\operatorname{tr}((i[H',H])^2\rho)
\right\}.
$$

**证明。** 注意 $i[H',H]$ 是 Hermitian 且是 $2K$-local 的。因此，由 Corollary 2.14，对 $\lambda'_i$ 的任意实值，不等式

$$
\gamma_b^2\le e^{O_{K,d}(\beta)}\operatorname{tr}((i[H',H])^2\rho)
$$

成立。现在，上式两边都是 $\lambda'_i$ 中的二次表达式，因此由 Fact 2.35，两边之差可以写成 $\lambda'_i$ 中线性函数平方之和。于是

$$
\{\mathcal C_{\lambda'}\}\vdash_{\lambda'}
\left\{
\gamma_b^2\le e^{O_{K,d}(\beta)}\operatorname{tr}((i[H',H])^2\rho)
\right\},
$$

如所需。

现在可以通过合并前面几个引理来完成 Lemma 6.6 的证明。

**Lemma 6.6 的证明。** 合并 Lemma 8.1、Lemma 8.2 和 Lemma 8.3，得到

$$
\{\mathcal C_{\lambda'}\}\vdash_{\lambda'}
\left\{
\gamma_b^2\le e^{O_{K,d}(\beta)}m^3\varepsilon_0
\right\},
$$

因为 $\|H\|\le m$，并且可以调整指数中的 $O_{K,d}(1)$ 来吸收其他因子。由 Fact 2.39 可得

$$
\{\gamma_b^2\le e^{O_{K,d}(\beta)}m^3\varepsilon_0\}\vdash_{\lambda'}
\left\{
-e^{O_{K,d}(\beta)}m^{1.5}\sqrt{\varepsilon_0}
\le\gamma_b\le
 e^{O_{K,d}(\beta)}m^{1.5}\sqrt{\varepsilon_0}
\right\},
$$

这正是所需陈述。

# 9 可识别性的平方和证明（Lemma 6.7）

本节证明 Lemma 6.7。在高层次上，我们将依赖 Section 4 中证明的 $q_{C_{K,d}\beta,\ell_0}$ 的性质。不过，由于我们处理的是对易子多项式，每一步都需要调用 Section 3 中多项式与对易子之间的转换。首先，关键的是 $H'$ 和 $H$ 近似对易，使得转换中出现的“误差”项，即 Theorem 3.9 右端的那些项，是小的。我们在下一小节中精确化这一点。

## 9.1 控制误差项：从多项式到嵌套对易子

我们从证明下面的引理开始。

**Lemma 9.1（控制类型 3 的交换对易子）。** 令 $S,T\in\{0,1\}^*$ 为长度至多 $\ell$ 的任意序列。令 $A\in\mathcal P_K$。则可以写成

$$
i^{|S|+|T|}\big[(H,H')_S,[[H',H],[(H,H')_T,A]]\big]
=
\sum_{G_c\in\mathcal P_{4(\ell+1)K}}\zeta_cG_c,
$$

其中 $\zeta_c$ 是 $\lambda'$ 中的多项式，项 $G_c$ 属于 $\mathcal P_{4(\ell+1)K}$，并且与 $A$ 的支撑的距离至多为 $4(\ell+1)K$。如果 Assumption 6.3 成立，则

$$
\{\mathcal C_{\lambda'}\}\vdash_{\lambda'}
\left\{
-(|S|+|T|+1)!(2d)^{4\ell}e^{O_{K,d}(\beta)}m^{1.5}\sqrt{\varepsilon_0}
\le\zeta_c
\right.
$$

$$
\left.
\le
(|S|+|T|+1)!(2d)^{4\ell}e^{O_{K,d}(\beta)}m^{1.5}\sqrt{\varepsilon_0}
\right\}.
$$

注意因子 $i^{|S|+|T|}$ 是为了让表达式 Hermitian，从而使 $\zeta_c$ 为实多项式。

**证明。** 可以写

$$
i[H,H']=\sum_b\gamma_bF_b,
$$

其中 $F_b\in\mathcal P_{2K}$，并且由 Lemma 6.6，

$$
\{\mathcal C_{\lambda'}\}\vdash_{\lambda'}
\left\{
-e^{O_{K,d}(\beta)}m^{1.5}\sqrt{\varepsilon_0}
\le\gamma_b\le
 e^{O_{K,d}(\beta)}m^{1.5}\sqrt{\varepsilon_0}
\right\}.
\tag{33}
$$

为记号方便，对索引 $j\in\{1,2,\ldots,|S|+|T|\}$，令 $\lambda_{a,[j]}$ 在拼接序列 $ST$ 的第 $j$ 个条目为 $0$ 时等于 $\lambda_a$，为 $1$ 时等于 $\lambda'_a$。现在可应用 Lemma 2.18，其中 $K\leftarrow2K$ 且 $d\leftarrow10d^2$，因为 $[H,H']$ 是 $2K$-local 的，得到

$$
i^{|S|+|T|}\big[(H,H')_S,[[H',H],[(H,H')_T,A]]\big]
$$

$$
=
2^{|S|+|T|+1}
\sum_{a_1,\ldots,a_{|S|+|T|},b}
 c_{a_1,\ldots,a_{|S|+|T|},b}
\left(\prod_{j\in[|S|+|T|]}\lambda_{a_j,[j]}\right)
\gamma_b
A_{a_1,\ldots,a_{|S|+|T|},b},
$$

其中 $c_{a_1,\ldots,a_{|S|+|T|},b}\in\{\pm1,\pm i\}$，求和项数至多为 $(|S|+|T|+1)!d^{2(|S|+|T|+1)}$，并且每个项

$$
A_{a_1,\ldots,a_{|S|+|T|},b}\in\mathcal P_{4(\ell+1)K}
$$

且与 $A$ 的支撑距离至多为 $4(\ell+1)K$。因此，可以把原对易子重写成

$$
\sum_{G_c\in\mathcal P_{4(\ell+1)K}}\zeta_cG_c,
$$

其中每个 $\zeta_c$ 都是变量 $\lambda'$ 中具有实系数的次数至多 $2\ell+2$ 的多项式，因为原对易子是 Hermitian 的。

由于我们有约束 $-1\le\lambda'_a\le1$ 和 (33)，并且也知道 $-1\le\lambda_a\le1$，对上述求和中所有项合并，得到

$$
\{\mathcal C_{\lambda'}\}\vdash_{\lambda'}^{2\ell+2}
\left\{
\zeta_C\le (|S|+|T|+1)!(2d)^{2(|S|+|T|+1)}e^{O_{K,d}(\beta)}m^{1.5}\sqrt{\varepsilon_0}
\right\}.
$$

下界可用类似方式得到。

**Lemma 9.2（控制类型 1 和类型 2 的交换对易子）。** 令 $S\in\{0,1\}^*$ 为长度至多 $\ell$ 的任意序列。令 $A\in\mathcal P_K$。则可以写成

$$
i^{|S|}[(H,H')_S,A]=\sum\zeta_cG_c,
$$

其中项 $G_c\in\mathcal P_{(\ell+1)K}$，且与 $A$ 的支撑距离至多为 $(\ell+1)K$。进一步地，

$$
\{\mathcal C_{\lambda'}\}\vdash_{\lambda'}^{2\ell+2}
\{ |\zeta_C|\le (|S|+1)!(4d)^\ell\}.
$$

注意 $i^{|S|}$ 保证表达式 Hermitian，从而 $\zeta_c$ 为实数。

**证明。** 证明与 Lemma 9.1 相同。我们完全不需要 Lemma 6.6，只需使用约束 $-1\le\lambda'_a\le1$ 以及事实 $-1\le\lambda_a\le1$ 来控制系数。

我们还需要下面的引理来控制采样误差的影响。它类似于 Lemma 7.3，但现在需要对所有潜在的 $\lambda'$ 选择强制成立。

**Lemma 9.3（估计期望接近真实期望）。** 在 Assumption 6.3 下，对所有 $B_1,B_2\in\mathcal B$，

$$
\{\mathcal C_{\lambda'}\}\vdash_{\lambda'}
\left\{
\left|\widetilde{\operatorname{tr}}(B_2q_{C_{K,d}\beta,\ell_0}(-\beta H'\mid B_1)\rho)
-
\operatorname{tr}(B_2q_{C_{K,d}\beta,\ell_0}(-\beta H'\mid B_1)\rho)
\right|^2
\le0.01\varepsilon^2
\right\}.
$$

**证明。** 由 Lemma 2.18 和 Claim 4.11，可以把 $q_{C_{K,d}\beta,\ell_0}(-\beta H'\mid B_1)$ 写成

$$
\sum_{A\in\mathcal A}c_AA
$$

形式的线性组合，其中 $A\subset\mathcal P_{\ell_0K}^{2C_{K,d}\beta+1}$，系数 $c_A$ 是 $\lambda'$ 中次数至多为 $q_{C_{K,d}\beta,\ell_0}$ 的多项式。进一步地，所有 $c_A$ 中所有系数的绝对值之和至多为

$$
((1+\beta)d)^{2^{C_{K,d}\beta+5}\ell_0}.
$$

于是可以写

$$
\widetilde{\operatorname{tr}}(B_2q_{C_{K,d}\beta,\ell_0}(-\beta H'\mid B_1)\rho)
-
\operatorname{tr}(B_2q_{C_{K,d}\beta,\ell_0}(-\beta H'\mid B_1)\rho)
$$

$$
=
\sum_{A\in\mathcal A}c_A\left(\widetilde{\operatorname{tr}}(B_2A\rho)-\operatorname{tr}(B_2A\rho)\right).
$$

因此，在 Assumption 6.3 成立的事件上，并使用约束 $-1\le\lambda'\le1$，得到所需界。

## 9.2 平方和中的局域边缘没有小质量

现在进入主证明。在高层次上，我们将证明，如果 $H,H'$ 相距很远，则在约束系统 $\{\mathcal C_{\lambda'}\}$ 中必定存在某些 $B_1,B_2$ 的选择作为“见证”，从而使约束被违反。我们把所需陈述拆分为一系列不等式。

首先，可以取约束的一个合适线性组合，推出下面的量必须很小。注意在下面表达式中，$B$ 和 $[H-H',B]+0.25[H-H',B]^3$ 扮演我们“见证”的角色。

**Lemma 9.4（嵌套对易子多项式在 SoS 中有界）。** 令 $q$ 表示多项式 $q_{C_{K,d}\beta,\ell_0}$。在 Assumption 6.3 下，对任意 $B\in\mathcal P_K$，有

$$
\{\mathcal C_{\lambda'}\}\vdash_{\lambda'}
\left\{
\operatorname{tr}\!\left(
([H-H',B]+0.25[H-H',B]^3)
(q(-\beta H'\mid B)-q(-\beta H\mid B))\rho
\right)
\le(2d)^{12}\varepsilon^2
\right\}.
$$

**证明。** 固定任意 $B\in\mathcal P_K$。由 Lemma 2.10，有

$$
\vdash_{\lambda'}
\left\{
 i([H-H',B]+0.25[H-H',B]^3)
=
\sum_{F_b\in\mathcal P_{4K}}\gamma_bF_b
\right\},
$$

其中 $\gamma_b$ 是未定元 $\lambda'_i$ 中具有实系数的次数为 $3$ 的多项式，因为该表达式是 Hermitian 的。由于 $-1\le\lambda_i\le1$，并且我们也有约束 $-1\le\lambda'_i\le1$，得到

$$
\{\mathcal C_{\lambda'}\}\vdash_{\lambda'}
\{- (2d)^3\le\gamma_b\le(2d)^3\}.
$$

此外，至多 $d^3$ 个 $\gamma_b$ 非零。回忆以下陈述：对所有 $B_1,B_2\in\mathcal B$，

$$
\{\mathcal C_{\lambda'}\}\vdash_{\lambda'}
\left\{
\left|\widetilde{\operatorname{tr}}(B_2q(-\beta H'\mid B_1)\rho)
-
\operatorname{tr}(B_2q(-\beta H'\mid B_1)\rho)\right|^2
\le0.01\varepsilon^2
\right\}
$$

（Lemma 9.3），

$$
\vdash_{\lambda'}
\left\{
\left|\widetilde{\operatorname{tr}}(B_2q(-\beta H\mid B_1)\rho)
-
\operatorname{tr}(B_2q(-\beta H\mid B_1)\rho)\right|^2
\le0.01\varepsilon^2
\right\}
$$

（Lemma 7.3），以及

$$
\vdash_{\lambda'}
\left\{
\left|\widetilde{\operatorname{tr}}(B_1B_2\rho)
-
\widetilde{\operatorname{tr}}(B_2q(-\beta H\mid B_1)\rho)\right|^2
\le\varepsilon^2
\right\}
$$

（Lemma 6.4）。

使用系统 $\mathcal C_{\lambda'}$ 中的最后一个约束和上述结果，推出

$$
\{\mathcal C_{\lambda'}\}\vdash_{\lambda'}
\left\{
\left|
\operatorname{tr}(B_2q_{C_{K,d}\beta,\ell_0}(-\beta H'\mid B_1)\rho)
-
\operatorname{tr}(B_2q_{C_{K,d}\beta,\ell_0}(-\beta H\mid B_1)\rho)
\right|^2
\le1.44\varepsilon^2
\right\}.
$$

现在在上式中代入 $B_1=B$ 和 $B_2=F_b$，然后取系数为 $\gamma_b$ 的线性组合。使用开头关于 $\gamma_b$ 的性质，得到

$$
\{\mathcal C_{\lambda'}\}\vdash_{\lambda'}
\left\{
\operatorname{tr}(([H-H',B]+0.25[H-H',B]^3)(q(-\beta H'\mid B)-q(\beta H\mid B))\rho)
\le(2d)^6\varepsilon
\right\},
$$

如所需。

另一方面，我们将使用 Theorem 4.6 中 $q_{C_{K,d}\beta,\ell_0}$ 的性质，说明上述左端表达式实际上被 $[H-H',B]$ 的某个函数从下界定。第一步是以下引理。

**Lemma 9.5（平方和中嵌套对易子的关键多项式恒等式）。** 令

$$
X(B)=
\operatorname{tr}\!\left(
([H-H',B]+0.25[H-H',B]^3)
(q_{C_{K,d}\beta,\ell_0}(-\beta H\mid B)-q_{C_{K,d}\beta,\ell_0}(-\beta H'\mid B))\rho
\right)
$$

$$
-
\frac1{2000}
\operatorname{tr}\!\left([H-H',B]^2p_{C_{K,d}\beta,\ell_0}(-\beta H\mid B)\rho\right).
$$

在 Assumption 6.3 下，对任意 $B\in\mathcal P_K$，有

$$
\{\mathcal C_{\lambda'}\}\vdash_{\lambda'}\{\operatorname{Re}(X(B))\ge-\varepsilon\},
$$

以及

$$
\{\mathcal C_{\lambda'}\}\vdash_{\lambda'}\{|\operatorname{Im}(X(B))|\le\varepsilon\}.
$$

**证明。** 由 Theorem 4.6，可以在两个形式变量 $x,y$ 中写出以下多项式等式：

$$
((x-y)+0.25(x-y)^3)(q_{C_{K,d}\beta,\ell_0}(x)-q_{C_{K,d}\beta,\ell_0}(y))
-
\frac1{2000}(x-y)^2p_{C_{K,d}\beta,\ell_0}(x)
=
\sum_{j=1}^{m}r_j(x,y)^2,
\tag{34}
$$

其中 $m\le10^{2C_{K,d}\beta}\ell_0$，每个多项式 $r_j$ 都是 $(2^{C_{K,d}\beta}\ell_0+10,200^{2C_{K,d}\beta}\ell_0)$-有界的。还要注意，因为 $H,H',B$ 都是 Hermitian 的，所以对任意多项式 $q$，

$$
\vdash_{\lambda'}
\{q(H,H'\mid B)^\dagger=q(-H,-H'\mid B)\}.
\tag{35}
$$

因此，可以应用 Theorem 3.9，写出如下形式恒等式：

$$
\vdash_{\lambda'}
\left\{
\operatorname{tr}\!\left(
([H-H',B]+0.25[H-H',B]^3)
(q_{C_{K,d}\beta,\ell_0}(-\beta H\mid B)-q_{C_{K,d}\beta,\ell_0}(-\beta H'\mid B))\rho
\right)
\right.
$$

$$
-
\frac1{2000}
\operatorname{tr}\!\left([H-H',B]^2p_{C_{K,d}\beta,\ell_0}(-\beta H\mid B)\rho\right)
$$

$$
\left.
=
\sum_{j=1}^{m}\operatorname{tr}(r_j(H,H'\mid B)r_j(H,H'\mid B)^\dagger\rho)+D
\right\},
\tag{36}
$$

其中 $D$ 是 Theorem 3.9 右端给出的四类项之和。由 Claim 4.11，原恒等式中的所有多项式都是 $(2^{C_{K,d}\beta+1}\ell_0,200^{2C_{K,d}\beta}\ell_0)$-有界的。因此，Theorem 3.9 结合对 $D$ 中每一项应用 Lemma 9.1 和 Lemma 9.2，给出

$$
\{\mathcal C_{\lambda'}\}\vdash_{\lambda'}
\{|\operatorname{Re}(D)|\le2^{4C_{K,d}\beta}\ell_0m^{1.5}\sqrt{\varepsilon_0}\},
$$

以及

$$
\{\mathcal C_{\lambda'}\}\vdash_{\lambda'}
\{|\operatorname{Im}(D)|\le2^{4C_{K,d}\beta}\ell_0m^{1.5}\sqrt{\varepsilon_0}\}.
$$

由定义，

$$
2^{4C_{K,d}\beta}\ell_0m^{1.5}\sqrt{\varepsilon_0}\le0.1\varepsilon.
$$

最后，还需注意

$$
\{\mathcal C_{\lambda'}\}\vdash_{\lambda'}
\left\{\operatorname{tr}(r_j(H,H'\mid B)r_j(H,H'\mid B)^\dagger\rho)\ge0\right\}.
$$

这是因为左端可重写为

$$
\|\rho^{1/2}r_j(H,H'\mid B)\|_F^2,
$$

它是矩阵 $\rho^{1/2}r_j(H,H'\mid B)$ 条目的实部和虚部平方之和。该矩阵的条目是 $\lambda'$ 中具有复系数的多项式。分离实部和虚部后，条目的实部和虚部都是 $\lambda'$ 中具有实系数的多项式。因此总体上，$\|\rho^{1/2}r_j(H,H'\mid B)\|_F^2$ 是 $\lambda'$ 中多项式的平方和。将所有内容与 (36) 合并，即完成证明。

接着，分析 Lemma 9.5 中减去的项

$$
\operatorname{tr}([H-H',B]^2p_{C_{K,d}\beta,\ell_0}(-\beta H\mid B)\rho).
$$

我们使用 $p_{C_{K,d}\beta,\ell_0}$ 是指数函数的良好近似这一性质，把它与一个更简单的表达式联系起来。

**Lemma 9.6（导数一致有下界）。** 定义

$$
Y(B)=
\operatorname{tr}([H-H',B]^2p_{C_{K,d}\beta,\ell_0}(-\beta H\mid B)\rho)
-
\operatorname{tr}((i[H-H',B])^2\rho).
$$

则对任意 $B\in\mathcal P_K$，

$$
\{\mathcal C_{\lambda'}\}\vdash_{\lambda'}
\{\operatorname{Re}(Y(B))\ge-(2d)^4\varepsilon\},
$$

以及

$$
\{\mathcal C_{\lambda'}\}\vdash_{\lambda'}
\{|\operatorname{Im}(Y(B))|\le(2d)^4\varepsilon\}.
$$

**证明。** 令

$$
Z(B)=
\operatorname{tr}([H-H',B]^2p_{C_{K,d}\beta,\ell_0}(-\beta H\mid B)\rho)
-
\operatorname{tr}(B[H-H',B]^2\rho).
$$

可以把

$$
[H-H',B]^2=\sum_{F_b\in\mathcal P_{3K}}\gamma_bF_b
$$

写成，其中 $\gamma_b$ 是 $\lambda'$ 中具有实系数的二次多项式，因为该表达式是 Hermitian 的。由于 $-1\le\lambda_i\le1$ 且我们有约束 $-1\le\lambda'_i\le1$，得到

$$
\{\mathcal C_{\lambda'}\}\vdash_{\lambda'}
\{-(2d)^2\le\gamma_b\le(2d)^2\}.
\tag{37}
$$

非零的 $\gamma_b$ 数量至多为 $2d^2$。现在由 Theorem 4.5，多项式 $p_{C_{K,d}\beta,\ell_0}$ 是参数为

$$
\left(0.001\cdot2^{C_{K,d}\beta}\log(1/\varepsilon),\frac5{C_{K,d}\beta},0.001\varepsilon\right)
$$

的弱指数近似，因此由 Lemma 7.2，对所有 $F\in\mathcal P_{3K}$，有

$$
|\operatorname{tr}(Fp_{C_{K,d}\beta,\ell_0}(-\beta H\mid B)\rho)-\operatorname{tr}(BF\rho)|\le0.1\varepsilon.
$$

注意上述只是一个数值不等式，不涉及 SoS 系统的任何变量。现在对所有 $F\in\mathcal P_{3K}$ 按分解

$$
[H-H',B]^2=\sum_{F_b\in\mathcal P_{3K}}\gamma_bF_b
$$

给出的系数取上述不等式的线性组合，并使用 (37)，得到

$$
\{\mathcal C_{\lambda'}\}\vdash_{\lambda'}
\{\operatorname{Re}(Z(B))\ge-d^4\varepsilon\},
$$

以及

$$
\{\mathcal C_{\lambda'}\}\vdash_{\lambda'}
\{|\operatorname{Im}(Z(B))|\le d^4\varepsilon\}.
\tag{38}
$$

接着注意

$$
Y(B)-Z(B)=\operatorname{tr}(B[H-H',B][\rho,H']).
$$

把 $B[H-H',B]$ 写成 $\mathcal P_{2K}$ 中元素的线性组合，并使用 $-1\le\lambda_a\le1$ 以及约束 $-1\le\lambda'_a\le1$，由 $\{\mathcal C_{\lambda'}\}$ 中的对易子约束得到

$$
\{\mathcal C_{\lambda'}\}\vdash_{\lambda'}
\{|\operatorname{Re}(Y(B)-Z(B))|\le\varepsilon\},
$$

以及

$$
\{\mathcal C_{\lambda'}\}\vdash_{\lambda'}
\{|\operatorname{Im}(Y(B)-Z(B))|\le\varepsilon\}.
$$

将其与 (38) 合并，证明完成。

**Lemma 9.7（$H-H'$ 没有小局域边缘）。** 固定 $B\in\mathcal P_K$。把

$$
i[H-H',B]=\sum_{F_b\in\mathcal P_{2K}}\gamma_bF_b
$$

写成 $2K$-local Pauli 矩阵 $F_b$ 的线性组合，其中每个 $\gamma_b$ 都是 $\lambda'$ 的线性表达式。则对每个 $\gamma_b$，有

$$
\{\mathcal C_{\lambda'}\}\vdash_{\lambda'}
\left\{
\gamma_b^2\le e^{O_{K,d}(\beta)}\operatorname{tr}((i[H-H',B])^2\rho)
\right\}.
$$

**证明。** 证明与 Lemma 8.3 的证明完全相同。

**Lemma 9.8（选择哈密顿量中的每个系数）。** 令

$$
X=\sum_{E_a\in\mathcal P_K}x_aE_a
$$

写成 $K$-local Pauli 矩阵的线性组合。则对任意 $E_a\ne I$，存在 $B\in\mathcal P_K$ 和 $P\in\mathcal P_{2K}$，其支撑与 $E_a$ 相交，并且

$$
\left(\frac12\operatorname{tr}(i[X,B]P)\right)^2=x_a^2.
$$

**证明。** 注意，对任意 $A_1,A_2,B\in\mathcal P_K$，如果 $[A_1,B]$、$[A_2,B]$ 均非零且 $A_1\ne A_2$，则

$$
[A_1,B]\ne[A_2,B].
$$

换言之，只要对易子非零，与固定 Pauli 矩阵取对易子就是单射。现在由于 $E_a\ne I$，显然可以选择一个与 $E_a$ 支撑相同的 $B\in\mathcal P_K$，使得 $[B,E_a]\ne0$。由 Lemma 2.10，可以把 $i[X,B]$ 写成 $2K$-local Pauli 矩阵的线性组合，并且 $i[B,E_a]/2$，它本身是一个 $2K$-local Pauli 矩阵，的系数为 $\pm2x_a$。因此，取 $P=i[B,E_a]/2$ 即给出所需等式。

现在可以完成 Lemma 6.7 的证明。

**Lemma 6.7 的证明。** 合并 Lemma 9.4、Lemma 9.5、Lemma 9.6，得到

$$
\{\mathcal C_{\lambda'}\}\vdash_{\lambda'}
\left\{
\operatorname{tr}((i[H-H',B])^2\rho)\le(10d)^6\varepsilon
\right\}.
$$

注意 $i[H-H',B]$ 是 Hermitian 的，因此左端表达式是 $\lambda'$ 中的实多项式。现在固定索引 $a$，分析 $\lambda_a-\lambda'_a$。由 Lemma 9.8，可以找到 $B\in\mathcal P_K$ 和 $F_b\in\mathcal P_{2K}$，使得在表示

$$
i[H-H',B]=\sum_{F_b\in\mathcal P_{2K}}\gamma_bF_b
$$

中，$F_b$ 的系数为 $\pm2(\lambda_a-\lambda'_a)$。于是 Lemma 9.7 蕴含

$$
\{\mathcal C_{\lambda'}\}\vdash_{\lambda'}
\left\{
(\lambda_a-\lambda'_a)^2\le2^{C_{K,d}\beta}\varepsilon
\right\},
$$

只要 $C_{K,d}$ 关于 $K,d$ 足够大。这完成证明。

# 10 一个更快的算法

现在完成 Theorem 6.1 的证明。获得更快运行时间的关键，是观察到前几节中所有平方和证明中实际只出现某个特定单项式族。下面形式化陈述这一关键观察。

**Definition 10.1（通过簇展开得到相关单项式）。** 称变量 $\lambda'$ 中的一个单项式，比如

$$
\lambda'_{a_1}\lambda'_{a_2}\cdots\lambda'_{a_c},
$$

是相关的，如果存在三个簇

$$
(E^{[i]}_{a_1},\ldots,E^{[i]}_{a_C})
\qquad i\in\{1,2,3\},
$$

其中 $E^{[i]}_{a_j}\in\mathcal P_K$，使得：

- $C\le10\cdot4^{C_{K,d}\beta}\log(1/\varepsilon)$；
- 作为无序多重集合，

$$
\{E_{a_1},\ldots,E_{a_c}\}
\subseteq
\bigcup_i\{E^{[i]}_{a_1},\ldots,E^{[i]}_{a_C}\}.
$$

用 $\mathcal L$ 表示 $\lambda'$ 中所有相关单项式的集合。

**Lemma 10.2.** 固定 $E_a\in\mathcal P_K$。则可以写

$$
2^{C_{K,d}\beta}\varepsilon-(\lambda_a-\lambda'_a)^2
=
\sum_i r_i(\lambda')^2\prod_{g\in S_i}g(\lambda'),
$$

其中 $r_i$ 是 $\lambda'$ 中的多项式，$S_i$ 是 $\{\mathcal C_{\lambda'}\}$ 中约束的子集，约束写成 $g(\lambda')\ge0$ 的形式。进一步地，每个约束乘积 $\prod_{g\in S_i}g(\lambda')$ 涉及：

- 至多一个对易子约束；
- 至多一个多项式近似约束；
- 约束 $\lambda_a+1\ge0$、$\lambda_a-1\le0$ 的一个乘积，其中出现的 $\lambda_a$ 形成一个相关单项式。

**证明。** 这来自检查 Section 8 和 Section 9.2 中的证明，并使用 Lemma 2.18 来刻画每当展开 $H$ 和 $H'$ 中的嵌套对易子时出现的所有单项式。注意，可以保证集合 $S_i$ 中相乘的所有约束互不相同，因为如果某个约束被乘了两次，就得到形如 $g(\lambda')^2$ 的项，此时可以把它并入 $r_i(\lambda')^2$ 中。

现在使用 Lemma 2.19，可以计数相关单项式的总数。

**Lemma 10.3.** 不同相关单项式的总数至多为

$$
m\cdot(1/\varepsilon)^{10C_{K,d}\beta}.
$$

**证明。** 这直接来自 Lemma 2.19。

最后，我们有如下来自 Steurer 和 Tiegel [ST21] 的定理，它允许我们以只依赖于证明中出现的单项式数量的运行时间求解平方和系统。

**Theorem 10.4（通过线性化降次数 [ST21]）。** 令 $p:\mathbb R^n\to\mathbb R$ 为次数至多为 $t$ 的多变量多项式。假设存在一个多项式不等式系统

$$
\mathcal A=\{q_1\ge0,\ldots,q_m\ge0\},
$$

使得

$$
\mathcal A\vdash_x^t\{p(x)\ge0\},
$$

并进一步假设该证明可以写成如下形式：

$$
\sum_i r_i(x)^2\prod_{j\in S_i}q_j(x),
$$

其中 $S_i\subseteq[m]$，并且不同集合 $S_i$ 的数量至多为 $M$。还假设 $p(x)$ 中出现的不同单项式数量至多为 $N$。则可以在 $x$ 和一些额外辅助变量中写出一个多项式系统 $\mathcal A'$，使得：

- 只要 $\mathcal A$ 可行，$\mathcal A'$ 也可行；
- $\mathcal A'\vdash\{p(x)\ge0\}$；

并且可以在时间

$$
O(m+M+(tN)^3)
$$

内计算一个满足 $\mathcal A'$ 的伪期望。

**Theorem 6.1 的证明。** 证明与 Theorem 6.8 的证明完全相同，只是使用 Lemma 10.3 和 Lemma 10.2 来控制最终平方和证明的复杂度，并使用 Theorem 10.4 在运行时间

$$
\operatorname{poly}(m,\log(1/\delta),(1/\varepsilon)^{2^{f(K,d)\beta}})
$$

内求解平方和系统。

# 致谢

AB 受到 Ankur Moitra 的 ONR 资助和 NSF TRIPODS 项目（award DMS-2022448）支持。AM 部分受到 Microsoft Trustworthy AI Grant、一项 ONR 资助和 David and Lucile Packard Fellowship 支持。ET 受到 NSF GRFP（DGE-1762114）以及 University of California Berkeley 的 Miller Institute for Basic Research in Science 支持。

# A Theorem 2.13 的证明

回忆 Theorem 2.13 中的设定。我们有一个 $K$-local 哈密顿量 $H$，其对偶相互作用图 $G$ 的最大度为 $d$；还有

$$
A=\sum_b\sigma_bP_b,
$$

一个 $K'$-local 算子，其中 $P_b$ 是 Pauli 矩阵乘积，$-1\le\sigma_b\le1$，并且其对偶相互作用图最大度为 $d'$。对 $\beta>0$，$\rho$ 是 $H$ 的相应 Gibbs 态。我们希望证明 $\langle A^2\rangle$ 的下界：

$$
\langle A^2\rangle=\operatorname{tr}(A^2\rho)
\ge
\max_{i\in[n]}\left(c\operatorname{tr}(A_{(i)}^2/N)\right)^{6+c'\beta}.
$$

**Remark A.1.** [AAKS20, Theorem 33] 证明，对准局域算子，

$$
\langle A^2\rangle=\operatorname{tr}(A^2\rho)
\ge
\max_{i\in\Lambda}\operatorname{tr}(A_{(i)}^2/N)^{\beta^{\Omega(1)}}.
$$

## A.1 重新证明引理

首先，我们证明这个量受局域酉操作“保护”，意思是当对 $A$ 施加局域酉操作时，它不会变化太多。AAKS 中这件事的工作方式如下。有两个声明：Claim 37 和 Claim 38。Claim 37 只对局域算子使用 AKL，而 Claim 38 对准局域算子使用 AKL，并依赖 Claim 37。

**Lemma A.2 ([AAKS20, Claim 37]).** 令 $U$ 是支撑在 $S\subset[n]$ 上的酉算子。则对任意满足 $\|M\|\le1$ 的 $M$，

$$
\langle(U^\dagger MU)^2\rangle
\le
\widetilde O\left(
(d+1)K|S|\left(4e^{2|S|/K}\right)^{\frac{2(d+1)K\beta}{1+2(d+1)K\beta}}
\langle M^2\rangle^{\frac1{1+2(d+1)K\beta}}
\right).
$$

把 $d$ 和 $K$ 看作常数，并适当选择 $c,c'$，该不等式变为

$$
\langle(U^\dagger MU)^2\rangle
\le
 e^{c|S|}\langle M^2\rangle^{\frac1{1+c'\beta}}.
$$

$\widetilde O(\cdot)$ 被吸收到 $c,c'$ 的取值中。

**证明。** 证明概览如下。我们想要控制 $U$ 对表达式 $\operatorname{tr}(UM^2U\rho)$ 的影响，因此可以在 $H$ 的本征基中考虑它。非对角部分由 Corollary 2.16 控制，其中取 $g=d+1$ 和 $R=(d+1)|S|$：

$$
\|\Pi^{(H)}_{[\sigma+\Delta,\infty]}U\Pi^{(H)}_{[-\infty,\sigma]}\|
\le
\|U\|e^{-\frac1{4(d+1)K}(\Delta-4(d+1)|S|)}
=
 e^{-\frac{\Delta}{4(d+1)K}}e^{|S|/K}.
\tag{39}
$$

我们把表达式分成对角部分和非对角部分：

$$
\langle(U^\dagger MU)^2\rangle
=\operatorname{tr}((U^\dagger MU)^2\rho)
=
\sum_i\operatorname{tr}((U^\dagger MU)^2\Pi^{(H)}_{[i,i+1)}\rho)
$$

$$
=
\sum_i\|U^\dagger MU\Pi^{(H)}_{[i,i+1)}\sqrt\rho\|_F^2
=
\sum_i\|MU\Pi^{(H)}_{[i,i+1)}\sqrt\rho\|_F^2
$$

$$
=
\sum_i\|M(\Pi^{(H)}_{(-\infty,i-\Delta)}+\Pi^{(H)}_{[i-\Delta,i+1+\Delta)}+\Pi^{(H)}_{[i+1+\Delta,\infty)})U\Pi^{(H)}_{[i,i+1)}\sqrt\rho\|_F^2
$$

$$
\le
2\sum_i\left(
\underbrace{\|M(\Pi^{(H)}_{(-\infty,i-\Delta)}+\Pi^{(H)}_{[i+1+\Delta,\infty)})U\Pi^{(H)}_{[i,i+1)}\sqrt\rho\|_F^2}_{(\mathrm{OFF}_i)}
+
\underbrace{\|M\Pi^{(H)}_{[i-\Delta,i+1+\Delta)}U\Pi^{(H)}_{[i,i+1)}\sqrt\rho\|_F^2}_{(\mathrm{ON}_i)}
\right).
$$

先控制 $(\mathrm{ON}_i)$：

$$
(\mathrm{ON}_i)
=
\|M\Pi^{(H)}_{[i-\Delta,i+1+\Delta)}U\Pi^{(H)}_{[i,i+1)}\sqrt\rho\|_F^2
$$

$$
=
\|M\Pi^{(H)}_{[i-\Delta,i+1+\Delta)}\|_F^2
\|U\Pi^{(H)}_{[i,i+1)}\sqrt\rho\|^2
\le
\|M\Pi^{(H)}_{[i-\Delta,i+1+\Delta)}\|_F^2e^{-\beta i}
$$

$$
\le
\|M\Pi^{(H)}_{[i-\Delta,i+1+\Delta)}\sqrt\rho\|_F^2e^{\beta\Delta}.
$$

接着控制 $(\mathrm{OFF}_i)$。这里使用 $\|M\|\le1$ 和 Eq. (39)：

$$
(\mathrm{OFF}_i)
=
\|M(\Pi^{(H)}_{(-\infty,i-\Delta)}+\Pi^{(H)}_{[i+1+\Delta,\infty)})U\Pi^{(H)}_{[i,i+1)}\sqrt\rho\|_F^2
$$

$$
\le
\|M\|^2
\|(\Pi^{(H)}_{(-\infty,i-\Delta)}+\Pi^{(H)}_{[i+1+\Delta,\infty)})U\Pi^{(H)}_{[i,i+1)}\|^2
\|\Pi^{(H)}_{[i,i+1)}\sqrt\rho\|_F^2
$$

$$
\le
2\left(e^{-\frac{\Delta}{4(d+1)K}}e^{|S|/K}\right)^2
\|\Pi^{(H)}_{[i,i+1)}\sqrt\rho\|_F^2
$$

$$
=
2e^{2|S|/K}e^{-\frac{\Delta}{2(d+1)K}}
\|\Pi^{(H)}_{[i,i+1)}\sqrt\rho\|_F^2.
$$

剩余项可以很好地求和：

$$
\langle(U^\dagger MU)^2\rangle
\le
2\sum_i((\mathrm{OFF}_i)+(\mathrm{ON}_i))
$$

$$
\le
2\sum_i\left(
2e^{2|S|/K}e^{-\frac{\Delta}{2(d+1)K}}\|\Pi^{(H)}_{[i,i+1)}\sqrt\rho\|_F^2
+
\|M\Pi^{(H)}_{[i-\Delta,i+1+\Delta)}\sqrt\rho\|_F^2e^{\beta\Delta}
\right)
$$

$$
=
4e^{2|S|/K}e^{-\frac{\Delta}{2(d+1)K}}\|\sqrt\rho\|_F^2
+(2\Delta+1)\|M\sqrt\rho\|_F^2e^{\beta\Delta}
$$

$$
=
4e^{2|S|/K}e^{-\frac{\Delta}{2(d+1)K}}
+(2\Delta+1)e^{\beta\Delta}\langle M^2\rangle
$$

$$
=
\langle M^2\rangle e^{\beta\Delta}
\left(
\frac{4e^{2|S|/K}}{\langle M^2\rangle}e^{-\Delta(\frac1{2(d+1)K}+\beta)}+2\Delta+1
\right).
$$

这对每个 $\Delta\ge0$ 都成立。选择

$$
\Delta=
\frac1{\frac1{2(d+1)K}+\beta}
\log\frac{4e^{2|S|/K}}{\langle M^2\rangle}.
$$

由于 $\langle M^2\rangle\le1$，$\Delta$ 确实非负。采用这个 $\Delta$，有

$$
\langle(U^\dagger MU)^2\rangle
\le
\langle M^2\rangle e^{\beta\Delta}(2\Delta+2)
$$

$$
=
\langle M^2\rangle(2\Delta+2)
\left(\frac{4e^{2|S|/K}}{\langle M^2\rangle}\right)^{\frac{\beta}{\frac1{2(d+1)K}+\beta}}
$$

$$
=(2\Delta+2)(4e^{2|S|/K})^{\frac{2(d+1)K\beta}{1+2(d+1)K\beta}}
\langle M^2\rangle^{\frac1{1+2(d+1)K\beta}}
$$

$$
=
\widetilde O\left(
(d+1)K|S|\left(4e^{2|S|/K}\right)^{\frac{2(d+1)K\beta}{1+2(d+1)K\beta}}
\langle M^2\rangle^{\frac1{1+2(d+1)K\beta}}
\right).
$$

最后一行中，我们小心地提出 $(d+1)K$ 和 $|S|$ 的因子，以处理 $|S|/K$ 和 $\beta$ 远小于一以及远大于一的区域。

**Lemma A.3 ([AAKS20, Claim 38 + Corollary 39]).** 令 $U$ 是支撑在 $S\subset[n]$ 上的酉算子，并令 $A$ 为前面定义的局域算子。则对所有 $\gamma>0$，

$$
\langle(U^\dagger AU)^2\rangle
\le
\gamma^2+e^{c|S|}
\left(
\langle\Pi^{(A)}_{(-\infty,-\gamma)\cup(\gamma,\infty)}\rangle^{\frac1{2(1+c'\beta)}}
+
\frac{\gamma+1}{\gamma^3}\langle A^2\rangle
\right),
$$

其中 $c,c'$ 是依赖于 $d,K,d',K'$ 的常数。

我们的最终目标是得到一个关于 $\langle A^2\rangle^{\Theta(1/(1+\beta))}$ 的上界；由于

$$
\langle\Pi^{(A)}_{(-\infty,-\gamma)\cup(\gamma,\infty)}\rangle
\le
\gamma^{-2}\langle A^2\rangle,
\tag{40}
$$

通过适当地设置 $\gamma$ 可以做到这一点。

**Remark A.4.** 原始结果对准局域算子证明了这一结果，而不是我们这里考虑的局域算子情形。他们得到

$$
\langle(U^\dagger AU)^2\rangle
\le
\gamma^2+\frac1\gamma e^{O(|S|)}
\langle\Pi^{(A)}_{(-\infty,-\gamma)\cup(\gamma,\infty)}\rangle^{O(1/\beta)}
+O(|S|^6\gamma^{-4}\langle A^2\rangle).
\tag{41}
$$

最后的 $1/\gamma^4$ 没有出现在陈述中，但在 [AAKS20, Eq. 121] 中产生。

**证明。** 全文中，$c$ 表示依赖于 $k,k',d,d'$ 的正常数。我们使用 Corollary 2.16 得到与 Eq. (39) 中相同的精确界，不过这次用于 $A$：

$$
\|\Pi^{(A)}_{[\sigma+\Delta,\infty]}U\Pi^{(A)}_{[-\infty,\sigma]}\|
\le
\|U\|e^{-\frac1{4(d'+1)K'}(\Delta-4(d'+1)|S|)}
=
 e^{-\frac{\Delta}{4(d'+1)K'}}e^{|S|/K'}.
\tag{42}
$$

我们基于 $A$ 的本征基把表达式分解成若干部分。令 $\gamma$ 为稍后选择的参数，并令

$$
\Pi_i^{(A)}=
\Pi^{(A)}_{[(-i-1)\gamma,-i\gamma)\cup[i\gamma,(i+1)\gamma)}.
$$

则

$$
\langle(U^\dagger AU)^2\rangle
=
\operatorname{tr}(U^\dagger A^2U\rho)
=
\sum_{i\ge0}\operatorname{tr}(U^\dagger A\Pi_i^{(A)}AU\rho)
$$

$$
\le
\sum_{i\ge0}(i+1)^2\gamma^2\operatorname{tr}(U^\dagger\Pi_i^{(A)}U\rho)
=
\sum_{i\ge0}(i+1)^2\gamma^2\|\Pi_i^{(A)}U\sqrt\rho\|_F^2
$$

$$
\le
\gamma^2+
\gamma^2\sum_{i\ge1}(i+1)^2
\left(
\sum_{j\ge0}\underbrace{\|\Pi_i^{(A)}U\Pi_j^{(A)}\sqrt\rho\|_F}_{(\mathrm{TERM}_i)}
\right)^2.
$$

由 Eq. (42)，可以推出

$$
\|\Pi_i^{(A)}U\Pi_j^{(A)}\sqrt\rho\|_F
\le
\|\Pi_i^{(A)}U\Pi_j^{(A)}\|\|\Pi_j^{(A)}\sqrt\rho\|_F
\le
16e^{-\frac{\gamma|j-i|}{4(d'+1)K'}}e^{|S|/K'}\|\Pi_j^{(A)}\sqrt\rho\|_F
\tag{43}
$$

$$
\le
 e^{-c_0\gamma|j-i|}e^{c_1|S|}\|\Pi_j^{(A)}\sqrt\rho\|_F.
\tag{44}
$$

我们不想产生对 $\|\Pi_0^{(A)}\sqrt\rho\|_F^2=\langle\Pi_0^{(A)}\rangle$ 的依赖。当 $j=0$ 时，可以使用 Lemma A.2 得到一个仍依赖于 $\langle I-\Pi_0^{(A)}\rangle$ 的界：

$$
\|\Pi_i^{(A)}U\Pi_0^{(A)}\sqrt\rho\|_F
\le
\|\Pi_i^{(A)}U\sqrt\rho\|_F
+
\|\Pi_i^{(A)}U(I-\Pi_0^{(A)})\sqrt\rho\|_F
$$

$$
\le
\sqrt{e^{c_2|S|}\langle\Pi_i^{(A)}\rangle^{\frac1{1+c_3\beta}}}
+
\|(I-\Pi_0^{(A)})\sqrt\rho\|_F
\le
 e^{c_2|S|/2}\langle I-\Pi_0^{(A)}\rangle^{\frac1{2(1+c_3\beta)}}.
\tag{45}
$$

有了这两个界后，可以控制 $(\mathrm{TERM}_i)$。使用 Eqs. (44) 和 (45)，得到

$$
(\mathrm{TERM}_i)=\sum_{j\ge0}\|\Pi_i^{(A)}U\Pi_j^{(A)}\sqrt\rho\|_F
$$

$$
\le
\|\Pi_i^{(A)}U\Pi_0^{(A)}\sqrt\rho\|_F+
\sum_{j\ge1}e^{-c_0\gamma|j-i|}e^{c_1|S|}\|\Pi_j^{(A)}\sqrt\rho\|_F
$$

由 Eq. (44)，

$$
\le
\sqrt{e^{c_2|S|}/2\langle I-\Pi_0^{(A)}\rangle^{\frac1{2(1+c_3\beta)}}}
 e^{-c_0\gamma|0-i|}e^{c_1|S|}\|\Pi_0^{(A)}\sqrt\rho\|_F
+
\sum_{j\ge1}e^{-c_0\gamma|j-i|}e^{c_1|S|}\|\Pi_j^{(A)}\sqrt\rho\|_F
$$

由 Eqs. (44) 和 (45)，

$$
\le
 e^{(c_1/2+c_2/4)|S|}\langle I-\Pi_0^{(A)}\rangle^{\frac1{4(1+c_3\beta)}}e^{-\frac{c_0}{2}\gamma i}
+
\sum_{j\ge1}e^{-c_0\gamma|j-i|}e^{c_1|S|}\|\Pi_j^{(A)}\sqrt\rho\|_F
$$

其中使用 $\|\Pi_0^{(A)}\sqrt\rho\|_F\le1$。

$$
\le
 e^{c_4|S|}
\left(
\langle I-\Pi_0^{(A)}\rangle^{\frac1{4(1+c_3\beta)}}e^{-\frac{c_0}{2}\gamma i}
+
\left(\sum_{j'\ge1}e^{-c_0\gamma|j'-i|}\right)^{1/2}
\left(\sum_{j\ge1}e^{-c_0\gamma|j-i|}\|\Pi_j^{(A)}\sqrt\rho\|_F^2\right)^{1/2}
\right)
$$

由 Cauchy-Schwarz，并取 $c_4=\max(c_1/2+c_2/4,c_1)$，

$$
\le
 e^{c_4|S|}
\left(
\langle I-\Pi_0^{(A)}\rangle^{\frac1{4(1+c_3\beta)}}e^{-\frac{c_0}{2}\gamma i}
+c_5\sqrt{1+\frac1\gamma}
\left(\sum_{j\ge1}e^{-c_0\gamma|j-i|}\|\Pi_j^{(A)}\sqrt\rho\|_F^2\right)^{1/2}
\right),
$$

适当选择 $c_5$。因此

$$
(\mathrm{TERM}_i)^2
\le
2e^{2c_4|S|}
\left(
\langle I-\Pi_0^{(A)}\rangle^{\frac1{2(1+c_3\beta)}}e^{-c_0\gamma i}
+c_5^2\left(1+\frac1\gamma\right)
\sum_{j\ge1}e^{-c_0\gamma|j-i|}\|\Pi_j^{(A)}\sqrt\rho\|_F^2
\right)
$$

$$
\le
 e^{c_6|S|}
\left(
\langle I-\Pi_0^{(A)}\rangle^{\frac1{2(1+c_3\beta)}}e^{-c_0\gamma i}
+
\left(1+\frac1\gamma\right)
\sum_{j\ge1}e^{-c_0\gamma|j-i|}\|\Pi_j^{(A)}\sqrt\rho\|_F^2
\right),
$$

适当选择 $c_6$。

回到我们最初想要控制的量，

$$
\langle(U^\dagger AU)^2\rangle
\le
\gamma^2+\gamma^2\sum_{i\ge1}(i+1)^2(\mathrm{TERM}_i)^2
$$

$$
\le
\gamma^2+
\gamma^2e^{c_6|S|}\sum_{i\ge1}(i+1)^2
\left(
\langle I-\Pi_0^{(A)}\rangle^{\frac1{2(1+c_3\beta)}}e^{-c_0\gamma i}
+
\left(1+\frac1\gamma\right)
\sum_{j\ge1}e^{-c_0\gamma|j-i|}\|\Pi_j^{(A)}\sqrt\rho\|_F^2
\right)
$$

$$
=
\gamma^2+
e^{c_6|S|}\langle I-\Pi_0^{(A)}\rangle^{\frac1{2(1+c_3\beta)}}
\sum_{i\ge1}\gamma^2(i+1)^2e^{-c_0\gamma i}
$$

$$
+
e^{c_6|S|}\frac{\gamma+1}{\gamma}
\sum_{j\ge1}j^2\|\Pi_j^{(A)}\sqrt\rho\|_F^2
\sum_{i\ge1}\gamma^2\left(\frac{i+1}{j}\right)^2e^{-c_0\gamma|j-i|}
$$

$$
\lesssim
\gamma^2+c_7e^{c_6|S|}\langle I-\Pi_0^{(A)}\rangle^{\frac1{2(1+c_3\beta)}}
+c_7e^{c_6|S|}\frac{\gamma+1}{\gamma}
\sum_{j\ge1}j^2\|\Pi_j^{(A)}\sqrt\rho\|_F^2,
$$

其中取 $c_7$ 使得对所有 $j$，$c_7\ge\sum_{i\ge1}\gamma^2(i+1)^2e^{-c_0\gamma|i-j|}$。于是

$$
=
\gamma^2+e^{c_8|S|}
\left(
\langle I-\Pi_0^{(A)}\rangle^{\frac1{2(1+c_3\beta)}}
+
\frac{\gamma+1}{\gamma^3}\langle A^2\rangle
\right),
$$

其中使用

$$
\sum_{j\ge1}(\gamma j)^2\|\Pi_j^{(A)}\sqrt\rho\|_F^2\le\langle A^2\rangle.
$$

## A.2 应用引理

**Lemma A.5 ([AAKS20, Claim 36]).** 存在一个支撑在 $\operatorname{supp}(A^{(i)})$ 上的酉算子 $U$，使得

$$
\operatorname{tr}(A_{(i)}^2/N)
\le
\operatorname{tr}((U^\dagger A^{(i)}U)^2\rho)
=
\langle(U^\dagger A^{(i)}U)^2\rangle.
$$

**证明。** 取 $U$ 为把 $A_{(i)}^2$ 的第 $a$ 大本征向量送到 $\operatorname{tr}_{[n]\setminus\operatorname{supp}(A^{(i)})}\rho$ 的第 $a$ 大本征向量的酉算子。

**Theorem 2.13 的证明。** 考虑 $A^{(i)}$，并令 $U_*$ 为 Lemma A.5 证明存在的酉算子。由于 $A^{(i)}$ 支撑在 $(d'+1)K'$ 个量子比特上（Eq. (6)），$U_*$ 也如此。

$$
\operatorname{tr}(A_{(i)}^2/N)
\le
\langle(U_*^\dagger A^{(i)}U_*)^2\rangle
$$

由 Lemma A.5，

$$
=
\|U_*^\dagger A^{(i)}U_*\sqrt\rho\|_F^2
$$

$$
=
\left\|U_*^\dagger\left(A-\int d\mu_i(U)U^\dagger AU\right)U_*\sqrt\rho\right\|_F^2
$$

$$
\le
2\|U_*^\dagger AU_*\sqrt\rho\|_F^2
+2\left(\int d\mu_i(U)\|U_*^\dagger U^\dagger A^{(i)}UU_*\sqrt\rho\|_F\right)^2
$$

$$
\le
4\gamma^2+4e^{c(d'+1)K'}
\left(
\langle\Pi^{(A)}_{(-\infty,-\gamma)\cup(\gamma,\infty)}\rangle^{\frac1{2(1+c'\beta)}}
+
\frac{\gamma+1}{\gamma^3}\langle A^2\rangle
\right)
$$

由 Lemma A.3，

$$
\le
4\gamma^2+4e^{c(d'+1)K'}
\left(
\gamma^{-\frac1{1+c'\beta}}\langle A^2\rangle^{\frac1{2(1+c'\beta)}}
+
\frac{\gamma+1}{\gamma^3}\langle A^2\rangle
\right)
$$

由 Eq. (40)。

令

$$
\gamma^2=\operatorname{tr}(A_{(i)}^2/N)/8
$$

并令

$$
c''=8e^{c(d'+1)K'}.
$$

则上式蕴含

$$
\operatorname{tr}(A_{(i)}^2/N)=8\gamma^2
\le
4\gamma^2+c''\left(
\gamma^{-\frac1{1+c'\beta}}\langle A^2\rangle^{\frac1{2(1+c'\beta)}}
+
\frac{\gamma+1}{\gamma^3}\langle A^2\rangle
\right),
$$

因此

$$
\frac4{c''}\gamma^2
\le
\gamma^{-\frac1{1+c'\beta}}\langle A^2\rangle^{\frac1{2(1+c'\beta)}}
+
\frac{\gamma+1}{\gamma^3}\langle A^2\rangle.
$$

所以，要么

$$
\frac2{c''}\gamma^2
\le
\gamma^{-\frac1{1+c'\beta}}\langle A^2\rangle^{\frac1{2(1+c'\beta)}},
$$

从而

$$
\left(\frac2{c''}\right)^{2(1+c'\beta)}
\gamma^{2+4(1+c'\beta)}
\le
\langle A^2\rangle,
\tag{46}
$$

或者

$$
\frac2{c''}\gamma^2
\le
\frac{\gamma+1}{\gamma^3}\langle A^2\rangle,
$$

从而

$$
c'''\gamma^5\le\langle A^2\rangle.
$$

上面使用了

$$
\gamma=\operatorname{tr}(A_{(i)}^2/N)/8\le(d+1)/8,
$$

因此可以把它吸收到常数中。Eq. (46) 给出我们的最终界。

# B Theorem 4.6 的证明

这里证明 Theorem 4.6。由于证明相当长且计算性较强，我们把它分成几个可管理的步骤。首先，证明偶数截断和奇数截断 $s_{2\ell-1}(x),s_{2\ell}(x)$ 可以如下联系起来。

**Lemma B.1（偶数截断有界）。** 对所有 $\ell\in\mathbb N$ 和所有 $x\in\mathbb R$，

$$
|s_{2\ell-1}(x)|<99s_{2\ell}(x).
$$

**证明。** 首先注意，当 $s_{2\ell-1}(x)\ge0$ 时，显然有 $s_{2\ell}(x)\ge|s_{2\ell-1}(x)|$，所需不等式清楚成立。因此，只需考虑 $s_{2\ell-1}(x)<0$ 的情形；这只有在 $x\le-0.1\ell$ 时发生。剩下需要证明当 $x\le-0.1\ell$ 时，

$$
s_{2\ell}(x)+\frac{s_{2\ell-1}(x)}{99}\ge0.
$$

令

$$
f(x)=0.99s_{2\ell}(x)+0.01s_{2\ell-1}(x)-e^x.
$$

注意 $f(0)=0$，且对 $k\le2\ell-1$，$f^{(k)}(0)=0$，并且

$$
f^{(2\ell)}(x)=0.99-e^x,
$$

其中 $f^{(k)}(x)$ 表示 $f$ 的第 $k$ 阶导数。现在可以使用微积分基本定理写出

$$
f(x)=\int_0^x f^{(2\ell)}(y)\frac{(x-y)^{2\ell-1}}{(2\ell-1)!}\,dy
=
\int_0^x(0.99-e^y)\frac{(x-y)^{2\ell-1}}{(2\ell-1)!}\,dy.
$$

重排上式为

$$
f(-x)=\int_0^x(0.99-e^{-y})\frac{(x-y)^{2\ell-1}}{(2\ell-1)!}\,dy.
$$

只需证明当 $x\ge0.1\ell$ 时 $f(-x)\ge0$，因为这时可得

$$
0.99s_{2\ell}(-x)+0.01s_{2\ell-1}(-x)\ge e^{-x}\ge0.
$$

现在分析上式右端的积分。我们有

$$
\int_0^x(0.99-e^{-y})(x-y)^{2\ell-1}\,dy
$$

$$
\ge
\int_{0.05}^{0.1}(x-y)^{2\ell-1}(0.99-e^{-y})\,dy
-
\int_0^{0.02}(e^{-y}-0.99)(x-y)^{2\ell-1}\,dy
$$

$$
\ge
0.0019(x-0.1)^{2\ell-1}-0.0002x^{2\ell-1}.
$$

而由于 $x\ge0.1\ell$，

$$
\frac{(x-0.1)^{2\ell-1}}{x^{2\ell-1}}
=
\left(1-\frac{0.1}{x}\right)^{2\ell-1}>
\frac19.
$$

因此推出 $f(-x)\ge0$，证明完成。

接着给出几个关于多项式的基本事实，使我们可以构造有界系数平方和表示。

**Claim B.2.** 令

$$
p(x)=a_nx^n+a_{n-1}x^{n-1}+\cdots+a_0
$$

为多项式。令 $C>0$ 是一个常数，使得对所有 $i\in[n]$，

$$
|a_i|\ge\frac{|a_{i-1}|}{C}.
$$

则 $p$ 的所有复根的模至多为 $2C$。

**证明。** 令 $z\in\mathbb C$ 满足 $|z|\ge2C$。则对所有 $i$，

$$
|a_iz^i|\le\frac{C^{n-i}}{|z|^{n-i}}|a_nz^n|\le\frac{|a_nz^n|}{2^{n-i}}.
$$

因此

$$
|a_nz^n|>|a_{n-1}z^{n-1}|+\cdots+|a_0|,
$$

所以不可能有

$$
p(z)=a_nz^n+a_{n-1}z^{n-1}+\cdots+a_0=0.
$$

因此 $z$ 不可能是 $p$ 的根。

作为直接推论，证明以下每个多项式都承认有界系数平方和分解。

**Corollary B.3（有界系数多项式）。** 令 $\ell$ 为正整数，并令 $-0.01\le c\le0.01$ 为实数。则多项式

$$
s_{2\ell}(x)+cs_{2\ell-1}(x)
$$

是变量 $x$ 中的一个 $(2\ell,\ell,10^\ell)$-有界 SoS 多项式（见 Definition 2.22）。

**证明。** 注意由 Claim B.2，$s_{2\ell}(x)+cs_{2\ell-1}(x)$ 的所有复根的模至多为 $5\ell$。而且由 Claim B.1，没有任何根是实根，因此由代数基本定理，它们成共轭对出现：$z_1,\bar z_1,\ldots,z_\ell,\bar z_\ell$。于是可以写成

$$
s_{2\ell}(x)+c s_{2\ell-1}(x)
=
\frac1{(2\ell)!}\prod_{j\in[\ell]}(x-z_j)(x-\bar z_j)
=
\frac1{(2\ell)!}\prod_{j\in[\ell]}((x-\operatorname{Re}(z_j))^2+\operatorname{Im}(z_j)^2).
\tag{47}
$$

现在展开上面的乘积，得到 $2^\ell$ 个次数至多为 $\ell$ 的多项式平方之和。现在控制它们每个的系数。对每个单项式 $x^k$，其系数绝对值至多为

$$
\binom{\ell}{k}(5\ell)^{\ell-k}\sqrt{(2\ell)!}
\le
\frac{\ell^k}{k!}\frac{(10\ell)^{\ell-k}}{\ell^\ell}
=
\frac{10^\ell}{k!}.
\tag{48}
$$

因此得到 $s_{2\ell}(x)+cs_{2\ell-1}(x)$ 是一个 $(2\ell,\ell,10^\ell)$-有界平方和多项式。

**Claim B.4.** 令 $p(x,y,t)$ 为一个多项式，使得对所有 $t\in[0,1]$，在代入实值 $t$ 后，它是变量 $x,y$ 中的一个 $(k,d,C)$-有界 SoS 多项式。则多项式

$$
r(x,y)=\int_0^1p(x,y,t)\,dt
$$

是变量 $x,y$ 中的一个 $(3d^2,d,\sqrt{k}C)$-有界 SoS 多项式。

**证明。** 对每个 $t\in[0,1]$，存在某些 $(d,C)$-有界多项式 $q_{1,t}(x,y),\ldots,q_{k,t}(x,y)$，使得

$$
p(x,y,t)=q_{1,t}(x,y)^2+\cdots+q_{k,t}(x,y)^2.
$$

令 $v(x,y)$ 为单项式向量

$$
v(x,y)=\left(1,x,y,\frac{x^2}{2!},\frac{xy}{2!},\frac{y^2}{2!},\ldots,\frac{x^d}{d!},\frac{x^{d-1}y}{d!},\ldots,\frac{y^d}{d!}\right).
$$

则可以把每个 $q_{i,t}$ 关联到一个向量 $u_{i,t}$，使得

$$
q_{i,t}(x,y)=v(x,y)^\top u_{i,t}.
$$

由于 $q_{i,t}$ 是 $(d,C)$-有界的，知道 $u_{i,t}$ 的所有条目至多为 $C$。定义矩阵

$$
M(t)=\sum_{i=1}^{k}u_{i,t}u_{i,t}^\top.
$$

则 $M(t)$ 是 PSD，且

$$
p(x,y,t)=v(x,y)^\top M(t)v(x,y).
$$

现在可以写

$$
r(x,y)=\int_0^1p(x,y,t)\,dt
=v(x,y)^\top\left(\int_0^1M(t)\,dt\right)v(x,y).
$$

我们知道

$$
R(t)=\int_0^1M(t)\,dt
$$

的所有条目至多为 $kC^2$，并且它是一个 $\binom{d+2}{2}\times\binom{d+2}{2}$ 的矩阵，因此可以写为

$$
R(t)=\sum_{i=1}^{\binom{d+2}{2}}u_iu_i^\top
$$

对某些条目至多为 $\sqrt{k}C$ 的向量 $u_i$ 成立。于是

$$
r(x,y)=\sum_{i=1}^{\binom{d+2}{2}}(v(x,y)^\top u_i)^2,
$$

并且每个 $v(x,y)^\top u_i$ 都是变量 $x,y$ 中的 $(d,\sqrt{k}C)$-有界多项式。因此，$r(x,y)$ 是一个 $(3d^2,d,\sqrt{k}C)$-有界平方和多项式，如所需。

现在转向 Theorem 4.6 的主证明。先给出以下基本恒等式。

**Fact B.5（积分恒等式）。** 对函数 $p:\mathbb R\to\mathbb R$，

$$
p(z+a)-p(z-a)=a\int_0^1(p'(z+ta)+p'(z-ta))\,dt,
$$

并且

$$
p(z+a)+p(z-a)=2p(z)+a\int_0^1(p'(z+ta)+p'(z-ta))\,dt.
$$

**证明。** 两个等式均立即来自微积分基本定理。

回忆我们需要证明的关键不等式如下。

**Lemma B.6（带有有界系数的修正梯度恒等式）。** 对所有正整数 $k,\ell$ 以及实数 $x,y$，

$$
0.5(x-y)(1+0.25(x-y)^2)(q_{k,\ell}(x)-q_{k,\ell}(y))
-0.00025(x-y)^2p_{k,\ell}(x)\ge0.
$$

进一步地，左端是变量 $x,y$ 中的一个 $(10^{2^k\ell},2^k\ell+10,200^{2^k\ell})$-有界 SoS 多项式。

首先证明下面的代数恒等式，它用于把 Lemma B.6 中的表达式重写成一种容易证明非负性的形式。

**Lemma B.7（把 $q$ 与一阶和二阶导数联系起来）。** 令 $k,\ell$ 为正整数。令

$$
r(x,y)=0.5(x-y)(1+0.25(x-y)^2)(q_{k,\ell}(x)-q_{k,\ell}(y))
-0.00025(x-y)^2(p_{k,\ell}(x)+p_{k,\ell}(y)).
$$

令

$$
z=\frac{x+y}{2},
\qquad
 a=\frac{x-y}{2}.
$$

有等式

$$
r(x,y)=
\underbrace{\int_0^1\left((0.998a^2+a^4)p_{k,\ell}(z+ta)-0.001a^3(2-t)p'_{k,\ell}(z+ta)\right)dt}_{(49).(1)}
$$

$$
+
\underbrace{\int_0^1\left((0.998a^2+a^4)p_{k,\ell}(z-ta)-0.001a^3(2-t)p'_{k,\ell}(z-ta)\right)dt}_{(49).(2)}.
\tag{49}
$$

**证明。** 回忆 $p_{k,\ell}$ 是 $q_{k,\ell}$ 的导数，可以写

$$
r(x,y)=(a+a^3)(q_{k,\ell}(z+a)-q_{k,\ell}(z-a))-0.001a^2(p_{k,\ell}(z+a)+p_{k,\ell}(z-a))
$$

$$
=(a^2+a^4)\int_0^1(p_{k,\ell}(z+ta)+p_{k,\ell}(z-ta))\,dt
-0.002a^2p_{k,\ell}(z)
-0.001a^3\int_0^1(p'_{k,\ell}(z+ta)-p'_{k,\ell}(z-ta))\,dt,
\tag{50}
$$

其中 $p'$ 是 $p$ 的导数，等式来自对 $q_{k,\ell}$ 和 $p_{k,\ell}$ 应用 Fact B.5。接着观察

$$
2p_{k,\ell}(z)=2\int_0^1p_{k,\ell}(z)\,dt
$$

$$
=2\int_0^1p_{k,\ell}(z)\,dt
-
\int_0^1(p_{k,\ell}(z+ta)+p_{k,\ell}(z-ta))\,dt
+
\int_0^1(p_{k,\ell}(z+ta)+p_{k,\ell}(z-ta))\,dt
$$

$$
=
\int_0^1(p_{k,\ell}(z+ta)-p_{k,\ell}(z))\,dt
-
\int_0^1(p_{k,\ell}(z)-p_{k,\ell}(z-ta))\,dt
+
\int_0^1(p_{k,\ell}(z+ta)+p_{k,\ell}(z-ta))\,dt
$$

$$
=
\int_0^1 a\left(\int_0^t(p'_{k,\ell}(z+sa)-p'_{k,\ell}(z-sa))\,ds\right)dt
+
\int_0^1(p_{k,\ell}(z+ta)+p_{k,\ell}(z-ta))\,dt.
\tag{51}
$$

把 $2p_{k,\ell}$ 的展开式代回 Equation (50)，得到

$$
r(x,y)=
(0.998a^2+a^4)\int_0^1(p_{k,\ell}(z+ta)+p_{k,\ell}(z-ta))\,dt
$$

$$
-0.001a^2\int_0^1a\left(\int_0^t(p'_{k,\ell}(z+sa)-p'_{k,\ell}(z-sa))\,ds\right)dt
-0.001a^3\int_0^1(p'_{k,\ell}(z+ta)-p'_{k,\ell}(z-ta))\,dt
$$

$$
=(0.998a^2+a^4)\int_0^1(p_{k,\ell}(z+ta)+p_{k,\ell}(z-ta))\,dt
$$

$$
-0.001a^3\int_0^1(1-s)(p'_{k,\ell}(z+sa)-p'_{k,\ell}(z-sa))\,ds
-0.001a^3\int_0^1(p'_{k,\ell}(z+ta)-p'_{k,\ell}(z-ta))\,dt
$$

$$
=(0.998a^2+a^4)\int_0^1(p_{k,\ell}(z+ta)+p_{k,\ell}(z-ta))\,dt
-0.001a^3\int_0^1(2-t)(p'_{k,\ell}(z+ta)-p'_{k,\ell}(z-ta))\,dt
$$

$$
=
\underbrace{\int_0^1\left((0.998a^2+a^4)p_{k,\ell}(z+ta)-0.001a^3(2-t)p'_{k,\ell}(z+ta)\right)dt}_{(49).(1)}
$$

$$
+
\underbrace{\int_0^1\left((0.998a^2+a^4)p_{k,\ell}(z-ta)-0.001a^3(2-t)p'_{k,\ell}(z-ta)\right)dt}_{(49).(2)}.
$$

其中第二个等号来自交换积分顺序，并观察到固定 $s$ 的系数就是 $1-s$。

基于 Lemma B.7，剩下要证明表达式 (49).(1) 和 (49).(2) 非负，并且可以写成变量 $x,y$ 中的有界 SoS 多项式。

**Lemma B.8.** 令

$$
z=\frac{x+y}{2},
\qquad
 a=\frac{x-y}{2}.
$$

则表达式 (49).(1) 和 (49).(2) 非负，并且可以写成变量 $x,y$ 中的 $(10\cdot(2^k\ell)^2,2^k\ell+10,150^{2^k\ell})$-有界 SoS 多项式。

**证明。** 我们聚焦于表达式 (49).(1)；对 (49).(2) 的论证完全相同。首先证明表达式 (49).(1) 非负。使用

$$
1+a^2=\frac{(1+a)^2+(1-a)^2}{2},
\qquad
 a=\frac{(1+a)^2-(1-a)^2}{4},
$$

有

$$
(49).(1)
=a^2\int_0^1\left((0.998+a^2)p_{k,\ell}(z+ta)-0.001a(2-t)p'_{k,\ell}(z+ta)\right)dt
$$

$$
=
a^2\int_0^1
\left(
\frac{(2-t)(1+a^2)}8p_{k,\ell}(z+ta)
-
\frac{0.001((1+a)^2-(1-a)^2)}4p'_{k,\ell}(z+ta)
\right)dt
$$

$$
+
a^2\int_0^1
\left(
(0.998+a^2)-\frac{(2-t)(1+a^2)}8
\right)p_{k,\ell}(z+ta)\,dt
$$

$$
=
a^2\int_0^1
\frac{(2-t)(1+a)^2}{16}\left(p_{k,\ell}(z+ta)-0.004p'_{k,\ell}(z+ta)\right)dt
$$

$$
+
a^2\int_0^1
\frac{(2-t)(1-a)^2}{16}\left(p_{k,\ell}(z+ta)+0.004p'_{k,\ell}(z+ta)\right)dt
$$

$$
+
a^2\int_0^1
\left(
(0.998+a^2)-\frac{(2-t)(1+a^2)}8
\right)p_{k,\ell}(z+ta)\,dt.
\tag{52}
$$

为了证明非负性，只需说明

$$
a_{k,\ell}(x)=p_{k,\ell}(x)-0.004p'_{k,\ell}(x)
$$

和

$$
b_{k,\ell}(x)=p_{k,\ell}(x)+0.004p'_{k,\ell}(x)
$$

对所有 $x\in\mathbb R$ 非负。回忆

$$
p_{k,\ell}(x)=\prod_{j\in[k]}s_{2^j\ell}(x/k).
$$

因此由乘积规则，

$$
p'_{k,\ell}(x)=
\sum_{j\in[k]}\frac{s'_{2^j\ell}(x/k)}{k}
\prod_{j'\ne j\in[k]}s_{2^{j'}\ell}(x/k)
$$

$$
=
\sum_{j\in[k]}\frac{s_{(2^j\ell)-1}(x/k)}{k}
\prod_{j'\ne j\in[k]}s_{2^{j'}\ell}(x/k).
$$

因此，

$$
a_{k,\ell}(x)=
\sum_{j\in[k]}
\left(s_{2^j\ell}(x/k)-\frac{0.004}{k}s_{(2^j\ell)-1}(x/k)\right)
\prod_{j'\ne j\in[k]}s_{2^{j'}\ell}(x/k)
\ge0,
\tag{53}
$$

因为对所有 $j\in[k]$，由 Corollary B.3，

$$
s_{2^j\ell}(x/k)-0.004s_{(2^j\ell)-1}(x/k)\ge0,
$$

且由 Corollary 4.9，$s_{2^{j'}\ell}(x/k)\ge0$。类似地，

$$
b_{k,\ell}(x)=
\sum_{j\in[k]}
\left(s_{2^j\ell}(x/k)+\frac{0.004}{k}s_{(2^j\ell)-1}(x/k)\right)
\prod_{j'\ne j\in[k]}s_{2^{j'}\ell}(x/k)
\ge0,
\tag{54}
$$

因为对所有 $j\in[k]$，由 Corollary B.3，

$$
s_{2^j\ell}(x/k)+0.004s_{(2^j\ell)-1}(x/k)\ge0.
$$

现在已经证明了表达式非负，接下来说明它是有界系数 SoS 多项式。由 Corollary B.3，多项式

$$
s_{2^j\ell}(x/k)\pm0.004s_{(2^j\ell)-1}(x/k),
\qquad
s_{2^j\ell}(x/k)
$$

全都是 $(2^{2j-1}\ell,2^{j-1}\ell,10^{2^{j-1}\ell})$-有界 SoS 多项式。因此，由 Claim 2.23，$a_{k,\ell}(x)$ 和 $b_{k,\ell}(x)$ 都是 $(k\cdot2^{2^k\ell},2^k\ell,90^{2^k\ell})$-有界 SoS 多项式。由于

$$
z+ta=\frac{1+t}{2}x+\frac{1-t}{2}y,
$$

再次由 Claim 2.23，对任意实数 $t\in[0,1]$，

$$
\frac{(2-t)(1+a)^2}{16}\left(p_{k,\ell}(z+ta)-0.004p'_{k,\ell}(z+ta)\right)
$$

在代入 $z=(x+y)/2$、$a=(x-y)/2$ 后，是变量 $x,y$ 中的一个 $(k\cdot2^{2^k\ell},2^k\ell,100^{2^k\ell})$-有界 SoS 多项式。对 (52) 中其他项可以作类似论证。然后使用 Claim B.4 控制对 $t$ 的积分，推出表达式 (49).(1) 是变量 $x,y$ 中的一个 $(10\cdot(2^k\ell)^2,2^k\ell+10,150^{2^k\ell})$-有界 SoS 多项式。

现在可以完成 Lemma B.6 的证明。

**Lemma B.6 的证明。** 注意 Lemma B.6 中的表达式等于

$$
r(x,y)+0.00025(x-y)^2p_{k,\ell}(y).
$$

现在由 $p_{k,\ell}$ 的定义、Corollary B.3 和 Claim 2.23，得到 $p_{k,\ell}(y)$ 是一个 $(2^{2^k\ell},2^k\ell,90^{2^k\ell})$-有界 SoS 多项式。Lemma B.8 和 Lemma B.7 蕴含 $r(x,y)$ 是一个

$$
(20\cdot(2^k\ell)^2,2^k\ell+10,150^{2^k\ell})
$$

-有界 SoS 多项式。因此整体上，

$$
r(x,y)+0.00025(x-y)^2p_{k,\ell}(y)
$$

是一个 $(10^{2^k\ell},2^k\ell+10,200^{2^k\ell})$-有界 SoS 多项式，从而也非负，证明完成。

最后，这完成了 Theorem 4.6 的证明。

**Theorem 4.6 的证明。** 所需结果立即由 Lemma B.6 推出。
