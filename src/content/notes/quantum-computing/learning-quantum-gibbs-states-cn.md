---
title: "局域且高效地学习量子 Gibbs 态"
description: "论文阅读笔记：Learning Quantum Gibbs States Locally and Efficiently（arXiv:2504.02706）。"
publishDate: 2026-05-16
updatedDate: 2026-05-16
tags:
  - quantum-computing
  - gibbs-state
  - hamiltonian-learning
  - paper-reading
category: "Quantum Computing"
type: "paper-note"
draft: false
---

# 局域且高效地学习量子 Gibbs 态

Chi-Fang Chen, Anurag Anshu, Quynh T. Nguyen

1. University of California, Berkeley, CA, USA  
2. Massachusetts Institute of Technology, Cambridge, USA  
3. School of Engineering and Applied Sciences, Harvard University

arXiv:2504.02706v1 [quant-ph] 2025 年 4 月 3 日

学习热平衡量子多体系统背后的哈密顿量，是量子学习理论和实验科学中的一个基础任务。为了在任意逆温度 $\beta$ 下学习局域哈密顿量的 Gibbs 态，目前最先进的可证明算法仍未达到最优样本复杂度和计算复杂度；这与经典情形中的局域性和简洁性形成鲜明对比。在本文中，我们提出一种学习算法，它能够把一个 $n$ 量子比特、$D$ 维哈密顿量的每一个局域项学习到加性误差 $\epsilon$，其样本复杂度为

$$
\widetilde O\!\left(\frac{e^{\mathrm{poly}(\beta)}}{\beta^2\epsilon^2}\right)\log(n).
$$

该协议使用可并行化的局域量子测量，这些测量只作用在格点的有界区域内，并且只需要近线性时间的经典后处理。因此，我们的复杂度关于 $n,\epsilon$ 是近最优的，并且关于 $\beta$ 是多项式紧的。我们还给出了一个用于有界相互作用度哈密顿量的学习算法，其样本复杂度和时间复杂度关于 $n$ 有类似的缩放，但关于 $\beta,\epsilon$ 的缩放更差。我们算法的核心是局域性、Kubo-Martin-Schwinger 条件以及任意温度下算子傅里叶变换之间的相互作用。

## 目录

I. 引言  
A. 协议与关键思想  
B. 先前工作  
C. 讨论与开放问题  
路线图  

II. 预备知识  
记号  
A. Gibbs 态与 KMS 内积  
B. 有界度相互作用图上的哈密顿量与格点上的哈密顿量  
C. 算子傅里叶变换  
D. 低温下算子傅里叶变换的正则化  

III. 可识别性方程  
A. 双 Bohr 频率分解  
B. 松弛一个局域对易子  
C. 正则化高频部分  
D. 局域对易子是忠实的  

IV. 学习协议  
A. 可识别性观测量 $Q$ 的鲁棒性  
B. 测试哈密顿量的可识别性：存在性与唯一性  
C. 测量可识别性观测量  
D. 用于任意连通性的哈密顿量的简单局域学习算法  
E. 用于 $D$ 维格点的高效高精度学习算法  

致谢  
参考文献  

附录 A. 标准测量成本  
1. $Q$ 的时间截断  

附录 B. Lieb-Robinson 估计  
1. Lemma III.5 的证明  
2. Lemma IV.1 的证明

---

# I. 引言

识别和检验支配粒子之间相互作用的物理定律，是量子多体物理中的一个基础追求。尽管自然界中的所有量子现象原则上都可以归约到基本粒子的标准模型，但为了做出有意义的预测，我们需要在相关尺度上给出有效描述。在量子力学的语言中，并假设自然具有局域性，局域哈密顿量提供了一个支配相关自由度的最小有效框架。恢复强相互作用系统的局域哈密顿量，常常导致物理学中的重大跃迁 [BCS57, Lau83]，并为高温超导体和量子信息处理平台等技术进展铺平道路。

随着计算机科学和物理科学之间的交汇日益加深，一个自然问题随之出现：寻找底层局域哈密顿量这一任务能否自动化，尤其是在量子计量协议变得更加可控且更加鲁棒时？近期对高效哈密顿量学习的追求正是刻画了这个目标，并且处于量子学习理论 [BAL19, AAKS20, RSF24, HKT22, HTFS23, BLMT24]、量子计算以及实验物理 [KvBE+21, OKK+25] 研究的前沿。

本文关注从热平衡中的量子系统学习其底层哈密顿量。特别地，我们考虑一个极简实验设置：不能访问实时间动力学，而只能访问静态可观测量。形式上，我们假设热平衡由未知局域哈密顿量 $H$ 在逆温度 $\beta$ 下的 Gibbs 态建模：

$$
\rho_\beta(H)=\frac{e^{-\beta H}}{\operatorname{Tr}(e^{-\beta H})}.
$$

那么，目标是在尽可能少地使用来自 $\rho_\beta(H)$ 的独立样本、并尽可能使用简单可观测量的情况下，输出一个与 $H$ 足够接近的哈密顿量 $H'$。实用、高效且简单的哈密顿量学习技术为实验场景中的其他应用打开了大门，尤其是验证量子设备，其中哈密顿量作为隐藏参数。

当前最先进的算法未达到最优样本复杂度和时间复杂度。工作 [AAKS20] 表明，从信息论角度看，Gibbs 态由所有少量量子比特可观测量的集合唯一确定。然而，从计算角度看，即使对于经典哈密顿量，从 Gibbs 边缘分布恢复哈密顿量通常也是不可处理的，即 NP-hard [Mon15]。近期令人印象深刻的工作 [BLMT24] 在任意常数温度下实现了多项式样本复杂度和计算复杂度。然而，其测量涉及相距很远的量子比特，随着温度降低，多项式指数会恶化，并且在相关区域内，例如把每个哈密顿量项学习到常数精度时，其样本复杂度与最优相差指数级。高温下已经知道可以达到最优样本复杂度和时间复杂度的算法 [HKT22]。然而，高温是一个强假设，并且我们并不总是具有改变样本有效温度的实验能力，例如自旋玻璃 [Pan12] 中升高温度可能很困难，或者纠缠哈密顿量 [KvBE+21] 中有效温度并不对应物理温度。其他启发式算法有较低的样本复杂度和时间复杂度，但没有严格保证 [BAL19, LBA+23]。

在任意温度下实现最优算法的中心概念瓶颈，是局域性在哈密顿量学习中的作用尚未确定：

**一个局域哈密顿量项是否应当由 Gibbs 态的邻域边缘态唯一识别？**

这个关于局域充分统计量的问题强化了 [AAKS20]，后者并没有排除这样一种可能性：为了学习某个给定局域项，可能需要所有边缘态。对于一个给定的局域项，局域统计量只在高温情形 [HKT22] 以及对易情形中已知是充分的。更广泛地说，设计真正局域的 Gibbs 学习算法之所以困难，还因为在一维之外，我们缺乏对量子 Gibbs 态中多体纠缠结构的理解。特别是在低温下，量子系统可能经历热相变，并表现出长程量子相关和经典相关。

在本文中，我们给出肯定回答，并设计了一个简单协议，通过逐个局域化测量学习各个项。我们从最直观的算法开始，该算法适用于相互作用图有有界度的哈密顿量，例如扩展图；形式化定义见 Section II B。对于下面的 Theorem I.1、Theorem I.2 以及全文，我们用 $O(\cdot)$ 表示在压制哈密顿量几何参数，也就是度 $d$、维数 $D$ 和局域性 $q$ 时的渐近上界；$\operatorname{Poly}(\cdot)$ 表示一个只依赖于 $q,d,D$ 的多项式。

**Theorem I.1（局域地学习每个局域项）。** 考虑一个目标局域哈密顿量

$$
H=\sum_{\gamma\in\Gamma}h_\gamma,
$$

其相互作用度为常数，见 Section II B，并且满足承诺

$$
h_\gamma=h_\gamma P_\gamma
\quad\text{for unknown coefficients } h_\gamma\in[-1,1],
$$

其中 $P_\gamma$ 是已知的常数权重 Pauli 算子。假设我们可以访问其在已知逆温度 $\beta>0$ 下的 Gibbs 态 $\rho_\beta$。那么，存在一个协议，以至少 $1-\delta$ 的成功概率，把每个系数 $h_\gamma$ 学习到加性误差 $\epsilon$，并具有

$$
\text{sample complexity }O\!\left(\log(n/\delta)\cdot 2^{\mathrm{poly}(1/\beta\epsilon)2^{O(\beta^4)}}\right)
$$

以及

$$
\text{time complexity }O\!\left(n\log(n/\delta)\cdot 2^{\mathrm{poly}(1/\beta\epsilon)2^{O(\beta^4)}}\right).
$$

显式算法和证明见 Section IV D。该断言是：只要给定图距离中半径为

$$
O\bigl(\beta^4+(\beta+1)\log(1/\epsilon)\bigr)
$$

且与系统大小无关的邻域边缘态，每个项就可以单独被学习。样本复杂度直接来自执行可并行化的局域测量，当 $\epsilon,\beta=\Theta(1)$ 时达到 $\log(n)$ 缩放。这里关于 $\epsilon$ 和 $\beta$ 的较差缩放，源自需要搜索该半径内所有可能的哈密顿量；在扩展图上，该半径内的体积可能很大。

在物理场景中，哈密顿量通常定义在 $D$ 维格点上；特别地，我们假设 $q=O(1),d=O(1)$，精确定义见 Section II B。进一步利用几何局域性，我们给出一个可证明高效的局域学习算法，并解决任意温度下 $D$ 维格点上的哈密顿量学习问题，算法和分析见 Section IV E。

**Theorem I.2（学习 $D$ 维哈密顿量）。** 考虑一个 $D$ 维哈密顿量

$$
H=\sum_{\gamma\in\Gamma}h_\gamma,
$$

见 Section II B，并且满足承诺

$$
h_\gamma=h_\gamma P_\gamma
\quad\text{for unknown coefficients }h_\gamma\in[-1,1],
$$

其中 $P_\gamma$ 是已知的常数权重 Pauli 算子。假设我们可以访问其在已知逆温度 $\beta>0$ 下的 Gibbs 态样本。那么，存在一个协议，以至少 $1-\delta$ 的成功概率，把每个系数 $h_\gamma$ 学习到加性误差 $\epsilon$，并具有

$$
\text{sample complexity }O\!\left(\log(n/\delta)\cdot \frac{e^{\operatorname{Poly}(\beta)}}{\beta^2\epsilon^2}\operatorname{Poly}\log(1/\epsilon)\right)
$$

以及

$$
\text{time complexity }O\!\left(n\log(n/\delta)\cdot \frac{e^{\operatorname{Poly}(\beta)}}{\beta^2\epsilon^2}\operatorname{Poly}\log(1/\epsilon)\right).
$$

由于 [HKT22, Theorem 1.2] 的下界

$$
\Omega\!\left(\frac{e^\beta}{\beta^2\epsilon^2}\log\frac{n}{\delta}\right),
$$

我们达到的复杂度关于量子比特数 $n$ 是最优的，关于精度 $\epsilon$ 是近最优的。该算法适用于所有温度，并且关于 $\beta$ 的依赖是多项式紧的。该协议的效率来自一种迭代过程：在每一轮中，它把当前猜测作为输入，执行一些测量，并提出一个精度翻倍的更好猜测。由于它同时更新多个系数，迭代协议并非显然局域。不过，如果我们追踪整个迭代中的信息流，那么单个项中的系数仍然基本上由半径 $\operatorname{Poly}(\log(1/\epsilon),\beta)$ 内的测量数据决定。

## A. 协议与关键思想

我们针对哈密顿量学习的局域方法，得益于近年来对 Gibbs 态动力学起源的理解进展，即量子 Gibbs 采样器 [TOV+11, YAG12, SM21, CB21, RWW23, WT23, CKBG23, CKG23, GCDK24, JI24, DCL24, DLL24]。虽然我们的算法并不显式实现 Lindblad 动力学，但我们大量依赖 [CKBG23, CKG23] 中引入的基础解析工具；这些工具提供了一种量子细致平衡的局域方法。

脚注 1：在本文中，$\epsilon$ 表示对哈密顿量项的 $\ell_\infty$ 学习。$\ell_2$ 学习的情形可以通过设定 $\epsilon=O(\epsilon_2/\sqrt n)$ 得到。

### 1. 从 KMS 条件得到局域充分统计量

**Kubo-Martin-Schwinger（KMS）条件。** 热平衡中的量子态对任意可观测量满足一种微观可逆性。量子统计力学中的 KMS 条件，是逆温度 $\beta$ 下热二点函数，也就是 Green 函数，所满足的恒等式：

$$
\operatorname{Tr}(O P_H(t)\rho)=\operatorname{Tr}(P_H(t+i\beta)O\rho)
$$

对每个 $P,O$ 和 $t\in\mathbb R$ 成立，其中

$$
P_H(z):=e^{iHz}P e^{-iHz}. \tag{1.1}
$$

为方便起见，我们简写 $\rho:=\rho_\beta(H)$。事实上，KMS 条件通过相关函数给出了 Gibbs 态的唯一刻画。为了看出这一点，考虑一个态 $\rho$，它对测试哈密顿量 $H'$ 满足 KMS 条件。于是，我们可以去掉变量 $O$ 上的量词，并记 $\rho'$ 为 $H'$ 的 Gibbs 态，从而推出

$$
(1.1)\Longleftrightarrow P_{H'}(t)\rho=\rho\rho'^{-1}P_{H'}(t)\rho'
\quad\text{for all }P\text{ and }t\in\mathbb R,
$$

$$
\Longleftrightarrow \rho\rho'^{-1}\propto I,
$$

$$
\Longleftrightarrow \beta H=\beta H'+cI. \tag{1.2}
$$

第二行使用了有界哈密顿量的 Gibbs 态可逆这一事实，以及与所有矩阵对易的算子必须正比于恒等算子这一事实。第三行使用了满秩半正定输入下矩阵对数的唯一性，并用 $cI$ 解释 Gibbs 态归一化带来的常数。这里，实时间参数 $t$ 在上述论证中不起作用；事实上，[BLMT24] 中的论证似乎只需要 KMS 条件的 $t=0$ 部分。一个自然问题是：局域 $O,P$ 的 KMS 条件是否会导出识别哈密顿量所需的局域充分统计量？

**可识别性方程。** 当然，上面精确的论证 (1.2) 是脆弱的；任何物理量都只能在统计误差范围内近似测量。第二个关键思想是通过如下可识别性方程给出一个鲁棒版本，见 Lemma III.1。该方程针对真实哈密顿量 $H$、测试哈密顿量 $H'$ 以及每一对局域算子 $A,O$ 定义：

$$
\frac{\beta}{2}\langle O,[A,H-H']\rangle_\rho
=\frac{1}{\sqrt{2\pi}}\int_{-\infty}^{\infty}
\operatorname{Tr}\!\left[
O_H^\dagger(t)\left(\sqrt{\rho'}A_{H'}(t)\sqrt{\rho'^{-1}}\rho
-\rho\sqrt{\rho'^{-1}}A_{H'}(t)\sqrt{\rho'}\right)\right]g_\beta(t)dt. \tag{1.3}
$$

其中

$$
\langle X,Y\rangle_\rho:=\operatorname{Tr}[X^\dagger\sqrt\rho\,Y\sqrt\rho]
$$

是 KMS 内积，$g_\beta(t)$ 是快速衰减函数。令

$$
O=[A,H-H'],
$$

则左端是一个非负量，并且当且仅当 $[A,H]=[A,H']$ 时消失，因此

$$
H=H'\Longleftrightarrow
\sqrt{\rho'}A_{H'}(t)\sqrt{\rho'^{-1}}\rho
=\rho\sqrt{\rho'^{-1}}A_{H'}(t)\sqrt{\rho'}
$$

对所有单点 Pauli $A$ 和 $t\in\mathbb R$ 成立。

这个可识别性方程让人联想到 KMS 条件，其中 $P:=\sqrt{\rho'}A\sqrt{\rho'^{-1}}$，但它进一步具有鲁棒性和局域性：只要在局域测量中报告右端很小，则在与 $A$ 取局域对易子时，$H$ 和 $H'$ 必须一致。有趣的是，可识别性方程 (1.3) 同时涉及两个不同哈密顿量的时间动力学，这使我们能够从 Equation 1.2 中滤出 $H,H'$ 的线性阶项。这需要对一对哈密顿量进行一种非传统的 Bohr 频率分解，见 Section III A。

仍然存在两个显著问题：

1. 虚时间演化算子 $\sqrt{\rho'^{-1}}A\sqrt{\rho'}$ 通常被认为是难处理的算子。本质上，在一维以上，局域算子 $A$ 可能具有不可忽略的振幅，量级为 $e^{-c\nu}$，并且会显著改变量级为 $\nu\gg1$ 的能量。因此，可能存在一个常数 $\beta$，使范数 $\|\sqrt{\rho'^{-1}}A\sqrt{\rho'}\|$ 随系统大小指数发散。特别地，在 $H'$ 的本征基中，$\sqrt{\rho'^{-1}}A\sqrt{\rho'}$ 的非对角项会指数爆炸，见 Figure 1，因此该算子没有局域近似 [Bou15]。

2. Equation (1.3) 右端中的算子 $O_H(t)$ 实际上依赖于未知哈密顿量 $H$；因此，先验上并不清楚如何在实验中直接测量该右端。

**问题 1 的解决方案。** 最近量子 Gibbs 采样器构造 [CKBG23, CKG23] 带来的洞见是：可以通过考虑频率 $\omega\in\mathbb R$ 处的算子傅里叶变换，在局域上施加量子细致平衡。该算子傅里叶变换同时在频率域和时间域局域化：

$$
\widehat A_{H'}(\omega)=\frac{1}{\sqrt{2\pi}}\int_{-\infty}^{\infty}A_{H'}(t)e^{-i\omega t}f(t)dt,
$$

其中 Gaussian 权重 $f(t)\propto e^{-t^2/\beta^2}$ 的时间不确定度为 $\beta$。算子傅里叶变换的一个优雅性质是，它在虚时间演化下表现良好，见 Figure 1：

$$
\sqrt{\rho'}\widehat A_{H'}(\omega)\sqrt{\rho'^{-1}}
=\widehat A_{H'}(\omega+4/\beta)e^{\beta\omega/2+1}.
$$

进一步地，算子傅里叶变换是实时间动力学 $A(t)$ 的线性组合，因此在频率空间中给出了 KMS 条件 (1.2) 的一种准局域刻画，亦见 Section II C：

$$
H=H'\Longleftrightarrow
\widehat A_{H'}(\omega-4/\beta)\rho
=\rho\widehat A_{H'}(\omega+4/\beta)e^{\beta\omega}
\quad\text{for each }\omega. \tag{1.4}
$$

关键的是，$\widehat A(\omega-4/\beta)$ 和 $\widehat A(\omega+4/\beta)$ 现在都是准局域可观测量。

为了把 Equation (1.4) 编织进 Equation (1.3)，我们遵循非常近期的工作 [CR]，见 Section II D。对于任意算子 $A$，我们可以手动地将其分裂成低频部分和高频部分：

$$
A=\sqrt{\frac{\beta}{2\sqrt{2\pi}}}
\left(\int_{|\omega'|\le \Omega'}+\int_{|\omega'|\ge \Omega'}\right)
\widehat A_{H'}(\omega')d\omega'.
$$

然后，我们可以截断高频部分，并希望只带来较小误差，同时保留剩下的低频部分；低频部分在虚时间演化下表现良好。事实上，执行算子傅里叶变换并应用截断方案后，我们得到 Equation (1.3) 的如下准局域版本，见 Lemma III.4：

$$
\langle O,[A,H-H']\rangle_\rho
=\frac{\mathrm{const.}}{\beta}\int_{-\infty}^{\infty}\int_{-\infty}^{\infty}
\operatorname{Tr}\!\left[O_H^\dagger(t)\left(h_+(t')A_{H'}(t'+t)\rho-h_-(t')\rho A_{H'}(t'+t)\right)\right]
 g_\beta(t)dt'dt
+\text{error terms},
$$

其中 $h_+,h_-$ 是快速衰减函数。

**问题 2 的解决方案。** 注意，Equation (1.3) 右端的如下变体，即**可识别性观测量**，实际上可以在实验中测量：

$$
Q(O,G,A,H'):=\frac{1}{\sqrt{2\pi}}
\int_{-\infty}^{\infty}\int_{-\infty}^{\infty}
\operatorname{Tr}\!\left[O_G^\dagger(t)
\left(h_+(t')A_{H'}(t'+t)\rho-h_-(t')\rho A_{H'}(t'+t)\right)\right]g_\beta(t)dt'dt. \tag{1.5}
$$

这里 $G$ 是实验者可以选择的任意局域哈密顿量。可识别性观测量的性质是我们局域学习算法的关键，并且使得我们方法中的局域充分统计量性质变得透明。关键地，由于 Equation (1.2)，当 $H=H'$ 时，该表达式仍然消失；并且当 $H$ 与 $H'$ 在局域上一致时，它对任意 $G$ 都保持可忽略。

进一步地，因为 $G,H'$ 是局域哈密顿量，我们可以调用常规 Lieb-Robinson bounds 来显著减少相关的 $G,H'$ 选择，见 Appendix B。具体来说，把它们限制在 $O$ 和 $A$ 周围半径 $\ell$ 的区域中，同时保证

$$
Q(O,G_\ell,A,H'_\ell)\approx Q(O,G,A,H').
$$

这里 $G_\ell$ 和 $H'_\ell$ 分别是 $G$ 和 $H'$ 在 $O$ 和 $A$ 周围半径 $\ell$ 的球上的限制。

**Figure 1。** 虚时间共轭

$$
e^{\beta H}Ae^{-\beta H}=\sum_\nu e^{\beta\nu}A_\nu
$$

会按照 Bohr 频率 $\nu$ 赋予指数权重 $e^{\beta\nu}$。当 $\beta$ 是较大的常数时，这种指数增长通常会给控制虚时间共轭的范数带来困难，除了一维自旋链。值得注意的是，将 $A$ 改写成算子傅里叶变换 $\widehat A(\omega)$ 的形式，并且为简单起见取 $\sigma=1/\beta$，具有方便的正则化效果，使得我们可以分别处理低频部分和高频部分：低频部分在虚时间共轭下仍然受控，高频部分则被截断 [CR]。特别地，Gaussian 轮廓与指数函数良好相互作用，从而导出方便的计算和范数界。

**Figure 2。** 我们的局域学习协议应用于具有最近邻相互作用的二维格点。左图：非自适应学习协议。为了学习接触站点 $i$ 的项 $h_\gamma$，只需要在半径 $\ell$ 内搜索局域哈密顿量 $H_\ell$；该距离定义在相互作用图上，见 Section II B，并依赖于逆温度 $\beta$ 和误差 $\epsilon$。值得注意的是，我们不需要访问远离 $i$ 的区域，并且测量只涉及局域算子的 Heisenberg 动力学。虽然对于固定精度，算法是局域的，但时间复杂度会随搜索体积增长，并且通常关于 $1/\epsilon$ 是准多项式的。右图：改进的迭代学习协议。我们不直接达到高精度，而是在每次迭代中力求使精度翻倍：给定一个相当好的猜测 $H_0$，使得 $H=H_0+\eta U$，我们希望进一步细化 $U$。这使我们只需在与误差无关的半径 $\ell_0$ 内搜索。

### 2. 一般图上的协议

现在可以概述我们的算法。该算法执行一种贪心局域搜索，独立学习每个项。对于一个站点 $i$，考虑 Pauli 算子 $A\in\{X_i,Y_i,Z_i\}$，以及 $O=[A,P_\gamma]$；这足以控制 $O=[A,H-H']$。策略可以用一句话概括：

**搜索一个 $H'_\ell$，使得 $Q(O,G_\ell,A,H'_\ell)$ 对所有 $G_\ell,A,O$ 都很小。记录与 $i$ 重叠的项。**

这样的 $H'_\ell$ 总是存在，因为可以设 $H'_\ell=H_\ell$，如前一小节所讨论。反过来，任何这样的 $H'_\ell$ 都保证局域唯一，因为令 $G_\ell=H_\ell$ 时，局域对易子 $[A,H'_\ell-H_\ell]$ 必须很小，见 Section III D 中关于 KMS 范数忠实性的讨论；这需要对所有作用在 $i$ 上的 Pauli $A\in\{X_i,Y_i,Z_i\}$ 成立。这意味着，对所有作用在站点 $i$ 上的项，$H'_\ell$ 与 $H_\ell$ 近似一致。对于目标误差，我们选择

$$
\ell=O(\beta^4+\beta\log(1/\epsilon))
$$

并为 $H'_\ell$ 的系数放置适当稠密的覆盖网。

所宣称的样本复杂度 $O(\log n)$ 缩放来自尽可能并行地测量多个 $Q$。关于精度的依赖距离 $1/\epsilon^2$ 很远，但当限制到 $D$ 维哈密顿量时，我们可以得到关于精度的近最优缩放。

### 3. 格点上的迭代协议

在高精度区域 $\epsilon\to0$ 中，由于 Lieb-Robinson bounds，用于截断时间演化 $A_{H'}(t)$ 的局域邻域半径需要随误差 $\epsilon$ 对数增长。因此，朴素地说，如前一小节所讨论，在站点 $i$ 的邻域中对所有可能哈密顿量 $H'$ 的搜索空间仍然随精度以较差方式增长，大约为 $\log(1/\epsilon)^D$。

为了达到所宣称的关于 $\epsilon$ 的近最优依赖，我们提出一个迭代协议，通过并行扫描逐步提高精度。假设我们已经找到了一个常数精度较好的候选 $H_0$，例如 $\eta=0.1$，用于底层哈密顿量 $H$，并希望通过考虑形如 $H_0+\eta U$ 的局域哈密顿量进一步提高精度。观察是：可识别性观测量 (1.5) 实际上对 $i$ 附近的项最敏感；如果目标是把精度从 $\eta$ 翻倍到 $\eta/2$，则只需在 $i$ 附近一个常数大小、且与误差 $\eta$ 无关的邻域中搜索。虽然测量仍然涉及大小为 $\log(1/\eta)^D$ 的邻域，但搜索空间的常数大小邻域显著节省了样本复杂度。因此，我们在 $i$ 周围半径 $\ell\sim\beta^4$ 的区域中搜索 $U'_\ell$。搜索完成后，作用在站点 $i$ 上的 $U'_\ell$ 与 $U_\ell$ 的局域项相差 $\eta/2$。然后我们再次迭代该算法，直到 $\eta=\epsilon$。这种迭代算法是我们唯一大量依赖格点几何的地方；在格点几何中，距离 $\ell$ 内的项数只按 $\sim\ell^D$ 增长。

## B. 先前工作

| 工作 | 样本复杂度 | 时间复杂度 | 纠缠量子比特数 |
|---|---|---|---|
| Theorem I.2（格点） | $O\!\left(\log n\cdot \frac{e^{\operatorname{Poly}(\beta)}}{\beta^2\epsilon^2}\operatorname{Poly}(\log\frac1\epsilon)\right)$ | $O\!\left(n\log n\cdot \frac{e^{\operatorname{Poly}(\beta)}}{\beta^2\epsilon^2}\operatorname{Poly}(\log\frac1\epsilon)\right)$ | $\operatorname{Poly}(\beta,\log\frac1\epsilon)$ |
| Theorem I.1（图） | $O\!\left(\log n\cdot 2^{2^{O(\beta^4)}\operatorname{Poly}(1/\beta\epsilon)}\right)$ | $O\!\left(n\log n\cdot 2^{2^{O(\beta^4)}\operatorname{Poly}(1/\beta\epsilon)}\right)$ | $\operatorname{Poly}(\beta,\log\frac1\epsilon)$ |
| [BLMT24, Nar24]（图） | $\operatorname{Poly}\!\left(n,\frac1{\epsilon^{O(\beta^2)}}\right)$ | $\operatorname{Poly}\!\left(n,\frac1{\epsilon^{O(\beta^2)}}\right)$ | $O(\beta^2\log\frac1\epsilon)$ |
| [HKT22]（高温，图） | $O\!\left(\frac{\log n}{\beta^2\epsilon^2}\right)$ | $O\!\left(\frac{n\log n}{\beta^2\epsilon^2}\right)$ | $O(\log\frac1\epsilon)$ |
| [AAKS20]（格点） | $\operatorname{Poly}(n)\frac{e^{\operatorname{Poly}(\beta)}}{\operatorname{Poly}(\beta)\epsilon^2}$ | $2^{O(n)}\cdot\frac{e^{\operatorname{Poly}(\beta)}}{\operatorname{Poly}(\beta)\epsilon^2}$ | $O(1)$ |

**Table I。** 在样本复杂度、时间复杂度、局域性和测量大小方面比较不同工作，成功概率为 $0.99$。时间复杂度合并了经典计算成本和量子门复杂度。有些结果适用于相互作用度有界的哈密顿量，包括扩展图；有些结果适用于 $D$ 维格点哈密顿量；我们用 $O(\cdot)$ 压制对几何常数，也就是度 $d$、维数 $D$ 和局域性 $q$ 的依赖。[BLMT24] 中的测量会纠缠相距很远的量子比特，距离指图距离，而其他所有工作中的测量只纠缠所声明大小的邻近量子比特。

虽然我们的方法旨在揭示从 Gibbs 态进行哈密顿量学习中的新局域性方面，但我们也评论它与 [BLMT24] 的一些相似之处。他们也考虑了一个类似 KMS 的条件 [BLMT24, Eq (1)]，让人联想到我们的 (1.2)，并且通过复杂的平方和论证证明唯一性。在我们这里，我们能够直接分离出一个受热力学启发的观测量，它在单个解析方程 (1.3) 中识别局域项。[BLMT24, Eq. (2-4)] 还通过关于 $\rho_\beta(H)$ 的低次数近似控制虚时间演化算子。我们相信，我们的算子傅里叶变换可以提供一种透明方法来达到类似目标。

也许关键差异在于，他们需要测量相距很远的量子比特，这在我们的设置中没有对应物；这可能是阻碍他们把样本复杂度关于系统大小从多项式改进到对数的障碍。我们使用的算子傅里叶变换 $A_H(\omega)$ 可能可以处理这一点；将 Equation (1.4) 代入 [BLMT24] 的平方和技术中也可能导出一种局域方法，但我们不在本文中追求这一点。

如前所述，其他先前工作要么考虑高温区域 [HKT22]，要么牺牲经典后处理的时间效率以换取简单测量 [AAKS20]。我们复现了一个让人联想到 [AAKS20] 的方差下界，以说明 KMS 范数是局域忠实的，但现在使用现代算子傅里叶变换工具。其他工作 [BAL19, LBA+23] 考虑启发式方法；将我们的方法修改为非常局域的测量，同时具有半启发式保证，将是有趣的。

脚注 3：在 [BLMT24, Lemma 8.1] 中，作者希望界定一个涉及对易子 $[H,H']$ 的表达式。为此，他们需要第 30 页条件 5 中的第 3 项，对所有小尺寸的 $A_1,A_2$ 成立，包括那些在距离上相距很远的 $A_1,A_2$。

## C. 讨论与开放问题

我们已经展示了如何从 Gibbs 态局域地学习哈密顿量。对于所有格点，这在误差 $\epsilon$ 和系统大小 $n$ 的依赖上达到了近最优样本复杂度和时间复杂度。一方面，我们的工作完成了对这类物理相关哈密顿量可学习性的理论理解。另一方面，它开启了一系列新问题。

- **降低测量成本。** 我们的算法仍然需要在 $O(\beta^D)$ 个量子比特上做测量，这在实践中可能很大。工作 [AAKS20] 展示了如何用 $k$-local 测量学习 $k$-local 哈密顿量，尽管时间复杂度非常大。作为进一步证据，在经典情形中，学习可以用 $O(1)$ 局域性完成。假设我们知道 $H$ 是一个 2-local 经典哈密顿量，例如 Ising 模型。为了学习站点 $i$ 邻域中的所有局域项，我们可以利用经典 Gibbs 态的 Markov 性质：站点 $i$ 上的分布只依赖于 $i$ 的邻域中的自旋构型。一个局域实验可以很容易地通过层析识别这个条件分布。然后这可以用于重构整个哈密顿量。

  是否存在一种方法，在达到近最优样本复杂度和时间复杂度的同时，只在 $O(1)$ 个站点上执行纠缠测量？支持 $O(\beta^D)$ 个量子比特纠缠测量的部分证据来自这样一个事实：最新的从时间演化 $e^{iHt}$ 中学习哈密顿量的方法也使用作用在 $\Omega(t^D)$ 个量子比特上的纠缠测量 [HKT22, HTFS23]。由于 Gibbs 态本质上可以视为虚时间演化，$O(\beta^D)$ 个量子比特的纠缠测量似乎是基本的。

- **更一般图上的近最优协议。** 是否可能在超越格点的更一般相互作用族上实现近最优样本复杂度和时间复杂度？在化学和原子系统中，严格来说，相互作用具有幂律衰减；单个电子可能以不同权重与数量广泛的粒子相互作用。研究定义在一般扩展图上的哈密顿量也很自然，例如稀疏 SYK 模型 [HSHT23] 或量子 Boltzmann 机。

- **结构学习。** 对于经典哈密顿量，在承诺图具有低度的情况下，可以以最优样本复杂度和时间复杂度学习底层图结构 [Bre15, KM17]。我们的 Theorem I.1 中一个关键假设是底层相互作用图已知。在承诺其具有低度的情况下，是否可能学习相互作用图本身？

- **与 Markov 性质的联系。** 经典 Gibbs 态学习算法的简洁性和局域性，与分布的 Markov 性质密切相关。给定其最近邻，一个顶点与剩余顶点独立，并且可以在给定邻居的条件下重采样目标顶点。有趣的是，非常近期的工作 [CR] 表明量子 Gibbs 态也满足一种局域 Markov 性质，即对 Gibbs 态的局域扰动可以通过运行覆盖该区域的准局域 Gibbs 采样器来近似恢复。尽管我们没能直接把局域 Markov 性质改造到当前学习任务中，但我们确实利用了正则化论证，并且量子算子傅里叶变换 [CKG23] 的局域性似乎是一个共同主题。

- **来自 thermofield double 态的误差 Heisenberg 缩放。** 当可以访问 Gibbs 态的纯化，也就是 thermofield double 态时，是否可能把误差从 $O(1/\epsilon^2)$ 降低到 $O(1/\epsilon)$？当 $H$ 是经典时，这是可能的，因为可以访问条件概率分布的纯化。

## 路线图

我们从预备知识开始，包括 KMS 内积、哈密顿量族及其相互作用图、算子傅里叶变换，以及低温下的正则化技巧。接着，我们展开围绕可识别性方程的关键解析论证。最后，我们给出应用可识别性方程的主要学习协议。在附录中，我们放置不那么居于主要概念信息核心的论证，包括标准 Lieb-Robinson bounds、截断界和标准量子算法子程序。

# II. 预备知识

## 记号

在整篇论文中，我们记

$$
a\lesssim b
$$

当且仅当存在绝对常数 $c>0$，使得 $a\le cb$。

在固定哈密顿量的几何参数，即度 $d$、维数 $D$ 和局域性 $q$ 时，我们用 $O(\cdot)$ 表示渐近上界；$\operatorname{Poly}(\cdot)$ 表示只依赖于 $q,d,D$ 的多项式。我们用 $\widetilde O(\cdot)$ 进一步吸收多对数因子。我们将标量、函数和向量用普通字体表示，矩阵用粗体表示，例如 $\mathbf O$。

$$I:$$ 恒等算子。

$$\beta:$$ 逆温度。

$$
\rho_\beta:=\frac{e^{-\beta H}}{\operatorname{Tr}[e^{-\beta H}]}\;(\equiv \rho)
$$

逆温度为 $\beta$ 的 Gibbs 态。

$$
n=|\Lambda|
$$

哈密顿量 $H$ 的系统大小，也就是量子比特数。

### 傅里叶变换记号

$$
H=\sum_i E_i|\psi_i\rangle\langle\psi_i|
$$

所研究的哈密顿量及其本征分解。

$$
\operatorname{Spec}(H):=\{E_i\}
$$

哈密顿量的谱。

$$
\nu\in B=B(H):=\operatorname{Spec}(H)-\operatorname{Spec}(H)
$$

Bohr 频率集合。

$$
P_E:=\sum_{i:E_i=E}|\psi_i\rangle\langle\psi_i|
$$

能量 $E$ 的本征空间投影。

$$
A_\nu:=\sum_{E_2-E_1=\nu}P_{E_2}AP_{E_1}
$$

算子 $A$ 在精确 Bohr 频率 $\nu$ 处的部分。

$$
A_H(t):=e^{iHt}Ae^{-iHt}
$$

算子 $A$ 在 $H$ 下的时间演化。

$$
\widehat A_H(\omega):=\frac1{\sqrt{2\pi}}\int_{-\infty}^{\infty}e^{-i\omega t}f(t)A(t)dt
$$

由 $f$ 加权的算子 $A$ 的算子傅里叶变换。

$$
\widehat f(\omega)=\lim_{K\to\infty}\frac1{\sqrt{2\pi}}\int_{-K}^{K}e^{-i\omega t}f(t)dt
$$

函数 $f$ 的傅里叶变换。

### 范数

$$
\|O\|:=\sup_{|\psi\rangle,|\phi\rangle}\frac{\langle\phi|O|\psi\rangle}{\||\psi\rangle\|\cdot\||\phi\rangle\|}=\|O\|_\infty
$$

矩阵 $O$ 的算子范数。

$$
\|O\|_p:=(\operatorname{Tr}|O|^p)^{1/p}
$$

矩阵 $O$ 的 Schatten $p$ 范数。

$$
\langle X,Y\rangle_\rho:=\operatorname{Tr}[X^\dagger\rho^{1/2}Y\rho^{1/2}].
$$

Kubo-Martin-Schwinger 内积。

## A. Gibbs 态与 KMS 内积

我们回顾，给定满秩态 $\rho$，两个算子 $X,Y$ 的 KMS 内积为

$$
\langle X,Y\rangle_\rho:=\operatorname{Tr}[X^\dagger\rho^{1/2}Y\rho^{1/2}].
$$

在本文中，我们记

$$
\|X\|_\rho:=\sqrt{\langle X,X\rangle_\rho}
$$

为由 KMS 内积诱导的 $\rho$-加权范数。特别地，我们只考虑与真实哈密顿量 $H$ 相关的 Gibbs 态

$$
\rho=e^{-\beta H}/\operatorname{Tr}[e^{-\beta H}].
$$

**Remark II.1.** 我们当前的论证隐含地需要 KMS 内积，并且并不明显适用于其他选择，例如 GNS 内积。

到算子范数的转换总是成立的，但有时可能不是最优的。

**Lemma II.1（算子范数控制加权范数和内积）。** 无条件地，我们有

$$
\|X\|_\rho\le \|X\|,
\qquad
\langle X,Y\rangle_\rho\le \|X\|\|Y\|.
$$

## B. 有界度相互作用图上的哈密顿量与格点上的哈密顿量

在包含 $n=|\Lambda|$ 个量子比特的集合 $\Lambda$ 上，我们考虑每一项 $h_\gamma$ 至多作用在 $q$ 个量子比特上的哈密顿量 $H$：

$$
H=\sum_{\gamma\in\Gamma}h_\gamma,
\qquad \|h_\gamma\|\le 1.
$$

由这个分解，我们定义相互作用图：顶点对应集合 $\Gamma$；当且仅当两项支撑重叠时，在 $\gamma_1$ 与 $\gamma_2$ 之间连边，允许自环：

$$
\gamma_1\sim\gamma_2\Longleftrightarrow
\operatorname{Supp}(h_{\gamma_1})\cap\operatorname{Supp}(h_{\gamma_2})\ne\varnothing.
$$

类似地，我们可以考虑任意顶点子集 $A\subset\Lambda$，并写作

$$
A\sim\gamma\Longleftrightarrow A\cap\operatorname{Supp}(h_\gamma)\ne\varnothing.
$$

相互作用图的最大度记为 $d$；我们特别工作在 $d$ 是与系统大小 $n$ 无关的常数的区域。对于任意两个顶点子集 $A,B\subset\Lambda$，我们用 $\operatorname{dist}(A,B)$ 表示通过 $H$ 中的相互作用连接 $A$ 到 $B$ 的路径的最小长度：

$$
\operatorname{dist}(A,B)=\min\{\ell\in\mathbb N:\exists\gamma_1,\ldots,\gamma_\ell\in\Gamma\text{ such that } A\sim\gamma_1\sim\gamma_2\sim\cdots\sim\gamma_\ell\sim B\}.
$$

通常，我们也会把子集 $A$ 或 $B$ 视作哈密顿量项 $\gamma$，并轻微滥用记号写成 $\operatorname{dist}(\gamma,\gamma')$ 和 $\operatorname{dist}(A,\gamma')$。我们还会把算子 $A$ 的支撑记作 $\operatorname{Supp}(A)$，并写

$$
\operatorname{dist}(A,\gamma')\equiv\operatorname{dist}(\operatorname{Supp}(A),\gamma').
$$

对于子集 $A\subset\Lambda$，我们常考虑局域哈密顿量块 $H_\ell$，它包含所有满足 $\operatorname{dist}(\gamma,A)<\ell-1$ 的项 $h_\gamma$：

$$
H_\ell=\sum_{\gamma:\operatorname{dist}(\gamma,A)<\ell-1}h_\gamma.
$$

还定义围绕集合 $A$ 的球的表面积和体积：

$$
S(\ell,A):=|\{\gamma:\operatorname{dist}(\gamma,A)=\ell\}|,
$$

$$
V(\ell,A):=|\{\gamma:\operatorname{dist}(\gamma,A)\le\ell\}|.
$$

我们总有

$$
S(\ell)\le |A|d^{\ell+1},
\qquad
V(\ell)\le |A|d^{\ell+2}/(d-1)\le |A|d^{\ell+2}.
$$

我们的一些结果考虑 $D$ 维哈密顿量的特殊情形。为了证明，我们将简单地通过对集合 $A$ 周围的体积和面积施加统一上界来定义一族 $D$ 维格点哈密顿量：

$$
S(\ell)\le O(|A|\ell^{D-1}),
\qquad
V(\ell)\le O(|A|\ell^D),
$$

并且度 $d$ 和局域性 $q$ 是常数，$O(\cdot)$ 压制对 $D,d,q$ 的依赖。这些覆盖最近邻格点的情形，以及更一般的“有限程”相互作用，它允许任意局域化的相互作用。为了具体描述学习协议，我们最终会把每一项看成一个不同的非平凡 Pauli 串

$$
P_\gamma\in\{I,X,Y,Z\}^{\otimes n},
$$

其至多为 $q$-体，并由标量 $h_\gamma$ 加权：

$$
h_\gamma=h_\gamma P_\gamma
\quad\text{where }h_\gamma\in[-1,1]\text{ and }\|P_\gamma\|=1.
$$

不过，一些基本子程序可以只用相互作用图的几何结构来表述，而不必承诺特定表示。

脚注 4：每个哈密顿量在超边为 $\gamma$ 时也定义一个超图。这里，相互作用图定义在哈密顿量项 $h_\gamma$ 之间。

脚注 5：这将保证可以由常数温度 Gibbs 态进行共轭，见 Lemma II.5。

脚注 6：不同性保证同一哈密顿量的系数唯一。去掉恒等算子保证当 $\beta>0$ 时，Gibbs 态唯一确定哈密顿量。

## C. 算子傅里叶变换

我们回顾 [CKBG23, CKG23] 中与哈密顿量 $H$ 相关的算子 $A$ 的算子傅里叶变换。设谱分解为 $H=\sum_i E_iP_{E_i}$，则

$$
\widehat A_H(\omega)=\frac1{\sqrt{2\pi}}\int_{-\infty}^{\infty}e^{iHt}Ae^{-iHt}e^{-i\omega t}f(t)dt \tag{2.1}
$$

其中 Gaussian 权重具有能量宽度 $\sigma>0$：

$$
\widehat f(\omega)=\frac1{\sqrt{\sigma\sqrt{2\pi}}}\exp\!\left(-\frac{\omega^2}{4\sigma^2}\right),
\qquad
f(t)=e^{-\sigma^2t^2}\sqrt{\sigma\sqrt{2/\pi}}, \tag{2.2}
$$

使得

$$
\int_{-\infty}^{\infty}|f(t)|^2dt=\int_{-\infty}^{\infty}|\widehat f(\omega)|^2d\omega=1.
$$

回顾傅里叶变换对：

$$
\widehat f(\omega)=\frac1{\sqrt{2\pi}}\int_{-\infty}^{\infty}e^{-i\omega t}f(t)dt,
\qquad
f(t)=\frac1{\sqrt{2\pi}}\int_{-\infty}^{\infty}e^{i\omega t}\widehat f(\omega)d\omega.
$$

不过，在本文中，我们专门把 $f(t)$ 保留给 Gaussian 权重。一个关键对象是按哈密顿量 $H$ 的 Bohr 频率 $\nu\in B(H)$ 对算子 $A$ 作分解：

$$
A=\sum_{\nu\in B(H)}A_\nu,
\qquad
A_\nu:=\sum_{E_2-E_1=\nu}P_{E_2}AP_{E_1},
$$

它满足

$$
(A_\nu)^\dagger=(A^\dagger)_{-\nu}.
$$

这里 $P_E$ 是能量 $E\in\operatorname{Spec}(H)$ 的本征空间投影，$B(H)=\operatorname{Spec}(H)-\operatorname{Spec}(H)$ 是能量差集合。

**Lemma II.2（分解为 Bohr 频率 [CKBG23, Appendix A]）。** 对任意哈密顿量 $H$，一个不一定 Hermitian 的算子 $A$ 的 Heisenberg 动力学可以分解为

$$
A_H(t):=e^{iHt}Ae^{-iHt}=\sum_{\nu\in B(H)}e^{i\nu t}A_\nu.
$$

此外，算子傅里叶变换满足

$$
\widehat A_H(\omega)=\sum_{\nu\in B(H)}A_\nu\widehat f(\omega-\nu).
$$

## D. 低温下算子傅里叶变换的正则化

在低常数温度下，虚时间动力学在一维以上会随系统大小指数发散：

$$
\|e^{\beta H}Ae^{-\beta H}\|\ge e^{cn} \quad [\text{Bou15}].
$$

把算子分解到不同 Bohr 频率处的算子傅里叶变换上将非常有帮助。本节遵循 [CR] 的结果，并包含一些相关证明。

**Lemma II.3（按能量变化分解算子 [CR, Lemma IX.1]）。** 对任意不一定 Hermitian 的算子 $A$ 和 Hermitian 的 $H$，我们有

$$
A=\frac1{\sqrt{\sigma2\sqrt{2\pi}}}\int_{-\infty}^{\infty}\widehat A_H(\omega)d\omega.
$$

**证明。**

$$
\int_{-\infty}^{\infty}\widehat A_H(\omega)d\omega
=\int_{-\infty}^{\infty}\sum_\nu A_\nu\widehat f(\omega-\nu)d\omega
=\sum_\nu A_\nu\int_{-\infty}^{\infty}\widehat f(\omega-\nu)d(\omega-\nu)
=A\sqrt{2\pi}f(0)=A\sqrt{\sigma2\sqrt{2\pi}}.
$$

整理即可得到证明。$\blacksquare$

Gaussian 阻尼由于其超指数衰减而具有正则化效果。

**Lemma II.4（虚时间共轭的范数界 [CR, Lemma IX.2]）。** 对任意 $\beta,\omega\in\mathbb R$ 以及范数 $\|A\|\le1$ 的算子 $A$，具有不确定度 $\sigma$ 的算子傅里叶变换 $\widehat A_H(\omega)$，见 (2.1)、(2.2)，满足

$$
e^{\beta H}\widehat A_H(\omega)e^{-\beta H}=e^{\beta\omega}\cdot \widehat A_H(\omega+2\sigma^2\beta)e^{\sigma^2\beta^2}.
$$

因此

$$
\|e^{\beta H}\widehat A_H(\omega)e^{-\beta H}\|
\le \frac{e^{\sigma^2\beta^2}}{\sqrt{\sigma\sqrt{2\pi}}}e^{\beta\omega}.
$$

相比之下，直接共轭未过滤的算子可能导致范数 $\|e^{\beta H}Ae^{-\beta H}\|$ 随系统大小 $n$ 增长；以 Bohr 频率 $\omega$ 为中心的 Gaussian 过滤去除了对系统大小 $n$ 的依赖，而只依赖于 Bohr 频率 $\omega$。尽管它仍然指数增长，但这些界现在完全是准局域的。

**证明。** 回顾

$$
e^{\beta H}\widehat A_H(\omega)e^{-\beta H}
=\sum_\nu A_\nu\frac1{\sqrt{\sigma\sqrt{2\pi}}}
\exp\!\left(-\frac{(\omega-\nu)^2}{4\sigma^2}\right)e^{\beta\nu}
$$

由 Lemma II.2，继续得到

$$
=\sum_\nu A_\nu\frac1{\sqrt{\sigma\sqrt{2\pi}}}
\exp\!\left(-\frac{(\omega+2\sigma^2\beta-\nu)^2}{4\sigma^2}+\beta\omega+\sigma^2\beta^2\right)
=\widehat A(\omega+2\sigma^2\beta)e^{\beta\omega+\sigma^2\beta^2}.
$$

对时间积分应用三角不等式

$$
\|\widehat A(\omega)\|\le \frac1{\sqrt{2\pi}}\int_{-\infty}^{\infty}|f(t)|dt=\widehat f(0)=\frac1{\sqrt{\sigma\sqrt{2\pi}}}
$$

即可完成证明。$\blacksquare$

在足够高的温度下，有一个更强的界；它处在 Taylor 展开的收敛半径内，并利用了哈密顿量的有界相互作用度。

**Lemma II.5（虚时间的收敛性 [CR, Lemma IX.3]）。** 对 Section II B 中定义的、相互作用度至多为 $d$ 的哈密顿量，单点算子 $A$，以及 $|\beta|<1/2d$，有

$$
\|e^{\beta H}Ae^{-\beta H}\|\le \frac1{1-2d|\beta|}.
$$

利用上述结果，我们可以自举得到对算子傅里叶变换范数的更好界。

**Corollary II.1（大能量差下的范数衰减 [CR, Corollary IX.2]）。** 对任意 $\beta,\omega\in\mathbb R$ 和算子 $A$，不确定度 $\sigma>0$ 的算子傅里叶变换满足

$$
\|\widehat A_H(\omega)\|\le
\frac{e^{-\beta\omega+\sigma^2\beta^2}}{\sqrt{\sigma\sqrt{2\pi}}}\|e^{\beta H}Ae^{-\beta H}\|.
$$

**证明。** 在左右两侧“借入”相互抵消的 $e^{\beta H}$ 因子：

$$
\widehat A_H(\omega)=e^{-\beta H}\cdot(e^{\beta H}\widehat A_H(\omega)e^{-\beta H})\cdot e^{\beta H}
=e^{-\beta H}\cdot \bigl([e^{\beta H}Ae^{-\beta H}]\widehat{\ }_H(\omega)\bigr)\cdot e^{\beta H},
$$

其中算子傅里叶变换与虚时间共轭可交换。对 $A'=e^{\beta H}Ae^{-\beta H}$ 应用 Lemma II.4 即得证明。$\blacksquare$

这将允许我们在 Bohr 频率空间中以指数小误差截断算子。

# III. 可识别性方程

在本节中，我们关注真实值

$$
H=\sum_{\gamma\in\Gamma}h_\gamma
$$

和一个猜测

$$
H'=\sum_{\gamma'\in\Gamma}h_{\gamma'}
\quad\text{where }\|h_{\gamma'}\|\le1
$$

之间的局域差异，并通过如下正量来度量：

$$
\|[A,H-H']\|_\rho^2
\quad\text{for }A\in\{X_i,Y_i,Z_i\}.
$$

挑战在于：我们希望在先验不知道真实 $H$ 的情况下控制这个量。第一步是通过在一组算子上优化来松弛该表达式：

$$
\|[A,H-H']\|_\rho^2
=\langle [A,H-H'],[A,H-H']\rangle_\rho
\le 2d\sup_{O=[A,P_\gamma]}|\langle O,[A,H-H']\rangle_\rho|. \tag{3.1}
$$

也就是说，我们把 $O$ 取为 $H$ 与 $A$ 取对易子时所有可能出现的项。

本节的主要结果是如下可识别性方程，其精确函数形式将是局域学习的关键。

**Lemma III.1（可识别性方程）。** 对任意一对哈密顿量 $H,H'$ 以及 Gibbs 态 $\rho\propto e^{-\beta H}$、$\rho'\propto e^{-\beta H'}$，和任意算子 $O,A$，有

$$
\frac\beta2\langle O,[A,H-H']\rangle_\rho
=\frac1{\sqrt{2\pi}}\int_{-\infty}^{\infty}
\operatorname{Tr}\!\left[
O_{\beta H/2}^\dagger(t)
\left(\sqrt{\rho'}A_{\beta H'/2}(t)\sqrt{\rho'^{-1}}\rho
-\rho\sqrt{\rho'^{-1}}A_{\beta H'/2}(t)\sqrt{\rho'}\right)
\right]g(t)dt.
$$

本节余下部分从证明开始，并提供额外的正则化技巧，这些技巧会把右端转化为具有良好连续性质的物理可测量。我们还将推出对易子平方与局域系数之间的转换。

## A. 双 Bohr 频率分解

为了理解 Lemma III.1，我们必须考虑两个哈密顿量 $H_1,H_2$，并以迭代方式把它们分解到各自的 Bohr 频率 $\nu_1,\nu_2$ 上。这导致如下“双重”分解，初看可能有些吓人：

$$
(A_{\nu_1})_{\nu_2}:=
\sum_{E'_2-E_2=\nu_2}\sum_{E'_1-E_1=\nu_1}
P_{E'_2}P_{E'_1}AP_{E_1}P_{E_2}.
$$

一般而言，分解顺序很重要，$(A_{\nu_1})_{\nu_2}\ne (A_{\nu_2})_{\nu_1}$，因为 $H_1$ 和 $H_2$ 可能不对易。尽管如此，对于我们关心的表达式，其双 Bohr 频率分解仍然具有可处理形式。

**Lemma III.2（双 Bohr 频率分解）。** 对任意算子 $A$ 和 Hermitian 算子 $H_1,H_2$，

$$
e^{H_2}e^{-H_1}Ae^{H_1}e^{-H_2}-e^{-H_2}e^{H_1}Ae^{-H_1}e^{H_2}
=\sum_{\nu_1\in B_1,\nu_2\in B_2}(A_{\nu_1})_{\nu_2}2\sinh(\nu_2-\nu_1), \tag{3.2}
$$

$$
[A,H_2]-[A,H_1]
=-\sum_{\nu_1\in B_1,\nu_2\in B_2}(A_{\nu_1})_{\nu_2}(\nu_2-\nu_1), \tag{3.3}
$$

其中 $B_1,B_2$ 分别是 $H_1,H_2$ 的 Bohr 频率集合。

**证明。** 在 Bohr 频率基中重写：

$$
e^{H_2}e^{-H_1}Ae^{H_1}e^{-H_2}
=e^{H_2}\left(\sum_{\nu_1\in B_1}A_{\nu_1}e^{-\nu_1}\right)e^{-H_2}
=\sum_{\nu_1\in B_1,\nu_2\in B_2}(A_{\nu_1}e^{-\nu_1})_{\nu_2}e^{\nu_2}
=\sum_{\nu_1\in B_1,\nu_2\in B_2}(A_{\nu_1})_{\nu_2}e^{\nu_2-\nu_1}.
$$

类似地，

$$
e^{-H_2}e^{H_1}Ae^{-H_1}e^{H_2}
=\sum_{\nu_1\in B_1,\nu_2\in B_2}(A_{\nu_1})_{\nu_2}e^{\nu_1-\nu_2}.
$$

取差得到第一行。接着，

$$
[A,H_1]=-\sum_{\nu_1\in B_1}A_{\nu_1}\nu_1
=-\sum_{\nu_2\in B_2}\sum_{\nu_1\in B_1}(A_{\nu_1})_{\nu_2}\nu_1,
$$

这里使用 Lemma II.2。并且

$$
[A,H_2]=-\sum_{\nu_2\in B_2}A_{\nu_2}\nu_2
=-\sum_{\nu_2\in B_2}\left(\sum_{\nu_1\in B_1}A_{\nu_1}\right)_{\nu_2}\nu_2.
$$

两种情况下，我们都在内层按 $\nu_1$ 分解，在外层按 $\nu_2$ 分解，从而两个表达式都是 $(A_{\nu_1})_{\nu_2}$ 的线性组合。取差得到第二行。$\blacksquare$

值得注意的是，Lemma III.2 中两个表达式的系数只依赖于差 $\nu_1,\nu_2$。

**Lemma III.3（在时间域中重写对易子差）。** 对任意算子 $A$ 和 Hermitian 算子 $H_1,H_2$，

$$
[A,H_2]-[A,H_1]
=\frac1{\sqrt{2\pi}}\int_{-\infty}^{\infty}
\left[e^{H_2}e^{-H_1}A_{H_1}(t)e^{H_1}e^{-H_2}
-e^{-H_2}e^{H_1}A_{H_1}(t)e^{-H_1}e^{H_2}\right]_{H_2}(-t)g(t)dt,
$$

其中

$$
g(t)=-\frac{\pi^{3/2}}{2\sqrt2(1+\cosh(\pi t))},
\qquad
\widehat g(\nu):=\frac{-\nu}{2\sinh(\nu)}.
$$

**证明。** 我们从 Lemma III.2 的 Bohr 频率分解开始：

$$
[A,H_2]-[A,H_1]
=-\sum_{\nu_1\in B_1,\nu_2\in B_2}(A_{\nu_1})_{\nu_2}(\nu_2-\nu_1)
$$

$$
=\sum_{\nu_1\in B_1,\nu_2\in B_2}(A_{\nu_1})_{\nu_2}2\sinh(\nu_2-\nu_1)\widehat g(\nu_2-\nu_1)
$$

$$
=\sum_{\nu_1\in B_1,\nu_2\in B_2}(A_{\nu_1})_{\nu_2}2\sinh(\nu_2-\nu_1)\frac1{\sqrt{2\pi}}\int_{-\infty}^{\infty}g(t)e^{-i(\nu_2-\nu_1)t}dt
$$

$$
=\frac1{\sqrt{2\pi}}\int_{-\infty}^{\infty}
\sum_{\nu_1\in B_1,\nu_2\in B_2}(A_{\nu_1}e^{i\nu_1 t})_{\nu_2}2\sinh(\nu_2-\nu_1)e^{-i\nu_2 t}g(t)dt.
$$

利用 Lemma II.2 将算子傅里叶变换写成时间域表达式，即可完成证明。$\blacksquare$

**Remark III.1.** 当哈密顿量 $H_1,H_2$ 差异很大时，我们预期 Gibbs 表达式，例如 $e^{H_2}e^{-H_1}A_{H_1}(t)e^{H_1}e^{-H_2}$，在算子范数中非常大。然而，经过仔细过滤后，只剩下左端。事实上，频率域过滤器 $\widehat g(\nu)$ 随 $|\nu|$ 指数衰减。

**Remark III.2.** (3.2) 中有 (3.3) 中没有的信息。例如，当两个全局哈密顿量 $H_1,H_2$ 在某个局域算子 $A$ 附近相同但在别处不同时，局域对易子消失，$[A,H_2]-[A,H_1]=0$，而全局量

$$
e^{H_2}e^{-H_1}Ae^{H_1}e^{-H_2}-e^{-H_2}e^{H_1}Ae^{-H_1}e^{H_2}
$$

可能不消失。另一方面，$(A_{\nu_1})_{\nu_2}$ 的系数通过双射 $x\mapsto -2\sinh(x)$ 相关，其中 $x=\nu_2-\nu_1$。这并不矛盾：为了访问 $(A_{\nu_1})_{\nu_2}$，我们需要从内外两侧施加哈密顿量动力学，$([A(t_1)_{H_1},H_2]-[A_{H_1}(t_1),H_1])_{H_2}(t_2)$，它包含的信息多于对易子 (3.3)。

## B. 松弛一个局域对易子

现在调用 Lemma III.3，用虚时间演化重写对易子，以证明关键可识别性方程。

**Lemma III.1 的证明。** 在 Lemma III.3 中取重标度哈密顿量 $H_2\leftarrow\beta H$、$H_1\leftarrow\beta H'$，得到

$$
\frac\beta2[A,H-H']
=\frac1{\sqrt{2\pi}}\int_{-\infty}^{\infty}
\left(e^{\beta H/2}e^{-\beta H'/2}A_{\beta H'/2}(t)e^{\beta H'/2}e^{-\beta H/2}
-e^{-\beta H/2}e^{\beta H'/2}A_{\beta H'/2}(t)e^{-\beta H'/2}e^{\beta H/2}\right)_{\beta H/2}(-t)g(t)dt
$$

$$
=\frac1{\sqrt{2\pi}}\int_{-\infty}^{\infty}
\left(\sqrt{\rho^{-1}}\sqrt{\rho'}A_{\beta H'/2}(t)\sqrt{\rho'^{-1}}\sqrt\rho
-\sqrt\rho\sqrt{\rho'^{-1}}A_{\beta H'/2}(t)\sqrt{\rho'}\sqrt{\rho^{-1}}\right)_{\beta H/2}(-t)g(t)dt. \tag{3.4}
$$

在每个时间 $t$，对被积函数取 $\rho$-加权期望

$$
\langle O,\cdot\rangle_\rho=\operatorname{Tr}[O^\dagger\sqrt\rho\,\cdot\,\sqrt\rho],
$$

得到

$$
\operatorname{Tr}\!\left[
\sqrt\rho O^\dagger\sqrt\rho
\left(\sqrt{\rho^{-1}}\sqrt{\rho'}A_{\beta H'/2}(t)\sqrt{\rho'^{-1}}\sqrt\rho
-\sqrt\rho\sqrt{\rho'^{-1}}A_{\beta H'/2}(t)\sqrt{\rho'}\sqrt{\rho^{-1}}\right)_{\beta H/2}(-t)
\right]
$$

$$
=\operatorname{Tr}\!\left[
O^\dagger\left(\sqrt{\rho'}A_{\beta H'/2}(t)\sqrt{\rho'^{-1}}\rho
-\rho\sqrt{\rho'^{-1}}A_{\beta H'/2}(t)\sqrt{\rho'}\right)_{\beta H/2}(-t)
\right]
$$

$$
=\operatorname{Tr}\!\left[
O_{\beta H/2}^\dagger(t)\left(\sqrt{\rho'}A_{\beta H'/2}(t)\sqrt{\rho'^{-1}}\rho
-\rho\sqrt{\rho'^{-1}}A_{\beta H'/2}(t)\sqrt{\rho'}\right)
\right].
$$

这里使用了外层时间动力学 $(\cdot)_{\beta H/2}$ 与 Gibbs 态 $\rho\propto e^{-\beta H}$ 对易，并使用了 $\operatorname{Tr}[A(-t)B]=\operatorname{Tr}[AB(t)]$。恢复积分即可完成证明。$\blacksquare$

人们可能会问，右端为何比左端更好，因为二者都依赖于 $H$ 和 $H'$。然而，观察到当 $H'=H$ 时，对每个 $t$ 都有

$$
\sqrt{\rho'}A_{\beta H'/2}(t)\sqrt{\rho'^{-1}}\rho
-\rho\sqrt{\rho'^{-1}}A_{\beta H'/2}(t)\sqrt{\rho'}=0.
$$

因此，必然存在一个猜测 $H'$，使得 (3.1) 的右端对所有 $O$ 消失。此外，我们可以通过枚举所有可能的 $O_{\beta\widetilde H}(t)$ 来验证右端为零，而无需先验知道 $H$。为了使该观察定量化，我们需要进一步调整右端，在下一节中适当地正则化 Gibbs 共轭，并理解当猜测 $H'$ 不恰好等于 $H$ 时误差的影响，见 Lemma IV.4。

**Remark III.3.** Lemma III.1 似乎隐含地与 KMS 内积绑定；我们不知道如何为 GNS 内积复制该论证。事实上，在 (3.4) 中，改变 $\rho,\rho'$ 的排序或指数，可能要么丧失局域性，要么无法在右端恢复 $\rho$ 的非分数幂。

## C. 正则化高频部分

然而，在可识别性方程 Lemma III.1 中，右端包含 Gibbs 态的共轭，而左端总是有界的。为了正则化这种发散，我们需要引入具有可控误差的截断。

**Lemma III.4（截断 Bohr 频率）。** 考虑 Lemma III.1 的设置。对任意 $\Omega'>0$，有

$$
\frac{\beta\sqrt{2\sigma\sqrt{2\pi}}}{2}\langle O,[A,H-H']\rangle_\rho
=\frac1{\sqrt{2\pi}}\int_{-\infty}^{\infty}\int_{-\infty}^{\infty}
\operatorname{Tr}\!\left[O_H^\dagger(t)
\left(h_+(t')A_{H'}(t'+t)\rho-h_-(t')\rho A_{H'}(t'+t)\right)\right]g_\beta(t)dt'dt
$$

$$
+\frac\beta2\int_{|\omega'|\ge\Omega'}\langle O,[\widehat A_{H'}(\omega'),H-H']\rangle_\rho d\omega',
$$

其中

$$
g_\beta(t):=\frac2\beta g(2t/\beta)\lesssim \frac1\beta e^{-2\pi|t|/\beta},
$$

并且对每个 $t\in\mathbb R$，

$$
|h_+(t)|,|h_-(t)|\lesssim e^{-\sigma^2t^2}\frac{\sqrt\sigma}{\beta}e^{\beta\Omega'/2+\sigma^2\beta^2/4}.
$$

**证明。** 为了简化记号，我们用标量变量 $\omega$ 区分两个哈密顿量 $H,H'$，并省略下标 $H,H'$：

$$
\widehat A_{H'}(\omega')\equiv\widehat A(\omega'),
\qquad
\widehat A_H(\omega)\equiv\widehat A(\omega).
$$

也就是说，每当使用 $\omega'$ 时，表示关于哈密顿量 $H'$ 的算子傅里叶变换。由 Lemma II.3 引入截断频率 $\Omega'>0$：

$$
cA=\int_{|\omega'|\le\Omega'}\widehat A_{H'}(\omega')d\omega'
+\int_{|\omega'|\ge\Omega'}\widehat A_{H'}(\omega')d\omega',
\qquad c=\sqrt{2\sigma\sqrt{2\pi}}.
$$

于是可以重写

$$
\frac{\beta c}{2}\langle O,[A,H-H']\rangle_\rho
=\frac1{\sqrt{2\pi}}\int_{-\infty}^{\infty}
\operatorname{Tr}\!\left[
O_{\beta H/2}^\dagger(t)
\int_{|\omega'|\le\Omega'}
\left(\sqrt{\rho'}\widehat A(\omega')_{\beta H'/2}(t)\sqrt{\rho'^{-1}}\rho
-\rho\sqrt{\rho'^{-1}}\widehat A(\omega')_{\beta H'/2}(t)\sqrt{\rho'}\right)d\omega'
\right]g(t)dt
$$

$$
+\frac\beta2\int_{|\omega'|\ge\Omega'}\langle O,[\widehat A_{H'}(\omega'),H-H']\rangle_\rho d\omega'.
$$

现在，我们把第一项写成 Heisenberg 动力学的时间平均，这将显然可以高效实现。由于算子傅里叶变换与 Heisenberg 动力学对易，对每个 $\omega',t\in\mathbb R$，有

$$
\sqrt{\rho'}(\widehat A_{H'}(\omega'))_{\beta H'/2}(t)\sqrt{\rho'^{-1}}
=\left(\sqrt{\rho'}\widehat A_{H'}(\omega')\sqrt{\rho'^{-1}}\right)_{\beta H'/2}(t).
$$

现在，

$$
\int_{|\omega'|\le\Omega'}\sqrt{\rho'}\widehat A_{H'}(\omega')\sqrt{\rho'^{-1}}d\omega'
=\int_{|\omega'|\le\Omega'}A_{H'}(\omega'-\sigma^2\beta)e^{-\beta\omega/2+\sigma^2\beta^2/4}d\omega'
$$

$$
=\frac1{\sqrt{2\pi}}\int_{-\infty}^{\infty}A_{H'}(t')
\int_{|\omega'|\le\Omega'}e^{-i(\omega'-\sigma^2\beta)t'}e^{-\beta\omega'/2+\sigma^2\beta^2/4}d\omega'
 f(t')dt'
=:\frac1{\sqrt{2\pi}}\int_{-\infty}^{\infty}A_{H'}(t')h_+(t')dt'.
$$

类似地，

$$
\int_{|\omega'|\le\Omega'}\sqrt{\rho'^{-1}}\widehat A_{H'}(\omega')\sqrt{\rho'}d\omega'
=\frac1{\sqrt{2\pi}}\int_{-\infty}^{\infty}A_{H'}(t')h_-(t')dt'.
$$

在上述两种情况下，

$$
|h_+(t)|,|h_-(t)|\lesssim |f(t)|\frac1\beta e^{\beta\Omega'/2+\sigma^2\beta^2/4}
\lesssim e^{-\sigma^2t^2}\frac{\sqrt\sigma}{\beta}e^{\beta\Omega'/2+\sigma^2\beta^2/4}.
$$

通过重标度 $g_\beta(t)=\frac2\beta g(2t/\beta)$ 吸收 $O_{\beta H/2}(t)$ 和 $A_{\beta H'/2}(t')$ 中的 $\beta/2$ 因子，并合并两个 Heisenberg 动力学 $t,t'$，即可完成证明。$\blacksquare$

截断误差可以如下界定。

**Lemma III.5（高频部分的衰减）。** 考虑一个相互作用度为 $d$ 的哈密顿量

$$
H'=\sum_\gamma h_\gamma
$$

见 Section II B，以及与 $H'$ 具有相同相互作用图的

$$
G=\sum_\gamma g_\gamma,
\qquad \|h_\gamma\|,\|g_\gamma\|\le1.
$$

在 Lemma III.1 的设置下，对单点 $A$，有

$$
\left|\int_{|\omega'|\ge\Omega'}\langle O,[\widehat A_{H'}(\omega'),G]\rangle_\rho d\omega'\right|
\lesssim
\frac{d^{4+16e^2d^4/\sigma^2}}{\sqrt\sigma}
 e^{-\Omega'/4d+\sigma^2/16d^2}\|O\|\|A\|.
$$

这里需要仔细利用 $\widehat A_{H'}(\omega')$ 和 $G$ 的局域性，通过展开虚时间和实时间演化；准局域性贡献了因子 $d^{4+16e^2d^4/\sigma^2}$。证明是常规的，见 Section B 1。

**Remark III.4.** 当我们设不确定度 $\sigma=1/\beta$ 时，右端增长为 $e^{O(\beta^2)}$。对于格点哈密顿量，这个关于 $\beta$ 的依赖可以进一步改进，但我们不在这里追求，因为在其他地方我们会损失主导学习样本复杂度的因子 $e^{\beta D}$。

## D. 局域对易子是忠实的

回顾不等式

$$
\|[A,H-H']\|_\rho^2\le 2d\sup_{O=[A,P_\gamma]}\langle O,[A,H-H']\rangle_\rho.
$$

只要右端很小，以下引理保证 $[A,H-H']$ 也很小。这由如下引理给出。

**Lemma III.6（KMS 是局域忠实的）。** 假设 $\beta\ge1/4d$。对不一定 Hermitian 的算子 $B$，以及相互作用度为 $d$ 的哈密顿量 $H$ 的 Gibbs 态

$$
\rho=e^{-\beta H}/\operatorname{Tr}(e^{-\beta H}),
$$

有

$$
\|B\|_\tau\le e^{80\beta|\operatorname{supp}(B)|+16d\beta\log(2d\beta)}\|B\|_\rho,
$$

其中 $\tau$ 是最大混合态。

有限温度 Gibbs 态上的 KMS 范数 $\|B\|_\rho^2$ 给出了最大混合态上局域算子方差的一个上界。由于 $\rho$ 可逆，$\|B\|_\rho^2=0$ 已经推出 $B=0$。目标是为局域算子 $B$ 获得与系统大小无关的定量界。论证利用了正则化技巧 Section II D。

**Lemma III.6 的证明。** 我们将建立两个断言，以获得一个自界定论证。

**断言 1。** 我们可以把 $\|B\|_\tau$ 与 $B$ 的一个旋转版本的 $\rho$-加权 KMS 范数联系起来。特别地，存在支撑在 $\operatorname{supp}(B)$ 上的酉 $U,V$，使得

$$
\|B\|_\tau\le 2^{2|\operatorname{supp}(B)|}\|U^\dagger BV\|_\rho. \tag{3.5}
$$

记 $B$ 的支撑为 $B=\operatorname{supp}(B)$。考虑区域 $B$ 上的 Haar 平均：

$$
\mathbb E_{U,V}\operatorname{Tr}(B^\dagger U\sqrt\rho U^\dagger BV\sqrt\rho V^\dagger)
=\operatorname{Tr}((\operatorname{Tr}_B(\sqrt\rho))^2)\frac{\|B\|_\tau^2}{2^{|B|}},
$$

其中使用了

$$
\mathbb E_U U\sqrt\rho U^\dagger=\operatorname{Tr}_B(\sqrt\rho)\otimes\frac{I_B}{2^{|B|}}.
$$

接着，下界估计 $\operatorname{Tr}((\operatorname{Tr}_B(\sqrt\rho))^2)$。我们有

$$
\sqrt\rho\le 2^{|B|}I_B\otimes\operatorname{Tr}_B(\sqrt\rho)
$$

从而

$$
1=\operatorname{Tr}(\rho)\le 2^{3|B|}\operatorname{Tr}((\operatorname{Tr}_B(\sqrt\rho))^2),
$$

最后一行使用了当 $0\le C\le D$ 时 $\operatorname{Tr}(C^2)\le\operatorname{Tr}(D^2)$，因为

$$
\operatorname{Tr}(D^2-C^2)=\operatorname{Tr}((D-C)(D+C)).
$$

合并上述内容得到 Eq. (3.5)。

**断言 2。** KMS 内积受到局域旋转的“保护”，类似 [AAKS20, Proposition 10]。对支撑在区域 $B$ 上的酉 $U,V$，有

$$
\frac{\|U^\dagger BV\|_\rho}{\|B\|}
\le (1+e^{1/4d\beta})\left(\frac{\|B\|_\rho}{\|B\|}\right)^{1/2}
+(2+8|B|d\beta)^{8|B|d\beta}\left(\frac{\|B\|_\rho}{\|B\|}\right)^{1/8d\beta}. \tag{3.6}
$$

考虑 Lemma II.3 中的分解：

$$
U=\frac1{\sqrt{\sigma2\sqrt{2\pi}}}
\left(\int_{|\omega|\le\Delta}\widehat U(\omega)d\omega+
\int_{|\omega|\ge\Delta}\widehat U(\omega)d\omega\right)
=:U_{\le\Delta}+U_{\ge\Delta}
$$

其中 $\sigma>0$ 和 $\Delta>0$ 可调。使用 Corollary II.1 和 Lemma II.5，并取 $|\beta_0|=1/4d$，可得

$$
\|U_{\ge\Delta}\|
\le \frac1{\sqrt{\sigma2\sqrt{2\pi}}}\int_{|\omega|\ge\Delta}\|\widehat U(\omega)\|d\omega
\le \frac1{\sigma\sqrt{2\pi}}\int_{|\omega|\ge\Delta}4^{|B|}e^{-|\omega|/4d+\sigma^2/16d^2}d\omega
\le \frac{4d}{\sigma}4^{|B|}e^{\sigma^2/16d^2-\Delta/4d}.
$$

因子 $4^{|B|}$ 来自 Pauli 分解 $U=\sum_P a_PP$，对每个 Pauli 应用 Lemma II.5：$\|e^{\beta_0H}Pe^{-\beta_0H}\|\le2^{|B|}$，以及 $\sum_P|a_P|\le2^{|B|}$。此时令 $\sigma=1/\beta$，这意味着

$$
\|U_{\ge\Delta}\|\le d\beta8^{|B|}e^{1/16d^2\beta^2-\Delta/4d}
$$

以及

$$
\|U_{\le\Delta}\|\le\|U\|+\|U_{\ge\Delta}\|
\le 1+d\beta8^{|B|}e^{1/16d^2\beta^2-\Delta/4d}.
$$

对 $V=V_{\le\Delta}+V_{\ge\Delta}$ 也做类似分解。

利用上述分解，以及 $|\langle P,Q\rangle_\rho|\le\|P\|\|Q\|$ 和三角不等式，可界定

$$
\|U^\dagger BV\|_\rho
\le \|U_{\le\Delta}^\dagger BV_{\le\Delta}\|_\rho
+(2+d\beta8^{|B|}e^{1/16d^2\beta^2-\Delta/4d})d\beta8^{|B|}e^{1/16d^2\beta^2-\Delta/4d}\|B\|.
$$

接着，我们界定上式第一项：

$$
\operatorname{Tr}\!\left(V_{\le\Delta}^\dagger B^\dagger U_{\le\Delta}\sqrt\rho U_{\le\Delta}^\dagger BV_{\le\Delta}\sqrt\rho\right)
$$

$$
=\operatorname{Tr}\!\left(
(\rho^{1/4}V_{\le\Delta}^\dagger\rho^{-1/4})(\rho^{1/4}B^\dagger\rho^{1/4})(\rho^{-1/4}U_{\le\Delta}\rho^{1/4})(\rho^{1/4}U_{\le\Delta}^\dagger\rho^{-1/4})(\rho^{1/4}B\rho^{1/4})(\rho^{-1/4}V_{\le\Delta}\rho^{1/4})
\right)
$$

$$
\le \left(\|\rho^{-1/4}V_{\le\Delta}\rho^{1/4}\|\|\rho^{-1/4}U_{\le\Delta}\rho^{1/4}\|\|B\|_\rho\right)^2
$$

其中使用 Holder 不等式。继续有

$$
\le \left(
\frac1{\sqrt{\sigma2\sqrt{2\pi}}}
\int_{|\omega|\le\Delta}d\omega\|\rho^{-1/4}\widehat V(\omega)\rho^{1/4}\|
\int_{|\omega|\le\Delta}d\omega\|\rho^{-1/4}\widehat U(\omega)\rho^{1/4}\|\|B\|_\rho
\right)^2
$$

$$
\le \left(\frac{e^{\sigma^2\beta^2/16}}{\sigma^2\pi\sqrt2}
\int_{|\omega|\le\Delta}d\omega e^{\beta\omega/4}\right)^4\|B\|_\rho^2
\le e^{\beta\Delta}\|B\|_\rho^2,
$$

其中使用 Lemma II.4。令

$$
\Delta=\max\left(\frac1\beta\log\frac{\|B\|}{\|B\|_\rho},\frac1{2d\beta^2}\right),
$$

并合并上述界，得到 Eq. (3.6)。

最后，两个断言 (3.5)、(3.6) 推出

$$
\frac{\|B\|_\tau}{\|B\|}
\le \left((1+e^{1/4d\beta})\left(\frac{\|B\|_\rho}{\|B\|}\right)^{1/2}
+(2+8|B|d\beta)^{8|B|d\beta}\left(\frac{\|B\|_\rho}{\|B\|}\right)^{1/8d\beta}\right)2^{2|B|}.
$$

由于 $\|B\|\le 2^{|B|}\|B\|_\tau$，假设 $\beta\ge1/4d$，得到

$$
\frac{\|B\|_\rho}{\|B\|}\ge e^{-80\beta|\operatorname{supp}(B)|-16d\beta\log(2d\beta)}.
$$

进一步地，因为 $\|B\|_\tau\le\|B\|$，引理随之成立。$\blacksquare$

一旦知道对每个量子比特 $i$ 上的局域 Pauli $A$，$\|[A,H-H']\|_\tau$ 很小，就可以通过直接计算看出 $H,H'$ 在 $i$ 附近彼此接近。

**Lemma III.7（局域良好系数）。** 考虑哈密顿量

$$
H=\sum_{\gamma\in\Gamma}h_\gamma P_\gamma,
\qquad
H'=\sum_{\gamma\in\Gamma}h'_\gamma P_\gamma,
$$

其中 $P_\gamma$ 是不同的 Pauli 串。如果对于特定量子比特 $i$ 上的每个单量子比特集合 $\{A^a\}=\{X_i,Y_i,Z_i\}$ 中的 $A$，都有

$$
\|[A,H-H']\|_\tau\le\epsilon,
$$

那么对每个作用在量子比特 $i$ 上的 $P_\gamma$，都有

$$
|h_\gamma-h'_\gamma|\le\epsilon.
$$

**证明。** 有

$$
\sum_{a=1,2,3}\|[A^a,H-H']\|_\tau^2
=\sum_{a=1,2,3}\frac1{2^n}\operatorname{Tr}[[A^a,H-H'][A^a,H-H']^\dagger]
$$

$$
=\sum_{a=1,2,3}\frac1{2^n}\operatorname{Tr}[[A^a,[A^a,H-H']](H-H')]
=8\sum_{\gamma\sim i}(h_\gamma-h'_\gamma)^2,
$$

其中使用双重对易子选出作用在该量子比特上的 Pauli 串：

$$
\sum_{a=1,2,3}[A^a,[A^a,H-H']]=8\sum_{\gamma\sim i}(h_\gamma-h'_\gamma)P_\gamma,
$$

并使用 Pauli 的正交性

$$
\frac1{2^n}\operatorname{Tr}[P_\gamma P_{\gamma'}^\dagger]=\delta_{\gamma,\gamma'}.
$$

这表明

$$
8\sum_{\gamma\sim i}(h_\gamma-h'_\gamma)^2\le3\epsilon^2,
$$

因此和式中每个 $\gamma$ 都满足 $|h_\gamma-h'_\gamma|\le\epsilon$。$\blacksquare$

# IV. 学习协议

在本节中，我们把可识别性观测量转化为局域学习算法。为了具体起见，我们假设哈密顿量项都是不同且已知的 Pauli 算子 $P_\gamma$：

$$
H=\sum_{\gamma\in\Gamma}h_\gamma
=\sum_{\gamma\in\Gamma}h_\gamma P_\gamma,
$$

并希望学习每个 $\gamma\in\Gamma$ 的未知参数 $h_\gamma\in[-1,1]$。在整个 Section IV 中，我们还把算子傅里叶变换中的不确定度设为

$$
\sigma=\frac1\beta,
$$

这看起来已经足够。为了简化计算，我们还常假设

$$
\beta\ge \frac1d.
$$

如果输入的 $\beta$ 太小，我们把哈密顿量项重标度为 $H\to cH$，使得上述条件成立；这可以避免在小 $\beta$ 区域重复类似论证。

受可识别性方程启发，我们首先定义一个观测量 $Q$，它将在学习协议中发挥关键作用。定量保证将依赖于该观测量的局域性与稳定性。

## A. 可识别性观测量 $Q$ 的鲁棒性

对我们的协议至关重要的是一个通过准局域测量刻画哈密顿量可识别性的量。回顾引言中的可识别性观测量：

$$
Q(O,G,A,K)=\frac1{\sqrt{2\pi}}\int_{-\infty}^{\infty}\int_{-\infty}^{\infty}
\operatorname{Tr}\!\left[
O_G^\dagger(t)\left(h_+(t')A_K(t'+t)\rho-h_-(t')\rho A_K(t'+t)\right)
\right]g_\beta(t)dt'dt,
$$

其中隐含地 $\rho\propto e^{-\beta H}$，而哈密顿量 $G$ 和 $K$ 先验上可以不等于 $H$。事实上，为了利用 Lemma III.1，我们并不先验知道真实值 $H$，所以还必须测试另一个哈密顿量 $G\ne H$。我们会看到：如果测试哈密顿量 $K$ 接近真实哈密顿量 $H$，那么该表达式很小；反过来，如果远离真实哈密顿量，则该表达式很大。我们先在存在远处扰动的情况下推导 $Q$ 的一些连续性性质。特别地，我们经常考虑类似于 $H_\ell$ 的截断：

$$
G=\sum_{\gamma\in\Gamma}g_\gamma,
\quad \|g_\gamma\|\le1,
\quad
G_\ell=\sum_{\gamma:\operatorname{dist}(\gamma,O)<\ell-1}g_\gamma,
$$

$$
K=\sum_{\gamma\in\Gamma}k_\gamma,
\quad \|k_\gamma\|\le1,
\quad
K_\ell=\sum_{\gamma:\operatorname{dist}(\gamma,A)<\ell-1}k_\gamma.
$$

对 $G',K'$ 以及 $G'_\ell,K'_\ell$ 也类似。现在，可识别性观测量 $Q$ 还依赖于任意算子 $A$ 和 $O$，但我们总是把它应用到单点 Pauli $A=\{X_i,Y_i,Z_i\}$ 和 $O\propto[A,P_\gamma]$ 上。

**Lemma IV.1（$Q$ 的鲁棒性）。** 考虑具有 Section II B 中相同相互作用图的哈密顿量 $G,G',K,K'$，满足

$$
\|g_\gamma\|,\|g'_\gamma\|,\|k_\gamma\|,\|k'_\gamma\|\le1,
\qquad
\|g_\gamma-g'_\gamma\|,\|k_\gamma-k'_\gamma\|\le\kappa,
$$

以及算子 $A,O$，满足 $\|A\|,\|O\|\le1$。假设 $\beta\ge1/d$。那么：

(A) 截断误差满足

$$
|Q(O,G,A,K)-Q(O,G_\ell,A,K_\ell)|
\lesssim
\frac{e^{\beta\Omega'/2}}{\sqrt\beta}
\left(e^{-\ell^2/16e^4d^2\beta^2}+e^{-\pi\ell/e^2d\beta}\right)(|O|+|A|).
$$

(B) 对于广延扰动，即所有距离 $O,A$ 不超过 $\ell_0$ 的 $\gamma$ 都满足 $g_\gamma=g'_\gamma,k_\gamma=k'_\gamma$，有

$$
|Q(O,G,A,K)-Q(O,G',A,K')|
\lesssim
\kappa\frac{e^{\beta\Omega'/2}}{\sqrt\beta}
\sum_{\ell=\ell_0}^{\infty}(S(\ell,A)+S(\ell,O))\left(\beta+\frac\ell d\right)
\left(e^{-\ell^2/16e^4d^2\beta^2}+e^{-\pi\ell/2e^2d\beta}\right).
$$

(C) 对于半径 $\ell_0$ 内的扰动，即所有距离 $O,A$ 为 $\ell_0$ 或更远的 $\gamma$ 都满足 $g_\gamma=g'_\gamma,k_\gamma=k'_\gamma$，有

$$
|Q(O,G,A,K)-Q(O,G',A,K')|
\lesssim
\frac{\kappa}{\sqrt\beta d}e^{\beta\Omega'/2}
\bigl(V(\ell_0,O)+V(\ell_0,A)\bigr).
$$

证明使用常规 Lieb-Robinson 论证，见 Appendix B 2。

**Remark IV.1.** 为了把哈密顿量学习到高精度，我们会利用表面积 $S(\ell)$ 随距离 $\ell$ 多项式增长这一事实。

## B. 测试哈密顿量的可识别性：存在性与唯一性

在这里，我们推导可识别性观测量的操作性质，这将帮助我们解释 $Q$ 的实验值。本质上，$Q$ 给出了识别一个局域猜测何时近似正确的唯一方式。事实上，作为一致性检验，把真实哈密顿量 $H$ 代入时，对任意 $G$ 都会得到消失的 $Q$。

**Lemma IV.2（全局完美猜测的存在性）。** 回顾真实 Gibbs 态

$$
\rho=e^{-\beta H}/\operatorname{Tr}(e^{-\beta H}).
$$

则可识别性观测量精确消失：

$$
Q(O,G,A,H)=0
$$

对每个哈密顿量 $G$ 以及 $O,A$ 成立。

**证明。** 如 Lemma III.4 的证明，对 $\rho'\propto e^{-\beta K}$，我们有精确恒等式

$$
Q(O,G,A,K)=\frac1{\sqrt{2\pi}}\int_{-\infty}^{\infty}
\operatorname{Tr}\!\left[
O_G^\dagger(t)
\int_{-\Omega'}^{\Omega'}
\left(\sqrt{\rho'}\widehat A_K(\omega')_K(t)\sqrt{\rho'^{-1}}\rho
-\rho\sqrt{\rho'^{-1}}\widehat A_K(\omega')_K(t)\sqrt{\rho'}\right)d\omega'
\right]g_\beta(t)dt.
$$

当 $K=H$ 时，$\rho'=\rho$，且对每个 $t,\omega'$，

$$
\sqrt{\rho'}\widehat A_K(\omega')_K(t)\sqrt{\rho'^{-1}}\rho
-\rho\sqrt{\rho'^{-1}}\widehat A(\omega')_K(t)\sqrt{\rho'}
=\sqrt\rho\widehat A_H(\omega')_H(t)\sqrt{\rho^{-1}}\rho
-\rho\sqrt{\rho^{-1}}\widehat A(\omega')_H(t)\sqrt\rho=0,
$$

如所宣称。$\blacksquare$

在我们的算法中，我们只在搜索半径 $\ell$ 内做局域猜测，并且必须通过引入一个 epsilon net 来离散化参数猜测 $k_\gamma$。对于标号为 $\gamma$ 的每个系数，考虑离散点集合

$$
N_\kappa\subset[-1,1]
$$

使得

$$
x\in[-1,1]\Longrightarrow |x-N_\kappa|\le\kappa.
$$

当然，可以选取这样的集合使得其基数为 $|N_\kappa|=\lceil2/\kappa\rceil$。我们将用撇号表示系数从 epsilon net 中选出的哈密顿量，例如 $G',K'$ 以及 $G'_\ell,K'_\ell$。

利用 $Q$ 的稳定性，以下引理说明一个局域正确的猜测也必须表现得像真实值。局域块越大，$Q$ 越好。

**Lemma IV.3（epsilon net 上良好局域哈密顿量的存在性）。** 假设 $\beta\ge1/d$。对每个满足 $\|A\|,\|O\|\le1$ 的 $A,O$，存在一个

$$
K'_\ell=\sum_\gamma k'_\gamma P_\gamma,
\qquad k'_\gamma\in N_\kappa,
$$

使得对每个

$$
G'_\ell=\sum_\gamma g'_\gamma P_\gamma,
\qquad g'_\gamma\in N_\kappa,
$$

可识别性观测量满足

$$
|Q(O,G'_\ell,A,K'_\ell)|
\lesssim \frac{e^{\beta\Omega'/2}}{\sqrt\beta}
\left(e^{-\pi\ell/e^2d\beta}+\kappa\beta(V(\ell,A)+V(\ell,O))\right).
$$

**证明。** 思路是取真实哈密顿量 $K=H$，局域化到 $K_\ell$，然后把它舍入到 epsilon net 上。由 $Q$ 的稳定性 Lemma IV.1 的 (A) 项，我们可以截断 $K\to K_\ell$：

$$
|Q(O,G,A,K_\ell)|\lesssim \frac1{\sqrt\beta}e^{\beta\Omega'/2}d e^{-\pi\ell/e^2d\beta}
$$

对任意 $G$ 成立，特别是对来自 epsilon net 的 $G'_\ell$ 成立。

接着，把哈密顿量 $H_\ell$ 舍入到 epsilon net。由 Lemma IV.1 的 (C) 项，

$$
|Q(O,G'_\ell,A,K_\ell)-Q(O,G'_\ell,A,K'_\ell)|
\lesssim \frac{\kappa}{\sqrt\beta d}e^{\beta\Omega'/2}(V(\ell,A)+V(\ell,O)).
$$

合并误差即可完成证明。$\blacksquare$

可识别性方程的显著特征是：一个能让 $Q$ 取得良好值的猜测 $H_\ell$ 必须简单地是局域正确的。

**Lemma IV.4（良好局域猜测的唯一性）。** 假设 $\beta\ge1/d$。对每个满足 $\|A\|,\|O\|\le1$ 的 $A,O$，假设存在一个

$$
H'=\sum_\gamma h'_\gamma P_\gamma
$$

使得对每个

$$
G'_\ell=\sum_\gamma g'_\gamma P_\gamma,
\qquad g'_\gamma\in N_\kappa,
$$

都有

$$
|Q(O,G'_\ell,A,H')|\le\epsilon.
$$

那么

$$
|\langle O,[A,H-H']\rangle_\rho|
\lesssim
\frac{e^{\beta\Omega'/2}}{\beta}de^{-\pi\ell/e^2d\beta}
+\beta e^{-\Omega'/4d}d^{4+16e^2d^4\beta^2}
+\frac\kappa d e^{\beta\Omega'/2}(V(\ell,O)+V(\ell,A))
+\frac\epsilon{\sqrt\beta}.
$$

**证明。** 由 Lemma III.4，

$$
\frac{\beta\sqrt{2\sigma\sqrt{2\pi}}}{2}\langle O,[A,H-H']\rangle_\rho
=Q(O,H,A,H')
+\frac\beta2\int_{|\omega'|\ge\Omega'}\langle O,[\widehat A_{H'}(\omega'),H-H']\rangle_\rho d\omega'.
$$

由 $Q$ 的稳定性，只改变 $H$ 参量时可适配 Lemma IV.1 的 (A) 项，并令算子傅里叶变换的 $\sigma=1/\beta$，得到

$$
|Q(O,H,A,H')|
\le |Q(O,H,A,H')-Q(O,H_\ell,A,H')|+|Q(O,H_\ell,A,H')|
\lesssim \frac{e^{\beta\Omega'/2}}{\sqrt\beta}d e^{-\pi\ell/e^2d\beta}+|Q(O,H_\ell,A,H')|.
$$

接着，使用 Lemma IV.1 的 (C) 项把 $H_\ell$ 舍入到 epsilon net。存在 $G'_\ell$ 使得

$$
|Q(O,H_\ell,A,H')-Q(O,G'_\ell,A,H')|
\le \frac{\kappa}{\sqrt\beta d}e^{\beta\Omega'/2}(V(\ell,O)+V(\ell,A)).
$$

再回顾高频部分的界 Lemma III.5，即可完成证明。$\blacksquare$

## C. 测量可识别性观测量

本节总结测量可识别性观测量的成本。由于局域性，论证是常规的，见 Appendix A。这里 $O(\cdot)$ 和 $\operatorname{poly}(\cdot)$ 压制对相互作用度 $d$ 和局域性 $q$ 的依赖。

**Lemma IV.5（测量单个 $Q$）。** 在有界度相互作用图上，见 Section II B，观测量

$$
Q(O,G'_\ell,A,K'_\ell),
$$

其中 $G'_\ell,K'_\ell$ 的系数取自 net $N_\kappa$，可以用

$$
O\!\left(\frac{e^{\beta\Omega'}\|A\|^2\|O\|^2}{\beta\epsilon^2}\log(1/\delta)\right)
$$

份 $\rho$，以概率 $1-\delta$ 测量到精度 $\epsilon$，并使用

$$
\operatorname{poly}\!\left(\beta,V(\ell),\log(1/\kappa\epsilon),\frac{e^{\beta\Omega'/2}}{\sqrt\beta}\|A\|\|O\|\right)\frac{\log(1/\delta)}{\epsilon^2}
$$

个作用在邻域 $V(\ell,O)\cup V(\ell,A)$ 上的基本量子门。

由于测量是局域的，只要理解这些观测量如何彼此重叠，我们就可以并行测量多个可识别性观测量 $Q$。样本复杂度、时间复杂度以及性能保证直接来自上述引理。

**Algorithm IV.1（测量所有 $Q$）。** 在有界度相互作用图上，见 Section II B，考虑一组可识别性观测量

$$
Q(O,G'_\ell,A,K'_\ell),
$$

其中 $A\in\{X_i,Y_i,Z_i\}$ 是单点 Pauli，$i\in\Lambda$，非零 $O=[A,P_\gamma]$，$\gamma\in\Gamma$，并且 $G'_\ell,K'_\ell$ 分别支撑在 $V(\ell,O),V(\ell,A)$ 上。令 $\chi-1$ 是与单个 $Q$ 重叠的 $Q$ 的最大数量。令 $\epsilon$ 为精度参数，$p_{\mathrm{fail}}$ 为期望失败概率。

1. **划分为不重叠子集。** 将 $S$ 划分为子集 $S_1,\ldots,S_\chi$，使得每个子集 $S_i$ 内的可识别性观测量 $Q$ 互不重叠。

2. **并行测量。** 对每个 $S_i$，以精度 $\epsilon$ 和 $\delta=p_{\mathrm{fail}}/|S|$ 并行执行 Lemma IV.5 中的算法，并输出该子集中每个 $Q$ 的估计 $Q_{\exp}$。

**复杂度。** 该算法使用

$$
O\!\left(\chi\frac{e^{\beta\Omega'}}{\beta\epsilon^2}\log(|S|/p_{\mathrm{fail}})\right)
$$

份 $\rho$，以及

$$
\operatorname{poly}\!\left(\beta,V(\ell),\log\frac1{\kappa\epsilon},\frac{e^{\beta\Omega'/2}}{\sqrt\beta}\right)
\frac{|S|\log(|S|/p_{\mathrm{fail}})}{\epsilon^2}
$$

个基本量子门和经典处理时间。

**保证。** 以概率 $1-p_{\mathrm{fail}}$，对每个 $Q(O,G'_\ell,A,K'_\ell)\in S$，步骤 2 返回的对应估计满足

$$
|Q_{\exp}(O,G'_\ell,A,K'_\ell)-Q(O,G'_\ell,A,K'_\ell)|\le\epsilon.
$$

## D. 用于任意连通性的哈密顿量的简单局域学习算法

现在，我们准备给出一个用于任意有界相互作用度 $d$ 的相互作用图上的量子 Gibbs 态的局域学习算法。在 Section IV D 中，$O(\cdot)$ 压制对几何结构，也就是度界 $d$ 和局域性 $q$ 的依赖。我们引入适当的绝对常数 $c_1,c_2,c_3$，使得后续计算中的误差分析可以严格由“$\le$”控制，而不是 $\lesssim$。

**Condition IV.1.** 假设 $\beta\ge1/d$。在 Section IV D 中，我们设定如下参数。对于目标精度 $\epsilon$、辅助参数

$$
\alpha=2d e^{200(d+q)\beta\log(d\beta)},
$$

以及可调绝对常数 $c_1\le c_2\le c_3$，设：

- **频率截断：**

$$
e^{\Omega'/4d}=c_1\cdot 5\beta d^{4+16e^2d^4\beta^2}\alpha/\epsilon^2
\Longrightarrow \Omega'=O(\beta^2+\log(1/\epsilon)).
$$

- **搜索截断半径：**

$$
\ell=c_2\cdot10d\beta(\beta\Omega'+\log(5\alpha/\beta\epsilon^2))
\Longrightarrow \ell=O(\beta^4+\beta\log(1/\epsilon)).
$$

- **epsilon net 精度：**

$$
\kappa=\frac{\epsilon^2}{c_3\cdot40\alpha}e^{-\beta\Omega'/2}\sqrt\beta d^{-\ell-3}
\Longrightarrow \kappa=\epsilon^{2+O(\beta)}2^{-O(\beta^4)}.
$$

该算法非常直接：对于每个局域项，我们在局域邻域中搜索，并返回一组使可识别性观测量在任意局域测试哈密顿量 $G$ 下最小的系数赋值。

**Algorithm IV.2（局域地学习每个局域项）。** 考虑具有有界度相互作用图的哈密顿量，见 Section II B，并以每个 $h_\gamma$ 的误差预算 $\epsilon$ 为目标。

1. **并行测量。** 执行实验 Algorithm IV.1，以精度 $\epsilon^2\sqrt\beta/20\alpha$ 和失败概率 $1-p_{\mathrm{fail}}$，测量所有观测量

$$
Q_{\exp}([A,P_\gamma],G'_\ell,A,K'_\ell)
$$

其输入遍历 $i\in\Lambda$，$A\in\{X_i,Y_i,Z_i\}$，$\gamma:\gamma\sim i$，以及 $G'_\ell,K'_\ell\in N_\kappa$。

2. **识别局域项。** 对每个 $i\in\Lambda$：

   - 识别使所有 $A,\gamma,G'_\ell$ 下最弱的 $Q$ 达到最小的哈密顿量 $K'_\ell$ 的参数：

$$
\min_{K'_\ell}\max_{A,\gamma,G'_\ell}|Q_{\exp}([A,P_\gamma],G'_\ell,A,K'_\ell)|.
$$

   - 记录 $K'_\gamma$ 中作用在量子比特 $i$ 上的项，并设

$$
h'_\gamma\leftarrow k'_\gamma.
$$

3. 返回系数集合 $\{h'_\gamma\}_{\gamma\in\Gamma}$。

**Remark IV.2.** 当我们扫过 $\gamma$ 附近的不同站点 $i$ 时，同一个系数 $h_\gamma$ 可能被更新多次。事实上，任何这样的 $h'_\gamma$ 都保证接近真实值，因此我们只需返回其中任意一个。我们也会丢弃 $K'_\ell$ 中不作用在给定站点 $i$ 上的大块部分。

**Theorem IV.1（局域地学习量子 Gibbs 态 - Thm I.1）。** 考虑逆温度 $\beta$ 下常数局域性 $q$ 且相互作用度有界为 $d$ 的哈密顿量 $H$ 的 Gibbs 态 $\rho_\beta$，见 Section II B。使用 Condition IV.1 中的参数，Algorithm IV.2 以概率 $1-p_{\mathrm{fail}}$ 学习到真实 $H$ 的一个近似 $H'$，满足

$$
|h_\gamma-h'_\gamma|\le\epsilon
\quad\text{for all }\gamma\in\Gamma,
$$

并使用

$$
O\!\left(2^{2^{O(\beta^4)}\operatorname{poly}(1/\epsilon\beta)}\log(n/p_{\mathrm{fail}})\right)
$$

份 $\rho$，以及

$$
O\!\left(n\cdot2^{2^{O(\beta^4)}\operatorname{poly}(1/\epsilon\beta)}\log(n/p_{\mathrm{fail}})\right)
$$

运行时间。此外，它在至多

$$
2^{O(\beta^4+\max(\beta,1/d)\log(1/\epsilon))}
$$

个量子比特上执行相干量子测量。

关于精度 $1/\epsilon$ 的依赖是指数的，源自扩展图上半径 $\sim\log(1/\epsilon)$ 的体积。尽管如此，对于任意常数 $\epsilon$，我们只需搜索常数大小的邻域，并且每个搜索都完全独立于其他搜索。

**证明。** 我们分别考虑精度、样本复杂度和运行时间。

**精度保证。** 对于每个站点 $i\in\Lambda$，根据 Lemma IV.3，存在猜测哈密顿量 $K'_\ell$，使得对所有 Pauli $A\in\{X_i,Y_i,Z_i\}$、$\gamma\sim A$ 对应的项 $O=[A,P_\gamma]$，以及哈密顿量 $G'_\ell$，有

$$
|Q(O,G'_\ell,A,K'_\ell)|
\lesssim \frac{e^{\beta\Omega'/2}}{\sqrt\beta}
\left(de^{-\pi\ell/e^2d\beta}+\frac{\kappa\beta}{d}(V(\ell,A)+V(\ell,O))\right).
$$

利用 Condition IV.1 的参数设定并取足够大的 $c_1\le c_2\le c_3$，有

$$
|Q(O,G'_\ell,A,K'_\ell)|\le\epsilon^2\sqrt\beta/10\alpha.
$$

因此，算法步骤 2 返回的 $K'_\ell$ 满足

$$
|Q([A,P_\gamma],G'_\ell,A,K'_\ell)|\le\epsilon^2\sqrt\beta/5\alpha
$$

对每个 $A,\gamma,G'_\ell$ 成立。Lemma IV.4 随后推出

$$
|\langle O,[A,H-K'_\ell]\rangle_\rho|
\lesssim
\frac{e^{\beta\Omega'/2}}{\beta}e^{-\pi\ell/e^2d\beta}
+\beta e^{-\Omega'/4d}d^{4+16e^2d^4\beta^2}
+\frac\kappa d e^{\beta\Omega'/2}(V(\ell,O)+V(\ell,A))
+\epsilon^2/5\alpha.
$$

利用 Condition IV.1 的参数设定以及足够大的 $c_1\le c_2\le c_3$，更具体地，我们先选择 $c_1$，再选择 $c_2$，最后选择 $c_3$，得到

$$
|\langle O,[A,H-K'_\ell]\rangle_\rho|
\le \epsilon^2/5\alpha+\epsilon^2/5\alpha+\epsilon^2/5\alpha+\epsilon^2/5\alpha
\le \epsilon^2/\alpha.
$$

此外，

$$
e^{-200(d+q)\beta\log(d\beta)}\|[A,H-H']\|_\tau^2
\le \|[A,H-K'_\ell]\|_\rho^2
\le 2d\langle [A,H-(H_0+\eta U'_{\ell_0})],O\rangle_\rho,
$$

其中第一个不等式使用 Lemma III.6 和假设 $\beta d\ge1$。因此由 Lemma III.7，对每个 $i$ 和 $\gamma\sim i$，有

$$
|h_\gamma-h'_\gamma|
\le e^{100(d+q)\beta\log(d\beta)}\sqrt{2d\epsilon^2/\alpha}
\le\epsilon.
$$

**样本复杂度。** 我们希望测量 $Q(O,G'_\ell,A,K'_\ell)$，其中每个单点 Pauli $A\in\{X_i,Y_i,Z_i\}$，$\forall i$，每个 $O=[A,P_\gamma]$，并且对应的 $G'_\ell,K'_\ell$ 来自 net $N_\kappa$。$(A,O)$ 对有 $3nd$ 种选择；对每个这样的选择，$K'_\ell$ 有 $\lceil2/\kappa\rceil^{V(\ell)}$ 种选择，$G'_\ell$ 有 $\lceil2/\kappa\rceil^{V(\ell)d}$ 种选择，因此总计至多

$$
3nd\lceil2/\kappa\rceil^{V(\ell)(d+1)}
=O\left(n\cdot2^{2^{O(\beta^4)}\operatorname{poly}(1/\epsilon)}\right)
$$

个算子 $Q(O,G'_\ell,A,K'_\ell)$ 需要被测量。我们可以同时测量其中大量算子，因为每个 $Q(O,G'_\ell,A,K'_\ell)$ 至多与

$$
\chi\le (d+1)V(2\ell)\lceil2/\kappa\rceil^{V(\ell)(d+1)}
=2^{2^{O(\beta^4)}\operatorname{poly}(1/\epsilon)}
$$

个其他算子重叠。因此，测量的样本复杂度 Algorithm IV.1 为

$$
O\!\left(\chi\cdot\frac{e^{\beta\Omega'}}{\beta(\sqrt\beta\epsilon^2/20\alpha)^2}
\log\left(O\left(n\cdot2^{2^{O(\beta^4)}\operatorname{poly}(1/\epsilon)}\right)/p_{\mathrm{fail}}\right)\right)
$$

$$
=O\!\left(2^{2^{O(\beta^4)}\operatorname{poly}(1/\epsilon)}\log(n/p_{\mathrm{fail}})\right).
$$

**运行时间。** 直接代入 Condition IV.1 中的参数，得到运行时间

$$
O\left(n\cdot2^{2^{O(\beta^4)}\operatorname{poly}(1/\epsilon)}\right)\cdot\log(n/p_{\mathrm{fail}}).
$$

**自举到 $\beta<1/d$ 的情形。** 如前所述，在这种情况下可以重标度 $\beta\leftarrow1/d$ 和 $h_\gamma\leftarrow h_\gamma\cdot\beta d$。我们应用与上面相同的算法，并把精度重新定义为 $\epsilon\leftarrow\epsilon\cdot\beta d$。$\blacksquare$

## E. 用于 $D$ 维格点的高效高精度学习算法

我们已经看到，为了把每个局域系数 $h_\gamma$ 学习到常数误差 $\epsilon=0.1$，只需在常数半径内搜索项。然而，在更高精度 $\epsilon\ll1$ 下，由于高度连通图上 Lieb-Robinson bounds 的衰减率，算法成本会超多项式恶化。在本节中，我们展示如何在 $D$ 维格点的情形中，通过更精细的 Lieb-Robinson bounds 局域性估计显著改进误差依赖，见 Section II B。

假设我们已经对每个局域系数达到不错的常数精度，例如误差为 $0.1$。也就是说，我们知道真实值 $H$ 满足

$$
H=H_0+\eta V,
$$

其中 $H_0$ 是当前猜测，$V$ 是一个未知哈密顿量，具有相同相互作用图，并且每项满足 $\|V_\gamma\|\le1$。现在，我们希望学习更多关于 $V$ 的信息，并把学习误差提升到 $\eta/2$。于是，在新的猜测 $H_0+\eta U$ 中，我们不仅具有更小的参数空间来搜索 $U$，而且还预期可识别性观测量 $Q$ 对更近的项最敏感。基于这个直觉，我们提出一个迭代地使精度翻倍的学习过程，见 Figure 2。关键地，在每个学习迭代中，搜索半径 $\ell_0$ 可以选择为与目标学习误差 $\epsilon$ 无关，而只依赖于几何结构。考虑 $Q(O,G,A,K)$ 和 $Q(O,G',A,K')$，其输入为

$$
G=H_0+\eta W,
\qquad
K=H_0+\eta U,
$$

$$
G'=H_0+\eta W_{\ell_0},
\qquad
K'=H_0+\eta U_{\ell_0}.
$$

那么，通过选择只依赖于 $\beta$ 和相互作用几何的合适搜索半径 $\ell_0$，截断误差将只贡献目标误差 $\eta/2$ 的一个小比例，由 Lemma IV.1 的 (B) 项：

$$
|Q(O,G,A,K)-Q(O,G',A,K')|
\lesssim \eta\frac{e^{\beta\Omega'/2}}{\sqrt\beta}
\sum_{\ell=\ell_0}^{\infty}(S(\ell,A)+S(\ell,O))
\left(\beta+\frac\ell d\right)
\left(e^{-\ell^2/16e^4d^2\beta^2}+e^{-\pi\ell/2e^2d\beta}\right)
$$

$$
=(\text{small factor independent of }\eta)\cdot\eta/2.
$$

**Remark IV.3.** 在扩展图上，表面积按 $\sim d^{\ell+1}$ 缩放，这在低温下比 $e^{-\pi\ell/2e^2\beta}$ 增长得更快，上述右端作为上界是空泛的，因此我们限制到格点。使用类似迭代方法为一般图获得近最优学习算法是一个有趣问题。

因此，我们实际上把问题归约为：在半径 $\ell_0$ 内搜索 $U_{\ell_0}$，使得对于所有形如 $G'=H_0+\eta W_{\ell_0}$ 的 $G'$，$Q(O,G',A,K')$ 都是 $\eta$ 的一个比例。更精确地，令

$$
U_{\ell_0}=\sum_{\gamma:\operatorname{dist}(\gamma,A)<\ell_0-1}u_\gamma P_\gamma,
\qquad
W_{\ell_0}=\sum_{\gamma:\operatorname{dist}(\gamma,O)<\ell_0-1}w_\gamma P_\gamma.
$$

参数 $u_\gamma,w_\gamma$ 在常数精度 $\kappa_0$ 的离散 epsilon net $N_{\kappa_0}$ 上搜索。

为方便记账，我们展示本节参数选择如下；它们全都与系统大小 $n$ 和误差 $\epsilon$ 无关。在当前 Section IV E 中，$O(\cdot)$ 压制对几何结构，也就是格点维数 $D$、度界 $d$ 和局域性 $q$ 的依赖。我们引入只依赖于 $D,q,d$ 的适当常数 $c_1,c_2,c_3$，使得后续计算中的误差分析可以严格由“$\le$”控制，而不是 $\lesssim$。

**Condition IV.2.** 假设 $\beta\ge1/d$。在 Section IV E 的其余部分，我们设定如下参数。令

$$
\alpha=2d e^{200(d+q)\beta\log(d\beta)}
$$

为辅助参数。对可调常数 $c_1\ll c_2\ll c_3$，这些常数可以依赖于 $D,d,q$，设：

- **频率截断：**

$$
e^{\Omega'/4d}=c_1\cdot\beta d^{4+16e^2d^4\beta^2}\alpha
\Longrightarrow \Omega'=O(\beta^2).
$$

- **搜索截断半径：**

$$
\ell_0=c_2\cdot100D!d\beta(\beta\Omega'+\log(\alpha/\beta))
\Longrightarrow \ell_0=O(\beta^4).
$$

- **epsilon net 精度：**

$$
\kappa_0=\frac1{c_3\cdot\alpha}\ell_0^{-D-2}e^{-\beta\Omega'/2}
\Longrightarrow \kappa_0=e^{-O(\beta^3)}.
$$

### 1. 扰动下测试哈密顿量的存在性与唯一性

这里，我们推导 $Q$ 的存在性与唯一性性质的类似版本，见 Section IV B，但假设猜测已经相当好。我们只要求这些界是 $\eta$ 的一个比例，因此更小的搜索半径就足够。

**Lemma IV.6（epsilon net 上良好局域猜测 $U_{\ell_0}$ 的存在性）。** 假设 $\beta\ge1/d$。考虑 Condition IV.2 中的参数选择。对每个满足 $\|A\|,\|O\|\le1$ 的 $A,O$，存在

$$
U'_{\ell_0}=\sum_{\gamma:\operatorname{dist}(\gamma,A)<\ell}u'_\gamma P_\gamma,
\qquad u'_\gamma\in N_{\kappa_0},
$$

使得对每个

$$
W'_{\ell_0}=\sum_{\gamma:\operatorname{dist}(\gamma,O)<\ell}w'_\gamma P_\gamma,
\qquad w'_\gamma\in N_{\kappa_0},
$$

可识别性观测量满足

$$
Q(O,H_0+\eta W'_{\ell_0},A,H_0+\eta U'_{\ell_0})\le \frac{\eta\sqrt\beta}{20\alpha}.
$$

**证明。** 证明类似于 Lemma IV.3 的证明。首先，存在全局 $V$ 使得 $H_0+\eta V=H$，因此由于 Lemma IV.2，对每个 $O,G,A$，都有 $Q(O,G,A,H_0+\eta V)=0$。接着，Lemma IV.1 的 (B) 项以及截断半径 $\ell_0$ 保证

$$
|Q(O,G,A,H_0+\eta V)-Q(O,G,A,H_0+\eta V_{\ell_0})|
$$

$$
\lesssim \eta\frac{e^{\beta\Omega'/2}}{\sqrt\beta}
\sum_{\ell=\ell_0}^{\infty}(S(\ell,A)+S(\ell,O))\left(\beta+\frac\ell d\right)
\left(e^{-\ell^2/16e^4d^2\beta^2}+e^{-\pi\ell/2e^2d\beta}\right)
$$

$$
\lesssim \eta\frac{e^{\beta\Omega'/2}}{\sqrt\beta}
\sum_{\ell=\ell_0}^{\infty}O(\ell^{D-1})\left(\beta+\frac\ell d\right)
\left(e^{-\ell^2/16e^4d^2\beta^2}+e^{-\pi\ell/2e^2d\beta}\right)
$$

$$
\le O(1)\cdot\eta\frac{e^{\beta\Omega'/2}}{\sqrt\beta}
\left(\frac{\pi\ell_0D!}{2e^2}\right)^D e^{-\pi\ell_0/2e^2d\beta}
\quad(\text{assuming }\ell_0\ge100D!d\beta)
$$

$$
\le O(1)\cdot\frac{\eta\sqrt\beta}{40\alpha},
$$

这对每个 $G$ 成立，包括来自 net $N_{\kappa_0}$ 的 $H_0+\eta W'_{\ell_0}$。最后，我们使用 Lemma IV.1 的 (C) 项把上述 $V_{\ell_0}$ 舍入到 epsilon net，以获得 $U'_{\ell_0}$，使得

$$
Q(O,G,A,H_0+\eta U_{\ell_0})-Q(O,G,A,H_0+\eta U'_{\ell_0})
\lesssim \frac{\eta\kappa_0}{\sqrt\beta d}e^{\beta\Omega'/2}(V(\ell_0,O)+V(\ell_0,A))
$$

$$
\le O(1)\frac{\eta\kappa_0}{\sqrt\beta d}e^{\beta\Omega'/2}\ell_0^{D+1}
\le O(1)\cdot\eta\sqrt{\beta/40\alpha}.
$$

对于任意固定的 $c_1$，也就是固定的 $\Omega'$，我们可以选择 Condition IV.2 中的常数 $c_2\ll c_3$ 足够大，先选择 $c_2\gg c_1$，再选择 $c_3\gg c_2$，使得上述界中的 $\lesssim$ 可以替换为适当的 $\le$。最后，合并误差项即可完成证明。$\blacksquare$

**Lemma IV.7（KMS-局域可识别性）。** 假设 $\beta\ge1/d$。在与 Lemma IV.6 相同的设置下，假设存在一个来自 epsilon net $N_{\kappa_0}$ 的局域猜测 $U'_{\ell_0}$，使得对每个 $W'_{\ell_0}$，都有

$$
Q(O,H_0+\eta W'_{\ell_0},A,H_0+\eta U'_{\ell_0})\le \eta\sqrt\beta/10\alpha.
$$

那么

$$
\langle O,[A,H-(H_0+\eta U'_{\ell_0})]\rangle_\rho\le \eta/5\alpha.
$$

**证明。** 回顾 Lemma III.4，并且可写 $H=H_0+\eta V$：

$$
\frac{\beta\sqrt{2\sigma\sqrt{2\pi}}}{2}
\langle O,[A,H-(H_0+\eta U'_{\ell_0})]\rangle_\rho
=Q(O,H,A,H_0+\eta U'_{\ell_0})
+\frac{\eta\beta}{2}\int_{|\omega'|\ge\Omega'}\langle O,[\widehat A_{H'}(\omega'),V-U'_{\ell_0}]\rangle_\rho d\omega'.
$$

高频部分可以用 Lemma III.5 界定；特别地，使用 Condition IV.2 中的 $\Omega'$ 选择，它由

$$
\frac{\eta\beta}{2}\int_{|\omega'|\ge\Omega'}\langle O,[\widehat A_{H'}(\omega'),V-U'_{\ell_0}]\rangle_\rho d\omega'
\le O(1)\cdot \eta\beta^{3/2}e^{-\Omega'/4d}d^{4+16e^2d^4\beta^2}
\le O(1)\cdot \eta\sqrt\beta/30\alpha
$$

界定。我们可以把 Condition IV.2 中的常数 $c_1$ 选得足够大，从而得到适当的 $\le$ 界：

$$
\frac{\eta\beta}{2}\int_{|\omega'|\ge\Omega'}\langle O,[\widehat A_{H'}(\omega'),V-U'_{\ell_0}]\rangle_\rho d\omega'
\le \eta\sqrt\beta/30\alpha.
$$

接着，使用 Lemma IV.1 的 (B) 项及 Condition IV.2 中的截断半径 $\ell_0$，为简洁起见令 $H'=H_0+\eta U'_{\ell_0}$，有

$$
|Q(O,H_0+\eta V,A,H')|
\le |Q(O,H_0+\eta V,A,H')-Q(O,H_0+\eta V_{\ell_0},A,H')|
+|Q(O,H_0+\eta V_{\ell_0},A,H')|
$$

$$
\le O(1)\cdot\eta\sqrt\beta/30\alpha+|Q(O,H_0+\eta V_{\ell_0},A,H')|,
$$

其中第二行使用 Lemma IV.1 的 (B) 项：

$$
|Q(O,H_0+\eta V,A,H')-Q(O,H_0+\eta V_{\ell_0},A,H')|
$$

$$
\lesssim \eta\frac{e^{\beta\Omega'/2}}{\sqrt\beta}
\sum_{\ell=\ell_0}^{\infty}(S(\ell,A)+S(\ell,O))\left(\beta+\frac\ell d\right)
\left(e^{-\ell^2/16e^4d^2\beta^2}+e^{-\pi\ell/2e^2d\beta}\right)
$$

$$
\le O(1)\cdot \eta\frac{e^{\beta\Omega'/2}}{\sqrt\beta}
\sum_{\ell=\ell_0}^{\infty}\ell^{D-1}\left(\beta+\frac\ell d\right)
\left(e^{-\ell^2/16e^4d^2\beta^2}+e^{-\pi\ell/2e^2d\beta}\right)
$$

$$
\le O(1)\cdot\eta\frac{e^{\beta\Omega'/2}}{\sqrt\beta}
\left(\frac{\pi\ell_0D!}{2e^2}\right)^D e^{-\pi\ell_0/2e^2d\beta}
\quad(\text{assuming }\ell_0\ge100D!d\beta)
$$

$$
\le O(1)\cdot\eta\sqrt\beta/30\alpha.
$$

对于固定的 $\Omega'$，我们可以选择 Condition IV.2 中 $c_2\gg c_1$ 足够大，从而获得适当的 $\le$ 界：

$$
|Q(O,H_0+\eta V,A,H')|
\le \eta\sqrt\beta/30\alpha+|Q(O,H_0+\eta V_{\ell_0},A,H')|.
$$

最后使用 Lemma IV.1 的 (C) 项，把 $V_{\ell_0}$ 舍入到 epsilon net。存在来自 net $N_{\kappa_0}$ 的 $W'_{\ell_0}$，使得

$$
Q(O,H_0+\eta V_{\ell_0},A,H')-Q(O,H_0+\eta W'_{\ell_0},A,H')
\lesssim \frac{\eta\kappa_0}{\sqrt\beta d}e^{\beta\Omega'/2}(V(\ell_0,O)+V(\ell_0,A))
$$

$$
\le O(1)\frac{\eta\kappa_0}{\sqrt\beta d}e^{\beta\Omega'/2}\ell_0^{D+1}
\le O(1)\cdot\eta\sqrt\beta/30\alpha.
$$

对于固定的 $\Omega',\ell_0$，我们可以选择 Condition IV.2 中 $c_3\gg c_2$ 足够大，从而获得

$$
Q(O,H_0+\eta V_{\ell_0},A,H')-Q(O,H_0+\eta W'_{\ell_0},A,H')
\le \eta\sqrt\beta/30\alpha.
$$

最后，合并误差项：

$$
\frac{\sqrt{2\beta\sqrt{2\pi}}}{2}|\langle O,[A,H-(H_0+\eta U'_{\ell_0})]\rangle_\rho|
\le \eta\sqrt\beta/10\alpha,
$$

整理即可完成证明。$\blacksquare$

### 2. 算法

现在，我们描述一个迭代步骤，它使用准局域测量和局域搜索，把当前误差 $\eta$ 降低到 $\eta/2$。与非迭代算法 Algorithm IV.2 的主要区别是：现在已经给定一个好猜测 $H_0$，并且我们在一次迭代中只追求精度翻倍。虽然测量仍涉及大小为 $\log^D(1/\epsilon)$ 的邻域，但我们只在背景 $H_0$ 之上，在一个小得多的半径 $\ell_0$ 内改变哈密顿量。

**Algorithm IV.3（$D$ 维格点上的一次迭代步骤）。** 考虑逆温度 $\beta$ 下 $D$ 维哈密顿量 $H$ 的 Gibbs 态 $\rho$，见 Section II B。假设真实值满足

$$
H=H_0+\eta V,
$$

其中

$$
H_0=\sum_{\gamma\in\Gamma}h_{0,\gamma}P_\gamma
$$

已知，而未知 $V$ 与 $H$ 具有相同相互作用图，并且每项满足 $\|V_\gamma\|\le1$。

1. **定义可识别性观测量。** 根据 Condition IV.2 设置 $\Omega',\ell_0,\kappa_0$。对每个站点 $i\in\Lambda$，以及 $A\in\{X_i,Y_i,Z_i\}$ 和相邻项 $\gamma:\gamma\sim i$：

   - 考虑形如

$$
G'=H_0+\eta W'_{\ell_0},
\qquad
K'=H_0+\eta U'_{\ell_0}
$$

的哈密顿量，其中 $W'_{\ell_0}$ 和 $U'_{\ell_0}$ 分别是支撑在 $V(\ell_0+1,A)$ 和 $V(\ell_0,A)$ 上的哈密顿量，其系数取自 net $N_{\kappa_0}$。

   - 取截断半径

$$
\ell=O(\beta^2\Omega'+\beta\log(\alpha/\sqrt{\beta}\eta))
=O(\beta^4+\beta\log(1/\eta)),
$$

并考虑 $G'\to G'_\ell,K'\to K'_\ell$。

2. **并行测量。** 执行实验 Algorithm IV.1，以误差

$$
\epsilon=\sqrt\beta\eta/80\alpha
$$

和失败概率 $p_{\mathrm{fail}}$，测量所有上述定义的观测量：

$$
Q_{\exp}([A,P_\gamma],G'_\ell,A,K'_\ell)
$$

输入遍历 $i\in\Lambda$，$A\in\{X_i,Y_i,Z_i\}$，$\gamma:\gamma\sim i$，以及 $W'_{\ell_0},U'_{\ell_0}\in N_{\kappa_0}$。

3. **识别局域项。** 对每个站点 $i$：

   - 返回使所有 $A,\gamma,G'_\ell$ 下最弱 $Q$ 达到最小的哈密顿量 $U'_{\ell_0}$ 的参数：

$$
\min_{U'_{\ell_0}}\max_{A,\gamma,W'_{\ell_0}}|Q_{\exp}([A,P_\gamma],G'_\ell,A,K'_\ell)|.
$$

   - 记录 $U'_{\ell_0}$ 中作用在量子比特 $i$ 上的哈密顿量项，并设

$$
h'_\gamma\leftarrow h_{0,\gamma}+\eta u_\gamma.
$$

4. 返回系数集合 $\{h'_\gamma\}_{\gamma\in\Gamma}$。

与精度无关的搜索半径显著减少了搜索空间，并改进了算法成本。

**Theorem IV.2（每次学习迭代的成本）。** 假设 $\beta\ge1/d$。以概率 $1-p_{\mathrm{fail}}$，Algorithm IV.3 从 $H$ 的系数输出误差为 $\eta/2$ 的哈密顿量 $H'$ 的系数，使用

$$
O\!\left(\frac{e^{O(\beta^{cD})}}{\eta^2}\log^D(1/\eta)\log(n/p_{\mathrm{fail}})\right)
$$

份 $\rho$，以及

$$
O\!\left(n\log(n/p_{\mathrm{fail}})\cdot\frac{e^{O(\beta^{c'D})}}{\eta^2}\log_D^{c''}(1/\eta)\right)
$$

运行时间，包括量子门数和经典处理。此外，它只涉及至多

$$
O\bigl((\beta^4+\beta\log(1/\epsilon))^D\bigr)
$$

个量子比特上的相干量子测量。这里 $c,c',c''$ 是绝对常数。

**证明。** 我们分别考虑精度、样本复杂度和运行时间。

**精度保证。** 考虑站点 $i\in\Lambda$，Pauli $A\in\{X_i,Y_i,Z_i\}$，以及 $\gamma\sim i$ 的项 $O=[A,P_\gamma]$。对于猜测哈密顿量

$$
G'=H_0+\eta W'_{\ell_0},
\qquad
K'=H_0+\eta U'_{\ell_0},
$$

及其截断版本 $G'_\ell,K'_\ell$，根据 Lemma IV.1 的 (A) 项，

$$
|Q(O,G',A,K')-Q(O,G'_\ell,A,K'_\ell)|
\lesssim \frac{e^{\beta\Omega'/2}}{\sqrt\beta}
\left(e^{-\ell^2/16e^4d^2\beta^2}+e^{-\pi\ell/e^2d\beta}\right)
\lesssim \sqrt{\beta}\eta/80\alpha.
$$

把

$$
\ell=O(\beta^4+\beta\log(1/\eta))
$$

中的常数选得足够大，我们得到适当的界

$$
|Q(O,G',A,K')-Q(O,G'_\ell,A,K'_\ell)|\le \sqrt\beta\eta/80\alpha. \tag{4.1}
$$

此外，Algorithm IV.1 保证，以至少 $1-p_{\mathrm{fail}}$ 的概率，实验估计满足

$$
|Q_{\exp}([A,P_\gamma],G'_\ell,A,K'_\ell)-Q(O,G'_\ell,A,K'_\ell)|\le \sqrt\beta\eta/80\alpha. \tag{4.2}
$$

结合 (4.1)、(4.2) 与 Lemma IV.6，推出以概率 $1-p_{\mathrm{fail}}$，Algorithm IV.3 步骤 1 返回的 $U'_{\ell_0}$ 满足

$$
Q([A,P_\gamma],H_0+\eta W'_{\ell_0},A,H_0+\eta U'_{\ell_0})
\le \eta\sqrt\beta/10\alpha
$$

对每个 $A,\gamma,W'_{\ell_0}$ 成立。于是 Lemma IV.7 推出

$$
\max_{O=[A,P_\gamma]}\langle[A,H-(H_0+\eta U'_{\ell_0})],O\rangle_\rho\le \eta/5\alpha. \tag{4.3}
$$

另外回顾

$$
\|[A,H-(H_0+\eta U'_{\ell_0})]\|_\rho^2
\le 2d\eta\max_{O=[A,P_\gamma]}\langle[A,H-(H_0+\eta U'_{\ell_0})],O\rangle_\rho. \tag{4.4}
$$

现在，把 KMS 范数转换为局域系数误差。合并 (4.3)、(4.4)，对作用在量子比特 $i$ 上的每个项 $\gamma$ 和 $A\in\{X_i,Y_i,Z_i\}$，得到

$$
\|[A,H-H']\|_\tau
\le e^{100(d+q)\beta\log(d\beta)}\|[A,H-H']\|_\rho
$$

其中使用 Lemma III.6 和 $\beta d\ge1$，进一步

$$
\le e^{100(d+q)\beta\log(d\beta)}\eta\sqrt{2d/5\alpha}.
$$

由 Lemma III.7，得到

$$
|h_\gamma-(h_{0,\gamma}+\eta u_\gamma)|\le\eta/2.
$$

**样本复杂度。** 我们希望测量 $Q(O,G'_\ell,A,K'_\ell)$，其中每个单点 Pauli $A\in\{X_i,Y_i,Z_i\}$，$\forall i$，每个 $O=[A,P_\gamma]$，并且对应的 $W'_{\ell_0},U'_{\ell_0}$ 来自 net $N_{\kappa_0}$。$(A,O)$ 对有 $3nd$ 种选择；对每个这样的选择，$U'_{\ell_0}$ 有 $(2/\kappa_0)^{V(\ell_0)}$ 种选择，$W'_{\ell_0}$ 有 $(2/\kappa_0)^{dV(\ell_0)}$ 种选择，因此总计至多

$$
|S|=3nd(2/\kappa_0)^{V(\ell_0)(d+1)}=n\cdot e^{O(\beta^{cD})}
$$

个算子 $Q(O,G'_\ell,A,K'_\ell)$ 需要测量。此外，每个 $Q(O,G'_\ell,A,K'_\ell)$ 至多与

$$
\chi=(d+1)V(2\ell)(2/\kappa_0)^{V(\ell_0)(d+1)}
=e^{O(\beta^{cD})}\log^D(1/\eta)
$$

个其他算子重叠。这里 $c$ 是绝对常数。因此，Algorithm IV.1 所需样本复杂度为

$$
O\!\left(\chi\frac{e^{\beta\Omega'/2}}{\sqrt\beta(\sqrt\beta\eta/80\alpha)^2}
\log(n\cdot e^{O(\beta^{cD})}/p_{\mathrm{fail}})\right)
=\frac{e^{O(\beta^{cD})}}{\eta^2}\log^D(1/\eta)\log(n/p_{\mathrm{fail}}).
$$

**运行时间。** 直接代入 Condition IV.2 中的参数和测量截断半径

$$
\ell=O(\beta^4+\beta\log(1/\eta)),
$$

得到时间复杂度

$$
|S|\operatorname{poly}\!\left(\beta,V(\ell),\log(1/\kappa_0\eta),\frac{e^{\beta\Omega'}\|A\|\|O\|}{\sqrt\beta}\right)
\frac{\log(|S|/p_{\mathrm{fail}})}{\eta^2}
$$

$$
=O\!\left(n\cdot\frac{e^{O(\beta^{c'D})}}{\eta^2}\log_D^{c''}(1/\eta)\log(n/p_{\mathrm{fail}})\right),
$$

其中 $c',c''$ 是绝对常数。$\blacksquare$

最后，我们可以把迭代步骤串联起来，得到完整算法成本。对于误差 $\epsilon$，迭代次数只按 $\log(1/\epsilon)$ 缩放，而 $\epsilon$ 的依赖由测量成本 $1/\epsilon^2$ 主导。

**Theorem IV.3（关于 $\epsilon$ 和 $n$ 近最优地学习格点哈密顿量 - Thm I.2）。** 串联 Algorithm IV.3，我们可以以概率 $1-p_{\mathrm{fail}}$，把 $D$ 维格点上量子 Gibbs 态的哈密顿量学习到精度 $\epsilon$，使用

$$
O\!\left(\frac{e^{O(\beta^{cD})}}{\beta^2\epsilon^2}(\log(1/\epsilon))^{D+1}\log(n/p_{\mathrm{fail}})\right)
$$

个样本，以及

$$
O\!\left(n\log(n/p_{\mathrm{fail}})\cdot\frac{e^{O(\beta^{c'D})}}{\beta^2\epsilon^2}\log_D^{c''}(1/\epsilon)\right)
$$

运行时间，包括量子门数和经典处理。此外，它在至多

$$
O\bigl((\beta^4+\max(\beta,1/d)\log(1/\epsilon))^D\bigr)
$$

个量子比特上执行相干量子测量。这里 $c,c',c''$ 是绝对常数。

**证明。** 迭代应用 Algorithm IV.3，令 $p_{\mathrm{fail}}=1/O(\log(1/\epsilon))$，其性能保证和复杂度由 Theorem IV.2 给出。重复 $O(\log(1/\epsilon))$ 次迭代就足够。

**自举到 $\beta<1/d$ 的情形。** 我们可以重标度 $\beta\leftarrow1/d$ 和 $h_\gamma\leftarrow h_\gamma\cdot\beta d$。我们应用与上面相同的算法，并把精度重新定义为 $\epsilon\leftarrow\epsilon\cdot\beta d$。$\blacksquare$

# 致谢

我们感谢 Thiago Bergamaschi、Jonas Haferkamp、Yunchao Liu、Daniel Mark、Weiliang Wang 和 Qi Ye 的有益讨论。我们感谢 Cambyse Rouze 在近期相关工作 [CR] 中的合作。CFC 受到通过 NSF QLCI Grant No. 2016245 提供的 Simons-CIQC 博士后奖学金支持。AA 和 QTN 感谢 NSF Award No. 2238836 的支持。AA 感谢 NSF 奖项 QCIS-FF: Quantum Computing & Information Science Faculty Fellow at Harvard University (NSF 2013303) 以及 NSF Award No. 2430375 的支持。QTN 感谢 Harvard Quantum Initiative PhD fellowship 和 IBM PhD fellowship 的支持。

# 参考文献

[AAKS20] Anurag Anshu, Srinivasan Arunachalam, Tomotaka Kuwahara, and Mehdi Soleimanifar. 量子多体系统的样本高效学习。In 2020 IEEE 61st Annual Symposium on Foundations of Computer Science (FOCS), pages 685-691. IEEE, 2020. 2, 7, 8, 17

[BAL19] Eyal Bairey, Itai Arad, and Netanel H. Lindner. 从局域测量学习局域哈密顿量。Phys. Rev. Lett., 122:020504, Jan 2019. 2, 7

[BCS57] J. Bardeen, L. N. Cooper, and J. R. Schrieffer. 超导理论。Phys. Rev., 108:1175-1204, Dec 1957. 2

[BLMT24] Ainesh Bakshi, Allen Liu, Ankur Moitra, and Ewin Tang. 以多项式时间在任意温度下学习量子哈密顿量。In Proceedings of the 56th Annual ACM Symposium on Theory of Computing, STOC 2024, page 1470-1477, New York, NY, USA, 2024. Association for Computing Machinery. 2, 4, 7

[Bou15] Gabriel Bouch. 量子格点系统的复时间奇性和局域性估计。Journal of Mathematical Physics, 56(12):123303, 12 2015. 4, 11

[Bre15] Guy Bresler. 在任意图上高效学习 Ising 模型。In Proceedings of the Forty-Seventh Annual ACM Symposium on Theory of Computing, STOC '15, page 771-782, New York, NY, USA, 2015. Association for Computing Machinery. 8

[CB21] Chi-Fang Chen and Fernando GSL Brandão. 从本征态热化假说得到快速热化。arXiv preprint arXiv:2112.07646, 2021. 3

[CKBG23] Chi-Fang Chen, Michael J Kastoryano, Fernando GSL Brandão, and András Gilyén. 量子热态制备。arXiv preprint arXiv:2303.18224, 2023. 3, 4, 11

[CKG23] Chi-Fang Chen, Michael J Kastoryano, and András Gilyén. 高效且精确的非对易量子 Gibbs 采样器。arXiv preprint arXiv:2311.09207, 2023. 3, 4, 8, 11

[CLY23] Chi-Fang Anthony Chen, Andrew Lucas, and Chao Yin. 多体量子动力学中的速度限制与局域性。Reports on Progress in Physics, 86(11):116001, 2023. 32

[CR] Chi-Fang Chen and Cambyse Rouzé. 量子 Gibbs 态是局域 Markov 的。5, 8, 11, 12, 29

[DCL24] Zhiyan Ding, Chi-Fang Chen, and Lin Lin. 通过 Lindbladian 的单辅助量子比特基态制备。Physical Review Research, 6(3):033147, 2024. 3

[DLL24] Zhiyan Ding, Bowen Li, and Lin Lin. 具有 Kubo-Martin-Schwinger 细致平衡条件的高效量子 Gibbs 采样器。arXiv preprint arXiv:2404.05998, 2024. 3

[GCDK24] András Gilyén, Chi-Fang Chen, Joao F Doriguello, and Michael J Kastoryano. Glauber 和 Metropolis 动力学的量子推广。arXiv preprint arXiv:2405.20322, 2024. 3

[GSLW19] András Gilyén, Yuan Su, Guang Hao Low, and Nathan Wiebe. 量子奇异值变换及其进一步推广：量子矩阵算术的指数改进。In Proceedings of the 51st annual ACM SIGACT symposium on theory of computing, pages 193-204, 2019. 31

[HKT22] Jeongwan Haah, Robin Kothari, and Ewin Tang. 从高温 Gibbs 态最优学习量子哈密顿量。In 2022 IEEE 63rd Annual Symposium on Foundations of Computer Science (FOCS), pages 135-146, 2022. 2, 3, 7, 8

[HSHT23] Yaroslav Herasymenko, Maarten Stroeks, Jonas Helsen, and Barbara Terhal. 优化稀疏费米哈密顿量。Quantum, 7:1081, August 2023. 8

[HTFS23] Hsin-Yuan Huang, Yu Tong, Di Fang, and Yuan Su. 以 Heisenberg 极限缩放学习多体哈密顿量。Phys. Rev. Lett., 130:200403, May 2023. 2, 8

[JI24] Jiaqing Jiang and Sandy Irani. 通过弱测量的量子 Metropolis 采样。arXiv preprint arXiv:2406.16023, 2024. 3

[KM17] Adam Klivans and Raghu Meka. 使用乘性权重学习图模型。In 2017 IEEE 58th Annual Symposium on Foundations of Computer Science (FOCS), pages 343-354, 2017. 8

[KvBE+21] Christian Kokail, Rick van Bijnen, Andreas Elben, Benoît Vermersch, and Peter Zoller. 量子模拟中的纠缠哈密顿量层析。Nature Physics, 17(8):936-942, Aug 2021. 2

[Lau83] R. B. Laughlin. 异常量子 Hall 效应：具有分数电荷激发的不可压缩量子流体。Phys. Rev. Lett., 50:1395-1398, May 1983. 2

[LBA+23] Yotam Y. Lifshitz, Eyal Bairey, Eli Arbel, Gadi Aleksandrowicz, Haggai Landa, and Itai Arad. Gibbs 态的实用量子态层析，2023. 2, 7

[LC17] Guang Hao Low and Isaac L Chuang. 通过量子信号处理的最优哈密顿量模拟。Physical review letters, 118(1):010501, 2017. 31

[Mon15] Andrea Montanari. 将数据化约为充分统计量的计算含义，2015. 2

[Nar24] Shyam Narayanan. 通过平坦多项式改进学习量子哈密顿量的算法。arXiv preprint arXiv:2407.04540, 2024. 7

[OKK+25] Tobias Olsacher, Tristan Kraft, Christian Kokail, Barbara Kraus, and Peter Zoller. 弱耗散量子多体系统中的哈密顿量和 Liouvillian 学习。Quantum Science and Technology, 10(1):015065, Jan 2025. 2

[Pan12] Dmitry Panchenko. Sherrington-Kirkpatrick 模型：概述。Journal of Statistical Physics, 149(2):362-383, Oct 2012. 2

[RSF24] Cambyse Rouzé and Daniel Stilck França. 从少数副本学习量子多体系统。Quantum, 8:1319, April 2024. 2

[RWW23] Patrick Rall, Chunhao Wang, and Pawel Wocjan. 通过舍入承诺制备热态。Quantum, 7:1132, 2023. 3

[SM21] Oles Shtanko and Ramis Movassagh. 在无噪声和有噪声随机量子线路上制备 Gibbs 态的算法，2021. 3

[TOV+11] Kristan Temme, Tobias J Osborne, Karl G Vollbrecht, David Poulin, and Frank Verstraete. 量子 Metropolis 采样。Nature, 471(7336):87-90, 2011. 3

[WT23] Pawel Wocjan and Kristan Temme. 量子映射的 Szegedy walk 酉。Communications in Mathematical Physics, 402(3):3201-3231, 2023. 3

[YAG12] Man-Hong Yung and Alán Aspuru-Guzik. 量子-量子 Metropolis 算法。Proceedings of the National Academy of Sciences, 109(3):754-759, 2012. 3

# 附录 A：标准测量成本

在这里，我们收集用于执行测量和时间演化的常规量子算法论证。

**Lemma IV.5 的证明。** 标准结果是：对于满足 $\|E\|\le1$ 的可观测量 $E$，可以使用

$$
O(\log(1/\delta)/\epsilon^2)
$$

份 $\rho$，以概率 $1-\delta$ 把 $\operatorname{Tr}(\rho E)$ 估计到加性误差 $\epsilon$。这里注意，对每个 $O,A,G'_\ell,K'_\ell$，算子

$$
Q(O,G'_\ell,A,K'_\ell)
=\frac1{\sqrt{2\pi}}\int_{-\infty}^{\infty}\int_{-\infty}^{\infty}
\left(O_{G_\ell}^\dagger(t)A_{K_\ell}(t'+t)h_+(t')-A_{K_\ell}(t'+t)O_{G_\ell}^\dagger(t)h_-(t')\right)g_\beta(t)dt'dt
$$

是 $V(\ell)(|\operatorname{Supp}A|+|\operatorname{Supp}O|)$-local 的，并且具有有界范数

$$
\|Q(O,G'_\ell,A,K'_\ell)\|
\le \|A\|\|O\|\frac1{\sqrt{2\pi}}
\int_{-\infty}^{\infty}\int_{-\infty}^{\infty}(|h_+(t')|+|h_-(t')|)g_\beta(t)dt'dt
$$

$$
\lesssim \|A\|\|O\|\int_{-\infty}^{\infty}\int_{-\infty}^{\infty}
e^{-\sigma^2t'^2}\frac{\sqrt\sigma}{\beta}e^{\beta\Omega'/2+\sigma^2\beta^2/4}\frac4\beta e^{-2\pi|t|/\beta}dt'dt
\lesssim \frac{e^{\beta\Omega'/2}}{\sqrt\beta}\|A\|\|O\|.
$$

因此，估计 $\operatorname{Tr}(Q(O,G'_\ell,A,K'_\ell)\rho)$ 需要

$$
O\!\left(\frac{e^{\beta\Omega'}\|A\|^2\|O\|^2}{\beta\epsilon^2}\log(1/\delta)\right)
$$

个样本。

现在我们更仔细地考察测量 $Q(O,G'_\ell,A,K'_\ell)$ 的门复杂度。一次测量 shot 的平凡门复杂度上界为

$$
2^{V(\ell,O)+V(\ell,A)},
$$

这对于一般稀疏图是 $2^{d^{O(\ell)}}$，对于 $D$ 维格点是 $2^{\ell^{O(D)}}$。由于我们关注在 $D$ 维格点上的最优学习，并且 $\ell$ 随学习精度倒数对数增长，我们希望把这个平凡门复杂度改进到 $\operatorname{poly}V(\ell)$。我们将把 $d$ 视为常数。

第一步是截断时间积分。根据 Lemma A.1，

$$
\frac1{\sqrt{2\pi}}\left(\int_{-\infty}^{\infty}\int_{-\infty}^{\infty}-\int_{|t|\le T}\int_{|t'|\le T'}\right)
\left(h_+(t')O_{G'_\ell}^\dagger(t)A_{K'_\ell}(t'+t)-h_-(t')A_{K'_\ell}(t'+t)O_{G'_\ell}^\dagger(t)\right)g_\beta(t)dt'dt
$$

$$
\lesssim \|O\|\|A\|\frac{e^{\beta\Omega'/2+\sigma^2\beta^2/4}}{\sqrt{\sigma\beta}}
\left(e^{-\sigma^2T'^2}+e^{-2\pi T/\beta}\right).
$$

取

$$
T=O(\beta^2\Omega'+\beta\log(1/\sqrt\beta\epsilon)),
\qquad
T'=O(\beta^3\Omega'+\beta^2\log(1/\sqrt\beta\epsilon))^{1/2}
$$

就足够。

接下来，我们离散化截断后的算子。定义

$$
\widetilde Q_\Delta
=\sum_{j=0}^{\lceil T'/\Delta\rceil}\sum_{k=0}^{\lceil T/\Delta\rceil}
\left(O_{G'_\ell}^\dagger(j\Delta)A_{K'_\ell}((j+k)\Delta)h_+(k\Delta)
-A_{K'_\ell}((j+k)\Delta)O_{G'_\ell}^\dagger(j\Delta)h_-(k\Delta)\right)g_\beta(j\Delta)\Delta^2
$$

$$
=\sum_{j=0}^{\lceil T'/\Delta\rceil}\sum_{k=0}^{\lceil T/\Delta\rceil}\widetilde Q_{j,k}.
$$

当

$$
\Delta=1/\operatorname{poly}(\beta,T,T',e^{\beta\Omega'/2}/\sqrt\beta)
$$

时，它满足

$$
\|\widetilde Q_\Delta-Q(O,G'_\ell,A,K'_\ell)\|\le\epsilon.
$$

现在，$\widetilde Q_\Delta$ 可以用标准哈密顿量模拟和 block-encoding 工具高效实现 [GSLW19]，所以我们只简要说明。$G'_\ell,K'_\ell$ 的 block-encoding 可以用

$$
\operatorname{poly}(V(\ell),\log(1/\kappa\epsilon))
$$

个基本门实现到精度 $\epsilon$。因此，$O,A$ 的时间 $t$ Heisenberg 演化的 block-encoding 可以用

$$
\operatorname{poly}(tV(\ell),\log(1/\kappa\epsilon))
$$

个门实现 [GSLW19, LC17]。然后，用系数 $\pm h_\pm(k\Delta)g_\beta(j\Delta)\Delta^2$ 取这些 Heisenberg 演化算子的线性组合，需要额外

$$
\operatorname{poly}(e^{\beta\Omega'/2}\sqrt\beta(T+T')/\Delta)
$$

个门。因此，总共需要

$$
\operatorname{poly}\!\left(\beta,V(\ell),\log(1/\kappa\epsilon),\frac{e^{\beta\Omega'/2}}{\sqrt\beta}\|A\|\|O\|\right)
$$

个基本门，以获得 $Q(O,G'_\ell,A,K'_\ell)$ 的一次测量 shot。$\blacksquare$

## 1. $Q$ 的时间截断

**Lemma A.1（截断时间积分）。** 在 Lemma III.4 的设置中，

$$
\frac1{\sqrt{2\pi}}\left(\int_{-\infty}^{\infty}\int_{-\infty}^{\infty}-\int_{|t|\le T}\int_{|t'|\le T'}\right)
\left(h_+(t')O_H^\dagger(t)A_{H'}(t'+t)-h_-(t')A_{H'}(t'+t)O_H^\dagger(t)\right)g_\beta(t)dt'dt
$$

$$
\lesssim \|O\|\|A\|\frac{e^{\beta\Omega'/2+\sigma^2\beta^2/4}}{\sqrt{\sigma\beta}}
\left(e^{-\sigma^2T'^2}+e^{-2\pi T/\beta}\right).
$$

**证明。** 考虑

$$
\frac1{\sqrt{2\pi}}\left(\int_{-\infty}^{\infty}\int_{-\infty}^{\infty}-\int_{|t|\le T}\int_{|t'|\le T'}\right)
\left(h_+(t')O_H^\dagger(t)A_{H'}(t'+t)-h_-(t')A_{H'}(t'+t)O_H^\dagger(t)\right)g_\beta(t)dt'dt
$$

$$
\le \|O\|\|A\|\frac1{\sqrt{2\pi}}
\int_{-\infty}^{\infty}\int_{-\infty}^{\infty}
(\mathbf 1(|t|\ge T)+\mathbf 1(|t'|\ge T'))(|h_+(t')|+|h_-(t')|)|g_\beta(t)|dt'dt.
$$

回顾

$$
|h_+(t')|,|h_-(t')|\lesssim e^{-\sigma^2t'^2}\frac{\sqrt\sigma}{\beta}e^{\beta\Omega'/2+\sigma^2\beta^2/4}
$$

以及

$$
|g_\beta(t)|=\frac{2\pi^{3/2}}{4\beta(1+\cosh(2\pi t/\beta))}
\le\frac4\beta e^{-2\pi|t|/\beta}.
$$

直接代入得到

$$
\int_{-\infty}^{\infty}\int_{-\infty}^{\infty}
\mathbf 1(|t|\ge T)(|h_+(t')|+|h_-(t')|)|g_\beta(t)|dt'dt
\le \frac{2e^{\beta\Omega'/2+\sigma^2\beta^2/4}}{\sqrt{\sigma\beta}\sqrt\pi}e^{-2\pi T/\beta},
$$

并且

$$
\int_{-\infty}^{\infty}\int_{-\infty}^{\infty}
\mathbf 1(|t'|\ge T')(|h_+(t')|+|h_-(t')|)|g_\beta(t)|dt'dt
\le \frac4{2\sqrt{\sigma\pi\beta}}e^{-\sigma^2T'^2}e^{\beta\Omega'/2+\sigma^2\beta^2/4}.
$$

$\blacksquare$

# 附录 B：Lieb-Robinson 估计

在本节中，我们回顾一些标准 Lieb-Robinson 估计，参见例如 [CLY23]。主要子程序如下。

**Lemma B.1（Lieb-Robinson bound）。** 对于有界相互作用度 $d$ 的哈密顿量

$$
H=\sum_\gamma h_\gamma,
\qquad \|h_\gamma\|\le1,
$$

见 Section II B，以及支撑在区域 $A\subset\Lambda$ 上的算子 $A$，令 $H_\ell$ 包含所有满足 $\operatorname{dist}(\gamma,A)<\ell-1$ 的项 $h_\gamma$，其中 $\ell$ 为整数。那么

$$
\|A_{H_\ell}(t)-A_H(t)\|
\lesssim \|A\|\min\left(2,|A|\frac{(2d|t|)^\ell}{\ell!}\right).
$$

我们还需要 Lieb-Robinson bounds 的如下变体。

**Lemma B.2（扰动哈密顿量）。** 考虑

$$
F=\sum_\gamma f_\gamma,
\qquad
F'=\sum_\gamma f'_\gamma,
$$

它们具有相同的、度有界为 $d$ 的相互作用图，见 Section II B，并满足 $\|f_\gamma\|,\|f'_\gamma\|\le1$。那么对单点算子 $A$，且 $\|A\|\le1$，有

$$
\|A_{F'}(t)-A_F(t)\|
\lesssim \frac1d\sum_{\delta\in\Gamma}\|f_\delta-f'_\delta\|
\min\left(\frac{(2dt)^{\operatorname{dist}(\delta,A)+1}}{(\operatorname{dist}(\delta,A)+1)!},2t\right).
$$

特别地，假设 $F'=F+\eta W$，并且 $W$ 中所有项都离 $A$ 至少距离 $\ell_0$，则

$$
\|A_{F'}(t)-A_F(t)\|
\lesssim \frac\eta d\sum_{\ell=\ell_0}^{\infty}S(\ell,A)
\min\left(t,\frac{(2dt)^{\ell+1}}{(\ell+1)!}\right),
$$

其中 $S(\ell,A)$ 是距 $A$ 距离为 $\ell$ 的项数。

**Remark B.1.** 该变体的要点是右端与 $\eta$ 线性缩放。事实上，如果我们分别对 $F$ 和 $F'$ 应用 Lemma B.1，那么 Lemma B.1 右端的误差不会依赖于 $\eta$。

**证明。** 我们通过一次改变一个 $\gamma$，从 $F=\sum_\gamma f_\gamma$ 插值到 $F'=\sum_\gamma f'_\gamma$。不失一般性，只需考虑一步：

$$
F=\sum_\gamma f_\gamma,
\qquad
F'=\sum_{\gamma\ne\delta}f_\gamma+f'_\delta,
$$

其中 $\|f_\gamma\|,\|f'_\delta\|\le1$。那么

$$
\|e^{iF't}Ae^{-iF't}-e^{iFt}Ae^{-iFt}\|
=\|e^{i(F+\Delta)t}Ae^{-i(F+\Delta)t}-e^{iFt}Ae^{-iFt}\|
$$

$$
\le \int_0^t\|[\Delta,A(t_1)](t-t_1)\|dt_1
\le \int_0^t\|[\Delta,A(t_1)]\|dt_1
\le \|\Delta\|\int_0^t\frac{(2dt_1)^\ell}{\ell!}dt_1
=\frac{\|\Delta\|}{2d}\frac{(2dt)^{\ell+1}}{(\ell+1)!}.
$$

第一行设 $\Delta:=h'_\delta-h_\delta$；第二个不等式使用线性算子的 Duhamel 恒等式

$$
e^{(C+D)t}-e^{Ct}=\int_0^t e^{(C+D)(t-t_1)}De^{Ct_1}dt_1,
$$

第四个不等式使用 Lemma B.1，并设 $\ell=\operatorname{dist}(\delta,A)$。当距离 $\ell$ 太小时，我们还有无条件界

$$
\|e^{iF't}Ae^{-iF't}-e^{iFt}Ae^{-iFt}\|
\le\int_0^t\|[\Delta,A(t_1)]\|dt_1\le2t\|\Delta\|.
$$

对所有项 $\delta\in\Gamma$ 求和即可得到第一个断言。

为了得到第二个断言，我们按距离 $\ell$ 组织求和：

$$
\|e^{iF't}Ae^{-iF't}-e^{iFt}Ae^{-iFt}\|
\le\frac\eta d\sum_{\ell=\ell_0}^{\infty}S(\ell,A)
\min\left(2t,\frac{(2dt)^{\ell+1}}{(\ell+1)!}\right),
$$

其中使用了距 $A$ 距离为 $\ell$ 的项 $\gamma$ 的数量由 $S(\ell,A)$ 界定。证明完成。$\blacksquare$

本节余下部分收集 Lieb-Robinson bounds 的常规用法。

## 1. Lemma III.5 的证明

**Lemma III.5 的证明。** 在此证明中，我们压制 $A_{H'}(\omega')=:A(\omega')$。重写 Lemma II.4 以显露一个衰减因子 $e^{-\beta\omega'}$：

$$
\widehat A(\omega')=e^{-\beta_0\omega'+\beta_0^2\sigma^2}\cdot
\widehat{(e^{\beta_0H'}Ae^{-\beta_0H'})}(\omega'-2\sigma^2\beta_0),
$$

并展开右端。对于虚时间共轭，我们直接使用适合足够小 $\beta_0$ 的朴素 Taylor 级数：

$$
e^{\beta_0H'}Ae^{-\beta_0H'}
=\sum_{k=0}^{\infty}\frac1{k!}\beta_0^k C_{H'}^k[A]
=\sum_{k=0}^{\infty}\sum_{\gamma_k\sim\cdots\sim\gamma_1\sim A}
\frac1{k!}\beta_0^k[h'_{\gamma_k},\cdots,[h'_{\gamma_1},A]\cdots].
$$

现在研究实时间演化。对于任意支撑在子集 $S\subset\Lambda$ 上并满足 $\|T_S\|\le1$ 的算子 $T_S$，它将是嵌套对易子，我们引入环带分解以利用 $G$ 的局域性：

$$
\|[e^{iH't}T_Se^{-iH't},G]\|
\le \sum_{\ell=\ell_0}^{\infty}
\|[e^{iH'_{\ell+1}t}T_Se^{-iH'_{\ell+1}t}-e^{iH'_\ell t}T_Se^{-iH'_\ell t},G]\|
+\|[e^{iH'_{\ell_0}t}T_Se^{-iH'_{\ell_0}t},G]\|
$$

$$
\lesssim \sum_{\ell=\ell_0}^{\infty}\min\left(\frac{(2d|t|)^\ell}{\ell!},1\right)V(\ell,S)+V(\ell_0-1,S)
\le |S|\left(\sum_{\ell=\ell_0}^{\infty}\frac{(2d|t|)^\ell}{\ell!}d^{\ell+2}+d^{\ell_0+1}\right),
$$

其中使用 Lieb-Robinson bounds Lemma B.1，并且

$$
[e^{iH'_{\ell+1}t}T_Se^{-iH'_{\ell+1}t}-e^{iH'_\ell t}T_Se^{-iH'_\ell t},G]
$$

支撑在距集合 $S$ 距离 $\ell$ 的位置，因此贡献到对易子的 $g_\gamma$ 的数量由体积界 $V(\ell)$ 控制。这里可用 $V(\ell)\le |S|d^{\ell+2}$。于是得到

$$
\|[e^{iH't}T_Se^{-iH't},G]\|
\le |S|\left(\sum_{\ell=\ell_0}^{\infty}\frac{(2d|t|)^\ell}{\ell!}d^{\ell+2}+d^{\ell_0+1}\right).
$$

写出算子傅里叶变换的时间域表达式：

$$
\|[T_S(\omega'),G]\|
\le \frac1{\sqrt{2\pi}}\int_{-\infty}^{\infty}
\|[e^{iH't}T_Se^{-iH't},G]\||f(t)|dt
$$

$$
\lesssim \sqrt\sigma d^2|S|\int_{-\infty}^{\infty}
\left(\sum_{\ell=\ell_0}^{\infty}\frac{(2d^2|t|)^\ell}{\ell!}+d^{\ell_0-1}\right)e^{-\sigma^2t^2}dt
$$

$$
\lesssim \frac{|S|}{\sqrt\sigma}d^2\left(d^{\ell_0-1}+\sum_{\ell=\ell_0}^{\infty}\left(\frac{2ed^2}{\sigma\sqrt\ell}\right)^\ell\right)
\lesssim \frac{|S|}{\sqrt\sigma}d^2(d^{\ell_0-1}+1/2)
\lesssim \frac{|S|}{\sqrt\sigma}d^{\ell_0+1},
$$

其中设

$$
\ell_0=\lceil16e^2d^4/\sigma^2\rceil.
$$

第三行使用了

$$
\int_{-\infty}^{\infty}e^{-x^2}|x|^\ell dx
=\int_0^{\infty}e^{-y}y^{\ell/2-1}dy
=\Gamma((\ell+1)/2)
\le\lceil(\ell-1)/2\rceil!\le \ell^{\ell/2},
$$

以及整数 $\ell\ge1$ 的 Stirling 近似 $1/\ell!\le(e/\ell)^\ell$。最后一行对几何级数求和。综上，

$$
[\widehat{(e^{\beta_0H'}Ae^{-\beta_0H'})}(\omega'),G]
\le \sum_{k=0}^{\infty}\sum_{\gamma_k,\ldots,\gamma_1}\frac1{k!}\beta_0^k
[[h'_{\gamma_k},\cdots,[h'_{\gamma_1},A]\cdots](\omega'),G]
$$

$$
\le \|A\|\sum_{k=0}^{\infty}(2\beta_0d)^k k d^k\frac{d^{\ell_0+1}}{\sqrt\sigma}
\lesssim \frac{d^{\ell_0+2}}{\sqrt\sigma}\|A\|,
\qquad \text{setting }\beta_0=1/4d.
$$

第二行代入

$$
T_S\leftarrow [h'_{\gamma_k},\cdots,[h'_{\gamma_1},A]\cdots]/(2^k\|A\|),
\quad |S|\le dk,
$$

并使用至多有 $k!d^k$ 条路径 $\gamma_k\sim\cdots\sim\gamma_1\sim A$，以及当 $|x|\le1$ 时

$$
\sum_k kx^k\le\frac1{(1-|x|)^2}.
$$

对 $\omega'$ 积分，得到

$$
\int_{|\omega'|\ge\Omega'}\langle O,[\widehat A(\omega'),G]\rangle_\rho d\omega'
\le \int_{|\omega'|\ge\Omega'}\|[\widehat A(\omega'),G]\|\|O\|d\omega'
$$

$$
\lesssim \frac{d^{\ell_0+2}}{\sqrt\sigma}\int_{\omega'\ge\Omega'}\|O\|\|A\|e^{-\beta_0\omega'+\beta_0^2\sigma^2}d\omega'
$$

$$
\lesssim \frac{d^{\ell_0+2}}{\beta_0\sqrt\sigma}e^{-\beta_0\Omega'+\beta_0^2\sigma^2}\|O\|\|A\|
\lesssim \frac{d^{4+16e^2d^4/\sigma^2}}{\sqrt\sigma}e^{-\Omega'/4d+\sigma^2/16d^2}\|O\|\|A\|,
$$

如所宣称。$\blacksquare$

## 2. Lemma IV.1 的证明

**Lemma IV.1 的证明。** 对于 (A)，应用 Lemma B.1 来截断哈密顿量 $G\to G_\ell$，然后 $K\to K_\ell$：

$$
|Q(O,G,A,K)-Q(O,G_\ell,A,K)|
\le\int_{-\infty}^{\infty}\int_{-\infty}^{\infty}
(|h_+(t')|+|h_-(t')|)g_\beta(t)\|O_G^\dagger(t)-O_{G_\ell}^\dagger(t)\|dt'dt
$$

$$
\le 2\int_{-\infty}^{\infty}(|h_+(t')|+|h_-(t')|)dt'
\left(\int_{0\le t\le\ell/2e^2d}g_\beta(t)|\operatorname{Supp}(O)|\frac{(2dt)^\ell}{\ell!}dt
+2\int_{t>\ell/2e^2d}g_\beta(t)dt\right)
$$

$$
\lesssim \int_{-\infty}^{\infty}(|h_+(t')|+|h_-(t')|)dt'
\left(\int_{t\le\ell/2e^2d}e^{-2\pi|t|/\beta}e^{-\ell}dt/\beta
+\int_{t>\ell/2e^2d}e^{-2\pi|t|/\beta}dt/\beta\right)|\operatorname{Supp}(O)|
$$

$$
\lesssim \frac{e^{\beta\Omega'/2+\sigma^2\beta^2/4}}{\sqrt{\sigma\beta}}
\left(e^{-\ell}+e^{-\pi\ell/e^2d\beta}\right)|\operatorname{Supp}(O)|. \tag{B1}
$$

第二个不等式用平凡界 $\|O_G^\dagger(t)-O_{G_\ell}^\dagger(t)\|\le2$ 控制晚时贡献。第三个不等式使用当 $0\le t\le\ell/2e^2d$ 时

$$
\frac{(2dt)^\ell}{\ell!}\le e^{-\ell}.
$$

接着，把 $K$ 改为 $K_\ell$。主要差异是要更仔细地分割积分范围，因为 Heisenberg 动力学依赖 $t+t'$：

$$
|Q(O,G_\ell,A,K)-Q(O,G_\ell,A,K_\ell)|
\le\int_{-\infty}^{\infty}\int_{-\infty}^{\infty}
(|h_+(t')|+|h_-(t')|)g_\beta(t)\|A_K(t+t')-A_{K_\ell}(t+t')\|dt'dt
$$

$$
\lesssim \int_{|t'|>\ell/4e^2d}(|h_+(t')|+|h_-(t')|)\int_{-\infty}^{\infty}g_\beta(t)dtdt'
$$

$$
+\int_{|t'|\le\ell/4e^2d}(|h_+(t')|+|h_-(t')|)
\left(\int_{|t|\le\ell/4e^2d}e^{-2\pi|t|/\beta}|\operatorname{Supp}(A)|\frac{(2d|t+t'|)^\ell}{\ell!}dt/\beta
+\int_{|t|>\ell/4e^2d}e^{-2\pi|t|/\beta}dt/\beta\right)dt'
$$

$$
\lesssim \frac{e^{\beta\Omega'/2+\sigma^2\beta^2/4}}{\beta\sqrt\sigma}
\left(e^{-\sigma^2\ell^2/16e^4d^2}+e^{-\ell}+e^{-\pi\ell/2e^2d\beta}\right)|\operatorname{Supp}(A)|. \tag{B2}
$$

对于具有广延扰动 $K\to K',G\to G'$ 的情形 (B)，表达式与 (B1)、(B2) 非常相似，只是我们使用 Lemma B.2 而不是 Lemma B.1：

$$
|Q(O,G,A,K)-Q(O,G',A,K)|
\le\int_{-\infty}^{\infty}\int_{-\infty}^{\infty}
(|h_+(t')|+|h_-(t')|)g_\beta(t)\|O_G^\dagger(t)-O_{G'}^\dagger(t)\|dt'dt
$$

$$
\lesssim \frac{2\kappa}{d}\sum_{\ell=\ell_0}^{\infty}S(\ell,O)
\int_{-\infty}^{\infty}(|h_+(t')|+|h_-(t')|)dt'
\left(\int_{0\le t\le(\ell+1)/2e^2d}g_\beta(t)\frac{(2dt)^{\ell+1}}{(\ell+1)!}dt
+\int_{t>(\ell+1)/2e^2d}tg_\beta(t)dt\right)
$$

$$
\lesssim \frac\kappa d\sum_{\ell=\ell_0}^{\infty}S(\ell,O)
\frac{e^{\beta\Omega'/2+\sigma^2\beta^2/4}}{\sqrt{\sigma\beta}}
\left(e^{-\ell-1}+\frac{(\ell+1)\beta}{d}e^{-\pi(\ell+1)/e^2d\beta}\right).
$$

并且

$$
|Q(O,G',A,K)-Q(O,G',A,K')|
\le\int_{-\infty}^{\infty}\int_{-\infty}^{\infty}
(|h_+(t')|+|h_-(t')|)g_\beta(t)\|A_K(t+t')-A_{K'}(t+t')\|dt'dt
$$

$$
\lesssim \kappa\sum_{\ell=\ell_0}^{\infty}S(\ell,A)
\int_{|t'|>(\ell+1)/4e^2d}(|h_+(t')|+|h_-(t')|)
\int_{-\infty}^{\infty}|t+t'|g_\beta(t)dtdt'
$$

$$
+\kappa\sum_{\ell=\ell_0}^{\infty}S(\ell,A)
\int_{|t'|\le(\ell+1)/4e^2d}(|h_+(t')|+|h_-(t')|)
\left(\int_{|t|\le(\ell+1)/4e^2d}e^{-2\pi|t|/\beta}e^{-\ell-1}dt/\beta
+\int_{|t|>(\ell+1)/4e^2d}e^{-2\pi|t|/\beta}|t+t'|dt/\beta\right)dt'
$$

$$
\lesssim \kappa\sum_{\ell=\ell_0}^{\infty}S(\ell,A)
\frac{e^{\beta\Omega'/2+\sigma^2\beta^2/4}}{\beta\sqrt\sigma}
\left(\left(\beta+\frac\ell{4ed}\right)e^{-\sigma^2(\ell+1)^2/16e^4d^2}+e^{-\ell-1}+\frac{(\ell+1)\beta}{d}e^{-\pi(\ell+1)/2e^2d\beta}\right).
$$

把界中 $\ell+1\to\ell$ 简化，即得到所宣称的结果。

情形 (C) 的证明类似地使用 Lemma B.2。首先，

$$
|Q(O,G,A,K)-Q(O,G',A,K)|
\le\int_{-\infty}^{\infty}\int_{-\infty}^{\infty}
(|h_+(t')|+|h_-(t')|)g_\beta(t)\|O_G^\dagger(t)-O_{G'}^\dagger(t)\|dt'dt
$$

$$
\lesssim \frac\kappa d V(\ell_0,O)
\int_{-\infty}^{\infty}(|h_+(t')|+|h_-(t')|)dt'
\left(\int_{-\infty}^{\infty}|t|g_\beta(t)dt\right)
\lesssim \frac{\kappa\beta}{d}V(\ell_0,O)\frac{e^{\beta\Omega'/2+\sigma^2\beta^2/4}}{\sqrt{\sigma\beta}}.
$$

并且

$$
|Q(O,G',A,K)-Q(O,G',A,K')|
\le\int_{-\infty}^{\infty}\int_{-\infty}^{\infty}
(|h_+(t')|+|h_-(t')|)g_\beta(t)\|A_K(t+t')-A_{K'}(t+t')\|dt'dt
$$

$$
\lesssim \frac\kappa d V(\ell_0,A)
\int_{-\infty}^{\infty}\int_{-\infty}^{\infty}(|h_+(t')|+|h_-(t')|)g_\beta(t)|t+t'|dt'dt
\lesssim \frac{\kappa\beta}{d}V(\ell_0,A)\frac{e^{\beta\Omega'/2+\sigma^2\beta^2/4}}{\sqrt{\sigma\beta}}.
$$

$\blacksquare$

