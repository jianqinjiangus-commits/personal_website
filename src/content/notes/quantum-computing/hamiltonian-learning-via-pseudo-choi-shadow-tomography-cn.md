---
title: "通过伪 Choi 态的影子层析进行哈密顿量学习"
description: "论文阅读笔记：Hamiltonian Learning via Shadow Tomography of Pseudo-Choi States（arXiv:2308.13020v2）。"
publishDate: 2026-05-16
updatedDate: 2026-05-16
tags:
  - quantum-computing
  - hamiltonian-learning
  - shadow-tomography
  - paper-reading
category: "Quantum Computing"
type: "paper-note"
draft: false
---

# 通过伪 Choi 态的影子层析进行哈密顿量学习

Juan Castaneda$^1$ 和 Nathan Wiebe$^{2,3,4}$

$^1$ 加拿大多伦多安大略省多伦多大学物理系

$^2$ 加拿大多伦多安大略省多伦多大学计算机科学系

$^3$ 美国华盛顿州里奇兰太平洋西北国家实验室

$^4$ 加拿大多伦多加拿大高等研究院

arXiv:2308.13020v2 [quant-ph] 2025 年 2 月 26 日

我们引入一种学习哈密顿量的新方法，该方法使用一种我们称为伪 Choi 态的资源；这种资源通过一个类似于 Choi-Jamiolkowski 同构的过程，将哈密顿量编码进一个态中。我们给出一种高效生成这些伪 Choi 态的方法，即查询形如 $e^{-iHt}$ 的时间演化酉算子及其逆算子，并证明对于一个含有 $M$ 项的哈密顿量，其哈密顿量系数可以通过经典影子层析在 2-范数误差 $\epsilon$ 内估计出来；所需对态制备协议的查询次数为

$$
\widetilde{O}\!\left(\frac{M}{t^2\epsilon^2}\right),
\qquad t\le \frac{1}{2\|H\|}.
$$

我们进一步给出一种替代方法，该方法放弃经典影子层析而使用量子均值估计，从而将这一代价降低为

$$
\widetilde{O}\!\left(\frac{M}{t\epsilon}\right),
$$

代价是需要多得多的量子比特。此外，我们证明，在无法访问态制备协议的情况下，哈密顿量可以使用

$$
\widetilde{O}\!\left(\frac{\alpha^4 M}{\epsilon^2}\right)
$$

份伪 Choi 态来学习。常数 $\alpha$ 取决于哈密顿量的范数；如果使用归一化哈密顿量的伪 Choi 态，则关于 $\alpha$ 的标度可以二次改善。最后，我们证明我们的学习过程对于资源态中的误差以及哈密顿量类别中的误差都是鲁棒的。具体而言，我们证明，如果真实哈密顿量包含比我们在重构中认为存在的项更多的项，那么我们的方法会给出一个指示，说明存在尚未被识别出的哈密顿量项，并且仍然会准确估计哈密顿量中已知项的系数。

## 目录

1. 引言 3
2. 问题陈述与结果概要 4
   1. 主要结果 6
3. 从伪 Choi 态学习哈密顿量 8
   1. 伪 Choi 态的影子层析 9
   2. 哈密顿量系数的高效估计（Clifford 影子）11
      1. 样本复杂度上界 17
4. 从酉时间演化黑箱学习哈密顿量 19
   1. 生成伪 Choi 态 20
   2. 通过影子层析学习 22
   3. 从时间演化酉算子进行哈密顿量学习的查询复杂度 23
      1. 为块编码误差和块编码学习误差选择足够的取值 25
      2. 查询复杂度上界 27
5. 通过量子均值估计进行哈密顿量学习 28
   1. 从资源态的酉制备学习哈密顿量系数 29
   2. 构造资源态的酉制备 31
6. 应用 38
   1. 费米子与硬核玻色子模型 39
   2. 自旋玻璃模型 39
   3. 先前工作 40
7. 鲁棒性 42
8. 结论与展望 46
A. 估计哈密顿量系数（Pauli 影子）50
   1. 样本复杂度上界 54
B. 证明与技术性结果 56
   1. 方程 (7) 的证明 56
   2. 命题 12 的证明 56
   3. 引理 14 的证明 58
   4. 选择足够小的经典影子误差 60
   5. 引理 19 的证明 61
   6. 方程 (58) 的证明 63

# 1 引言

识别系统哈密顿量是物理学中的一个核心问题，因为哈密顿量唯一地描述任意闭合量子系统的动力学。此外，随着量子计算机的发展，表征其行为中的误差变得越来越重要；因此，人们已经设计出若干类量子认证协议，以确保量子设备按照预期运行。此类协议种类繁多，每一种协议都会在不同假设下，以不同资源代价，提供关于所研究过程的不同数量和类型的信息 [1]。与随机基准测试这类高效协议不同，随机基准测试只能提供量子门集合平均误差率的信息 [2-4]；哈密顿量学习则可以提供某个固定但有误差的哈密顿量下酉演化的系统误差信息，而不需要像完整过程层析这类协议那样消耗指数级资源，尽管后者可以提供关于噪声过程的更多信息。学习哈密顿量能够给出量子动力学的低层级信息，这些信息可以直接用于量子控制；因此，它是量子设备校准与认证中不可或缺的任务，因为它可以通过学习被模拟的哈密顿量并将其与理想目标比较，来调试量子哈密顿量模拟算法。

尽管这一问题很重要，但系统性地推断哈密顿量并界定完成推断所需样本复杂度的方法，只是在最近才成为量子信息科学中的一个主要关注点。最重要的方向包括：从短时间实验直接推断 [5]、近似贝叶斯推断 [6-9]、基于从热态学习的 PAC（Probably Approximately Correct，可能近似正确）方法 [10,11]，以及通过查询时间演化酉算子 $U=e^{-iHt}$ 进行 PAC 学习 [11-17]。后一类技术给出了严格的样本界，用于说明在以热态或时间演化作为学习资源时，在固定误差和固定失败概率下学习哈密顿量需要多少证据。然而，除了可能昂贵的态制备方法之外，从热态学习哈密顿量的方法通常适用于高温区域，而不适用于很低的温度 [10,11]。

该领域最近取得的大部分进展转而使用时间演化算子 $U=e^{-iHt}$ 作为学习资源。这种方法自然导向量子计算机认证方面的应用，其中人们希望检查某个期望的时间演化在实践中是否真的被执行了（这既适用于希望验证自身计算的情形，也适用于一方执行计算而另一方希望确定底层究竟发生了什么的情形）。它还带来了利用量子控制来提高学习技术效率的可能性。即便如此，研究重点通常仍然局限于物理局域哈密顿量（以及稍微更一般的低交集类别），而不是更一般的 $k$-局域哈密顿量类别或更广类别。在本文中，我们通过给出若干新算法来解决这一点；这些算法使我们能够在低交集区域之外高效学习哈密顿量，并且给出在有无相干量子控制两种情况下生成这些态所需操作次数的显式界。我们的方法通过引入一种新的学习资源来实现这一点，具体而言就是哈密顿量的“伪 Choi 态”；我们证明这种态可以用于高效学习哈密顿量。主要思想是，这些态以一种便于恢复哈密顿量系数的方式编码哈密顿量：只需用少量该态的副本估计一组“解码算子”的期望值即可；这些解码算子是简单算子，其期望值可以在经典计算机上以多项式时间计算。此外，我们给出一种通过对时间演化酉算子 $U=e^{-iHt}$ 及其逆算子 $U^\dagger$ 进行受控查询来高效生成这些伪 Choi 态的方法。该访问模型类似于 [11-17] 中的模型，不过它稍微更受限制，因为它还要求访问反向时间演化 $U^\dagger$。

虽然最近已经有少数方法关注学习低交集类别之外的哈密顿量（[12,15]），但我们的方法改进了查询复杂度对于误差、哈密顿量项的局域性以及哈密顿量项数目的依赖。除此之外，我们的一些学习算法具有鲁棒性：如果存在意料之外的哈密顿量项，算法仍会正确估计我们预期项的系数，并且还会发出信号，说明存在额外项。我们会在第 6 节中更深入地讨论我们的结果与现有哈密顿量学习技术之间的比较。这里先概括地说，不存在明确意义上的“最佳”方法；相反，存在若干适用于不同场景的好方法，这些场景取决于所考虑的输入模型类型和哈密顿量类型。话虽如此，在本文所考虑的、诚然更具限制性的输入模型下，我们发展的技术能够在哈密顿量项数以及参数估计误差两方面都达到最佳标度，并且还具有鲁棒性的额外优点。进一步地，取决于误差度量的选择，我们的方法适用于任意 $n$ 量子比特哈密顿量，包括具有指数多个项的哈密顿量，只要该哈密顿量的范数受量子比特数的一个多项式所界定。因此，研究如果将输入模型放宽到只需要查询 $U$ 时，伪 Choi 态是否能够被高效产生，仍然是有意义的。

本文结构如下。第 2 节概述我们的关键结果，并给出我们所考虑的学习问题的具体表述。此外，我们还总结了与现有哈密顿量学习方法相比，我们方法的优点和缺点。第 3 节引入哈密顿量的伪 Choi 态，并讨论如何将其作为一种资源来高效求解哈密顿量学习问题。该节还简要回顾 [18] 中引入的经典影子层析过程。第 4 节研究通过查询实现 $U=e^{-iHt}$ 和 $U^\dagger$ 的黑箱并在学习过程中使用经典影子来学习哈密顿量的代价。第 5 节引入一种替代方法，该方法使用 Huggins 等人 [19] 提出的用于估计期望值的量子算法。该方法使查询复杂度关于误差和演化时间的标度获得二次改善。第 6 节讨论我们的学习方法适合处理的哈密顿量类型，并包括与先前哈密顿量学习工作的比较。最后，我们在第 7 节讨论该过程的鲁棒性，并在第 8 节总结。

# 2 问题陈述与结果概要

我们希望处理的问题是一个自然的问题。假设我们有一组可能的哈密顿量项，它们的加权和构成一个哈密顿量。我们的任务是在固定失败概率内，将哈密顿量系数的权重学习到固定误差以内。这个要求落在量子 PAC 学习范式的范围内；该范式最初是为理论目的而引入的 [20-22]，但最近已经成为表征任务中的一个实用工具 [18,19]。这个直观问题的形式化陈述如下。

**定义 1（哈密顿量学习问题）.** 令 $\mathcal{H}_S$ 是维数为 $d=2^n$ 的 Hilbert 空间，并令 $\{H_m\mid m=0,\ldots,M-1\}$ 是作用在该空间上的一组 Hermitian 且酉的算子，使得 $\{H_m\}$ 关于内积

$$
\langle H_j,H_k\rangle=d^{-1}\operatorname{Tr}(H_jH_k)
$$

构成一个正交归一算子基。令哈密顿量 $H$ 对于 $c\in\mathbb{R}^M$ 参数化为

$$
H=\sum_{m=0}^{M-1} c_m H_m.
$$

哈密顿量学习问题是计算一个向量 $\hat c$，使得以至少 $1-\delta$ 的概率有

$$
\|\hat c-c\|_2\le \epsilon,
$$

其中 $\|\cdot\|_2$ 是向量 $L^2$-范数。

在最一般的情形中，该分解中最多存在 $d^2$ 个唯一的哈密顿量项。一般而言，在所考虑的算子基中，这些稠密哈密顿量无法被高效学习，因为它们要求我们学习指数多个哈密顿量项。然而，关注特殊类别的哈密顿量可以减少这个数目。最近若干论文（[11,13,14]）关注了低交集哈密顿量类别；该类别由 [11] 引入，我们在定义 2 中描述。低交集类别包含所有空间局域哈密顿量，后者是 Anshu 等人 [10] 先前工作的重点，因此对于描述许多物理系统是相关的。

**定义 2（低交集哈密顿量）.** 一个 $n$ 量子比特上的低交集哈密顿量具有形式

$$
H=\sum_m c_m H_m,
$$

并满足以下性质：

1. 它是 $k$-局域的：每个 $H_m$ 是一个有限维 Hermitian 算子，且至多在 $k\in O(1)$ 个量子比特上非平凡地作用（即作为非恒等算子作用）。
2. 对于每个哈密顿量项 $H_m$，至多存在常数多个不同的项 $H_l$，使得 $H_m$ 和 $H_l$ 至少在一个共同量子比特上非平凡地作用。

第二个性质直接意味着每个量子比特只被常数个哈密顿量项非平凡地作用。因此，低交集哈密顿量中的哈密顿量项数按 $O(n)$ 标度。

相对而言，非低交集的 $k$-局域哈密顿量类别也很有意义。这包括在每一对量子比特之间具有成对相互作用的哈密顿量，也包括可由星形图表示的哈密顿量（即一个量子比特与所有其他量子比特相互作用，但其他量子比特之间没有或只有很少相互作用）。重要的是，尽管这个类别比低交集类别更一般，但 $k$-局域哈密顿量最多包含 $O(n^k)$ 个哈密顿量项，因此我们在本文中引入的学习方法仍然是可处理的。具有物理意义的 $k$-局域哈密顿量例子包括硬核玻色子模型、完全图上的 Heisenberg 模型，以及 Sherrington-Kirkpatrick 和 $p$-spin 模型等自旋玻璃模型。此外，许多量子算法将哈密顿量模拟用作子程序，因此出于认证目的，将哈密顿量学习的范围扩展到低交集类别之外，甚至扩展到自然界中不常见的“较少物理性”的哈密顿量，也是有用的。

我们考虑使用两种不同但相关的学习资源进行哈密顿量学习。第一种是一个我们称为哈密顿量“伪 Choi 态”的态；粗略地说，它是在更大的 Hilbert 空间中把哈密顿量表示为一个量子态：

$$
|\psi_c\rangle := \frac{(H\otimes I_A)|\Phi_d\rangle_{SA}|0\rangle_C+|\Phi_d\rangle_{SA}|1\rangle_C}{\alpha}.
\tag{1}
$$

其中 $H$ 是无量纲的，$\alpha$ 是归一化常数，$|\Phi_d\rangle_{SA}$ 是记为 $S$ 和 $A$ 的两个子系统上的最大纠缠态。给这个态取这样的名字，是因为该态左侧的 $(H\otimes I_A)|\Phi_d\rangle_{SA}$ 类似于 Choi 态；对于一个酉算子 $U_S\in\mathcal{H}_S$，Choi 态定义为 $|\psi_{\rm Choi}\rangle=(U_S\otimes I_A)|\Phi_d\rangle_{SA}$。然而，它通常不是 Choi 态，因为 $H$ 不必对应于一个 CPTP 映射。伪 Choi 态在定义 6 中形式化描述。虽然这些态不像热态那样由自然过程产生，但我们将看到，它们允许人们非常高效地学习哈密顿量系数，因此寻找高效生成它们的方法是有意义的。

所考虑的第二种学习资源是一个可控时间演化黑箱

$$
U=e^{-iHt}.
$$

与热态一样，系统的酉动力学也是用于学习系统哈密顿量的一种自然资源。除了热态制备的代价之外，从热态学习通常并不可行，例如在非常低的温度下。为了看出这一点，考虑两个哈密顿量 $H_0\succeq 0$ 和 $H_1\succeq 0$：

$$
H' = |\psi\rangle\langle\psi| + (I-|\psi\rangle\langle\psi|)H_0(I-|\psi\rangle\langle\psi|),
\tag{2}
$$

$$
H'' = |\psi\rangle\langle\psi| + (I-|\psi\rangle\langle\psi|)H_1(I-|\psi\rangle\langle\psi|).
\tag{3}
$$

在这两种情况下，零温基态都是 $|\psi\rangle\langle\psi|$，因此成功区分两个哈密顿量的成功概率为 $1/2$；这说明，对于足够低温的热态，学习所讨论的哈密顿量可能变得不实际。在这种情形中，使用系统的酉演化作为学习资源可能更方便。第 4 节中我们证明，伪 Choi 态可以利用时间演化及其逆演化高效生成。

由于时间演化酉算子只是生成伪 Choi 态的诸多可设想方法之一，第 3 节考虑的是更一般的哈密顿量学习场景：用户获得伪 Choi 态的若干副本，但对于它们如何生成没有任何承诺。关于伪 Choi 态的更多讨论，尤其是为什么它们可能比时间演化的普通 Choi 态更强，我们请读者参见第 6.3 节。另一方面，虽然时间演化酉算子只是生成这类态的一种具体例子，但它也是一种更直观的资源，尤其是在认证量子模拟器的语境中。此外，它已经在此前关于哈密顿量学习的工作中被用作学习资源（[11-15]），这使得各方法样本复杂度之间可以更直接地比较。因此，我们在第 4 节中将其作为一个单独情形考虑。

## 2.1 主要结果

需要指出的是，尽管下面的结果是针对 $k$-局域哈密顿量陈述的，我们的方法也可以应用于更一般的哈密顿量。特别地，只要哈密顿量项至多有 $\operatorname{poly}(n)$ 个，并且我们拥有关于哈密顿量结构的信息（即哪些哈密顿量项存在），则对于基于经典影子的方式和基于 QME 的方式，查询复杂度都仍然是量子比特数的多项式，计算复杂度也同样如此。此外，如果我们考虑用无穷范数学习哈密顿量系数，那么我们的方法能够仅使用对 $U$ 和 $U^\dagger$ 的 $\operatorname{poly}(n)$ 次查询，学习任意满足 $\|H\|\in\operatorname{poly}(n)$ 的 $n$ 量子比特哈密顿量。值得注意的是，这包括含有指数多个项的哈密顿量。对于这些具有指数多个哈密顿量系数的情形，虽然我们的方法在查询方面是高效的，但计算复杂度会是指数级的。然而，由于所有哈密顿量系数原则上可以在经典计算机上同时计算，如果可以访问较大的经典存储器，这一点可能在某种程度上得到缓解。

我们的第一个主要结果是定理 3，它给出学习一个哈密顿量所需伪 Choi 态数目的上界。

**定理 3（通过经典影子求解伪 Choi 哈密顿量学习问题）.** 对于一个 $k$-局域哈密顿量，为了以误差 $\epsilon$ 和至多 $\delta$ 的失败概率求解定义 1 的哈密顿量学习问题，所需伪 Choi 态的数目至多为

$$
N\in \widetilde{O}\!\left(\frac{\alpha^4 n^k}{\epsilon^2}\right),
$$

其中 $\alpha\le 1+\|H\|$ 是方程 (1) 中的归一化常数。

定理 3 在定理 16 中更详细地陈述，并在第 3.2.1 节证明。注意，在定理 3 中，我们用 $k$-局域哈密顿量的项数上界 $M\in O(n^k)$ 代替了 $M$，并且 $\widetilde{O}$ 记号隐藏了对数因子。

我们的第二个主要结果是定理 4，它给出使用经典影子学习哈密顿量所需对时间演化酉算子及其逆算子的查询次数上界。这个结果与前一个结果相关，因为我们的方法先通过查询哈密顿量的酉动力学生成伪 Choi 态的副本，然后以类似于证明定理 3 所用的方法继续进行。

**定理 4（通过经典影子求解酉哈密顿量学习问题）.** 对于一个 $k$-局域哈密顿量，为了以误差 $\epsilon$ 和至多 $\delta$ 的失败概率求解定义 1 的哈密顿量学习问题，所需对时间演化酉算子 $e^{-iHt}$ 及其逆算子的查询次数，其中 $t\in O(1/\|H\|)$，至多为

$$
N\in \widetilde{O}\!\left(\frac{n^k}{t^2\epsilon^2}\right).
$$

定理 4 在定理 26 中更详细地陈述，并在第 4.3.2 节证明。同样，我们已经用 $k$-局域哈密顿量的项数上界代替了哈密顿量项数 $M$。重要的是，我们用于生成资源态的方法生成的是归一化哈密顿量的伪 Choi 态，而不是真实哈密顿量的伪 Choi 态；这有效地使查询复杂度关于归一化常数获得二次改善。这在定理 4 中表现为关于 $1/t$ 的二次标度，与定理 3 中关于 $\alpha$ 的四次标度形成对比。

我们还证明，我们的学习算法对于两类误差是鲁棒的，并且事实上会给出一个见证，表明学习问题中发生了误差。我们证明鲁棒性的第一类误差是哈密顿量的欠指定：哈密顿量包含未在哈密顿量学习问题中指定的更多项。在这种情况下，我们证明，学习问题会给出系统中存在的哈密顿量项的系数；而未表征项的存在可以通过所观测到的系数和与从伪 Choi 态推断出的系数和之间的关系来推断。我们考虑的第二类鲁棒性是 Choi 态中的误差；在这种情况下，我们证明哈密顿量学习问题可以容忍多项式小的噪声，这表明该协议是鲁棒的。这些结果在第 7 节讨论。

我们的最后一个主要结果是定理 5，它给出使用 Huggins 等人 [19] 的均值估计结果来学习哈密顿量时，所需对时间演化酉算子及其逆算子的查询次数上界。与经典影子方法相比，这个过程需要更多量子计算（经典影子方法中，所有测量后的计算都是经典的），但它使查询复杂度关于演化时间和学习系数时的误差获得二次改善。

**定理 5（通过量子均值估计求解酉哈密顿量学习问题）.** 对于一个 $k$-局域哈密顿量，为了以误差 $\epsilon$ 和至多 $\delta$ 的失败概率求解定义 1 的哈密顿量学习问题，所需对时间演化酉算子 $e^{-iHt}$ 及其逆算子的查询次数，其中 $t\in O(1/\|H\|)$，至多为

$$
N\in \widetilde{O}\!\left(\frac{n^k}{\epsilon t}\right).
$$

定理 5 针对具有 $M$ 项的哈密顿量在第 5.2 节中重述为定理 33 并加以证明。尽管我们的输入模型要求反向时间演化，但据我们所知，这是将哈密顿量系数在 2-范数误差 $\epsilon$ 内学习出来的最佳查询复杂度（进一步讨论见第 6 节）。

需要提到的一个注意点是，为了从 $U$ 和 $U^\dagger$ 制备伪 Choi 态，我们的方法要求量级为 $1/\|H\|$ 的短演化时间，这阻止我们使用长演化时间来降低查询复杂度。此外，为了达到定理 4 和定理 5 中的查询复杂度，需要有 $\|H\|$ 的良好估计。如果没有这一知识，则可以用哈密顿量项数高估范数（这会导致演化时间短于必要时间），以确保算法不会失效。例如，这会使定理 5 中的查询复杂度额外增加一个 $n^k$ 因子。

# 3 从伪 Choi 态学习哈密顿量

本节组织如下。首先，我们解释在我们的哈密顿量学习模型中将考虑的两种学习资源中的第一种：哈密顿量的伪 Choi 态，见定义 6。接着，第 3.1 节总结经典影子过程（由 [18] 引入）中理解我们方法所必需的部分。最后，第 3.2 节包含本节的两个主要结果。具体而言：算法 1 描述如何利用经典影子层析从伪 Choi 态的多个副本学习哈密顿量；定理 16 描述该方法的样本复杂度。

注意，在学习过程中并非严格必须使用经典影子；任何影子层析协议，即任何允许人们估计给定量子态上算子期望值的协议，都可以替代使用。这里经典影子的主要好处有两个。第一，对于我们感兴趣的算子，这些算子的影子范数由一个常数上界控制，因此样本复杂度在哈密顿量项数方面具有有利标度。第二，一旦所有测量完成，算法的其余部分都是纯经典的。虽然我们主要关注的方法使用经典影子，第 5 节给出一种替代方法的例子。

我们的输入态，即哈密顿量的“伪 Choi 态”，由三个子系统构成。它包含我们感兴趣的子系统、一个同样大小的辅助子系统，以及一个额外的单量子比特子系统；该额外子系统用于确保哈密顿量的范数不会在伪 Choi 态中丢失。形式化定义如下。注意，本文中小写下标用作索引，而大写下标标识算子或态所对应的系统。例如，ket $|\Phi_d\rangle_{SA}$ 位于 Hilbert 空间 $\mathcal{H}_S\otimes\mathcal{H}_A$ 中。

**定义 6（伪 Choi 态）.** 令 $\mathcal{H}_S$ 是一个 $d=2^n$ 维 Hilbert 空间，包含无量纲哈密顿量 $H$ 的映射作用在该空间上。此外，令 $\mathcal{H}_A$ 是同样大小的辅助系统的 Hilbert 空间，并令 $\mathcal{H}_C$ 是另一个辅助量子比特的二维 Hilbert 空间。无量纲哈密顿量 $H$ 的伪 Choi 态位于 Hilbert 空间 $\mathcal{H}_S\otimes\mathcal{H}_A\otimes\mathcal{H}_C$ 上，定义为

$$
|\psi_c\rangle := \frac{(H\otimes I_A)|\Phi_d\rangle_{SA}|0\rangle_C+|\Phi_d\rangle_{SA}|1\rangle_C}{\alpha},
\tag{4}
$$

其中 $\alpha$ 是如下形式的归一化常数：

$$
\alpha := \sqrt{\langle\Phi_d|_{SA}(H^2\otimes I_A)|\Phi_d\rangle_{SA}+1},
\tag{5}
$$

并且

$$
|\Phi_d\rangle_{SA}=\frac{1}{\sqrt d}\sum_{i=0}^{d-1}|i\rangle_S\otimes |i\rangle_A
\tag{6}
$$

是 $\mathcal{H}_S$ 与 $\mathcal{H}_A$ 之间的最大纠缠态。

使用定义 1 中哈密顿量的表示展开 $\alpha$，容易证明（见附录 B.1）

$$
\alpha=\sqrt{\|c\|_2^2+1}.
\tag{7}
$$

注意，伪 Choi 态右侧的项很重要，因为它起到参考的作用，使我们能够学习哈密顿量的整体符号和范数；如果没有这个参考项，它们会表现为一个全局相位。

## 3.1 伪 Choi 态的影子层析

有了伪 Choi 态之后，我们现在可以开始利用影子层析学习哈密顿量系数。影子层析的思想是构造一个模型，该模型能够以低误差和高概率预测某一组特定可观测量的期望值。与常规层析不同，影子层析并不旨在提供一个具体的密度算子；这意味着输出的期望值不必与某个密度算子精确一致，该模型也不需要给出量子态的高保真度估计。相反，我们只要求它预测一组可观测量的输出。幸运的是，这正是我们重构哈密顿量所需要的，因此这个工具正好适合解决我们的问题。影子层析问题的形式化陈述如下。

**问题 7（影子层析问题）.** 给定一个未知量子态 $\rho$，其维数为 $d'=2^\eta$，以及一组 $L$ 个可观测量 $\{E_i\}$，使用尽可能少的 $\rho$ 的副本，在成功概率 $1-\delta_s$ 下，对所有 $1\le i\le L$，将 $\operatorname{Tr}(\rho E_i)$ 估计到误差 $\epsilon_s$ 以内 [23]。

在相关算子具有高效经典表示的情形中，例如 Pauli 算子，这个问题可以经典地求解。该方法称为经典影子层析 [18]，它使用少量 $\rho$ 的副本来创建 $\rho$ 的一个经典表示。第 3.2 节详细说明如何将经典影子与伪 Choi 态结合起来学习哈密顿量系数；但为了让读者清楚后续若干对象的来源，我们先简要概述经典影子层析。

我们这里考虑的经典影子版本涉及将 Clifford 群 $\operatorname{Cl}(2^\eta)$ 中的 Clifford 算子作用到一个 $\eta$ 量子比特态 $\rho$ 上。该过程包含 $N$ 轮；每一轮中，均匀随机采样一个 Clifford 算子 $U_i$ 并将其作用到 $\rho$ 上，随后在计算基中测量所得态的每个量子比特。每次测量之后，将形如 $\sigma_i=U_i^\dagger |b_i\rangle\langle b_i|U_i$ 的一个“快照”存储在经典存储器中。这里 $U_i$ 是第 $i$ 轮中随机采样并作用于 $\rho$ 的 Clifford 酉算子，$|b_i\rangle$ 是长度为 $\eta$ 的比特串，它编码第 $i$ 轮的测量结果。$|b_i\rangle$ 的第 $j$ 个比特是第 $j$ 个量子比特在计算基中的测量结果（即，如果 $|b_i\rangle$ 中某个比特为零，则相应量子比特的测量结果为 $|0\rangle$）。这些快照是稳定子态，也就是说，它们可以只用 Clifford 操作从 $|0\rangle^{\otimes\eta}$ 得到；因此，每个快照需要 $O(\eta^2)$ 个经典比特来存储 [21]。总体而言，该过程使用 $N$ 份 $\rho$ 来生成 $N$ 个经典快照。注意，虽然 $|b_i\rangle$ 是一个经典比特串，我们仍用 Dirac 记号表示它，因为这种记号更简洁，也与 [18] 中用于描述经典影子的原始记号保持一致。对所有 Clifford 酉算子和测量结果取这些快照的期望值，可以看作一个量子信道。特别地，由于 Clifford 群构成一个酉 3-design，随机采样 Clifford 操作对应如下退极化信道 [18]：

$$
D_{1/(2^\eta+1)}(\rho)=\frac{\rho}{2^\eta+1}+\left(1-\frac{1}{2^\eta+1}\right)\frac{\operatorname{Tr}(\rho)I}{2^\eta}
=\frac{\rho+\operatorname{Tr}(\rho)I}{2^\eta+1}.
\tag{8}
$$

这个信道可以如下反演：

$$
D^{-1}_{1/(2^\eta+1)}(\rho)=D_{2^\eta+1}(\rho)
=(2^\eta+1)\rho-\operatorname{Tr}(\rho)I,
\tag{9}
$$

其中第一行使用了 $D_a(D_b(\rho))=D_{ab}(\rho)$ 这一事实（这可以由退极化信道的定义容易证明），第二行直接来自退极化信道的定义。

于是，$\rho$ 的经典影子被定义为对每个快照施加这个逆信道后得到的 $N$ 个快照的集合，如定义 8 所示。

**定义 8（经典影子，由 Clifford 测量得到）.** 给定一个 $\eta$ 量子比特量子态 $\rho$ 的 $N$ 个副本，基于随机 Clifford 测量的经典影子过程返回 $\rho$ 的一个经典影子，形式为

$$
\hat\rho=\{\hat\rho_i\mid i\in\mathbb{Z}_N\},
\tag{10}
$$

其中

$$
\hat\rho_i=(2^\eta+1)(U_i^\dagger |b_i\rangle\langle b_i|U_i)-I
\tag{11}
$$

是将退极化信道的逆（方程 (9)）作用于第 $i$ 个经典快照的结果。

正如 Huang 等人 [18] 所示，经典影子可以用于高效预测态 $\rho$ 上算子的期望值，这正是影子层析问题所要求的。

注意，该过程要求随机采样 Clifford 线路，这并不像采样单量子比特算子（例如 Pauli 算子）那样简单。然而，最近的工作表明这个过程仍然可以高效完成。特别地，Bravyi 和 Maslov [24] 以及 van den Berg [25] 提出了以时间复杂度 $O(n^2)$ 和线路深度 $\widetilde{O}(n)$ 均匀随机采样 Clifford 线路的算法。后一种算法直接输出线路并允许并行化，从而有效地将时间复杂度降低到 $O(n)$；不过，为了达到其所声称的线路深度，需要具有全连接拓扑的量子计算机 [25]。与此同时，前一种方法在更简单的线性最近邻架构上实现了 $9n$ 的二量子比特门深度 [24]。

经典影子过程的另一个变体，是用单量子比特 Clifford 算子的张量积（即 $\operatorname{Cl}(2)^{\otimes\eta}$ 中的算子）替换 $\operatorname{Cl}(2^\eta)$ 中的随机 Clifford 算子。这个过程称为经典影子的“随机 Pauli 测量”版本，因为单量子比特 Clifford 群由 Hadamard 门和相位门生成，而这些操作会在 Pauli $X$、$Y$ 和 $Z$ 基之间实现变换。因此，只允许单量子比特 Clifford 操作并在计算（$Z$）基中测量，等价于只允许在 Pauli $X$、$Y$ 和 $Z$ 基中测量。下一节中，我们关注经典影子的 Clifford 测量版本，并把 Pauli 版本的讨论留到附录 A。

## 3.2 哈密顿量系数的高效估计（Clifford 影子）

本节中，我们讨论使用经典影子的 Clifford 测量版本从伪 Choi 态中提取哈密顿量系数。我们把这些系数的推断称为伪 Choi 哈密顿量学习问题（PC HLP）。注意，也可以使用经典影子的 Pauli 测量版本；该方法包含在附录 A 中。虽然 Pauli 版本只需要单量子比特操作，并且可以降低经典后处理的计算复杂度，但对于 $k$-局域系统，Clifford 版本具有更好的样本复杂度。然而，尽管两个样本复杂度上界之间的差距随 $k$ 指数增长，对于较小的 $k$ 值，Pauli 方法的优势可能超过其增加的样本复杂度。

由于经典影子层析允许高效预测算子的线性函数，我们可以通过选择一组特定算子来求解 PC HLP，这些算子的期望值对应于哈密顿量系数。对于基于 Clifford 的影子，这些“解码算子”由定义 9 给出。

**定义 9（解码算子）.** 令解码算子集合定义为

$$
\mathcal{O}:=\{O_l\mid l\in\mathbb{Z}_M\},
\tag{12}
$$

其中

$$
O_l := (H_l\otimes I)|\Phi_d\rangle_{SA}\langle\Phi_d|_{SA}\otimes |0\rangle_C\langle 1|_C,
\tag{13}
$$

并且 $H_l$ 是 $M$ 个哈密顿量项之一。

进一步地，我们定义

$$
O_\alpha := |\Phi_d\rangle_{SA}\langle\Phi_d|_{SA}\otimes |1\rangle_C\langle1|_C.
\tag{14}
$$

回忆定义 6，表示伪 Choi 态的密度矩阵为

$$
\begin{aligned}
\rho_c := |\psi_c\rangle\langle\psi_c|
=\frac{1}{\alpha^2}\Big(& (H\otimes I_A)|\Phi_d\rangle_{SA}\langle\Phi_d|_{SA}(H\otimes I_A)\otimes |0\rangle_C\langle0|_C \\
&+ (H\otimes I_A)|\Phi_d\rangle_{SA}\langle\Phi_d|_{SA}\otimes |0\rangle_C\langle1|_C \\
&+ |\Phi_d\rangle_{SA}\langle\Phi_d|_{SA}(H\otimes I_A)\otimes |1\rangle_C\langle0|_C \\
&+ |\Phi_d\rangle_{SA}\langle\Phi_d|_{SA}\otimes |1\rangle_C\langle1|_C\Big).
\end{aligned}
\tag{15}
$$

我们在下面的命题 10 中证明，作用在伪 Choi 态上的解码算子的期望值给出哈密顿量系数，差一个常数因子。注意，为了构造解码算子，哈密顿量项必须已知。由于本文关注 $k$-局域哈密顿量，这不是问题，因为最多只有 $O(n^k)$ 个可能项。

**命题 10（计算哈密顿量系数）.** 如果 $\rho_c$ 是伪 Choi 态 (15)，并且 $O_l$ 是定义 9 中定义的解码算子，则

$$
\operatorname{Tr}(\rho_c O_l)=\frac{c_l}{\alpha^2},
\tag{16}
$$

其中 $c_l$ 是第 $l$ 个哈密顿量系数，$\alpha$ 是伪 Choi 态的归一化常数 (7)。进一步地，

$$
\operatorname{Tr}(\rho_c O_\alpha)=\frac{1}{\alpha^2}.
\tag{17}
$$

**证明.** 由解码算子和伪 Choi 态的定义，容易看出

$$
\operatorname{Tr}(\rho_c O_l)=\frac{\langle\Phi_d|_{SA}(H\otimes I)(H_l\otimes I)|\Phi_d\rangle_{SA}}{\alpha^2}.
\tag{18}
$$

使用定义 1 中哈密顿量的表示展开上式，得到

$$
\begin{aligned}
\operatorname{Tr}(\rho_c O_l)
&=\frac{\langle\Phi_d|_{SA}\left(\sum_m c_mH_m\otimes I\right)(H_l\otimes I)|\Phi_d\rangle_{SA}}{\alpha^2} \\
&=\frac{1}{\alpha^2}\sum_m c_m\langle\Phi_d|_{SA}(H_m\otimes I)(H_l\otimes I)|\Phi_d\rangle_{SA}.
\end{aligned}
\tag{19}
$$

现在我们可以使用 $|\Phi_d\rangle_{SA}$ 的定义展开求和中的项：

$$
\begin{aligned}
\langle\Phi_d|_{SA}(H_m\otimes I)(H_l\otimes I)|\Phi_d\rangle_{SA}
&=\frac{1}{d}\sum_i\sum_j \langle i|H_mH_l|j\rangle\langle i|j\rangle \\
&=\frac{1}{d}\sum_i \langle i|H_mH_l|i\rangle \\
&=\frac{\operatorname{Tr}(H_mH_l)}{d}.
\end{aligned}
\tag{20}
$$

最后，将 (20) 代回 (19)，得到

$$
\operatorname{Tr}(\rho_c O_l)=\frac{1}{\alpha^2}\sum_m c_m\frac{\operatorname{Tr}(H_mH_l)}{d}
=\frac{1}{\alpha^2}\sum_m c_m\delta_{ml}
=\frac{c_l}{\alpha^2}.
\tag{21}
$$

第二个断言 $\operatorname{Tr}(\rho_cO_\alpha)=1/\alpha^2$ 直接来自伪 Choi 态的定义 (15) 以及 $O_\alpha$ 的定义。

我们希望使用 [18] 中引入的经典影子方法近似命题 10 中的期望值。然而，经典影子过程要求 Hermitian 算子，而 $O_l$ 不是 Hermitian 算子。因此，我们可以改用下面一对 Hermitian 算子：

$$
O_l^+ := O_l+(O_l)^\dagger,
\tag{22}
$$

$$
O_l^- := iO_l-i(O_l)^\dagger.
\tag{23}
$$

这两个算子都是 Hermitian 的，并且可以反解得到

$$
\frac{O_l^+-iO_l^-}{2}=O_l.
\tag{24}
$$

因此，可以通过使用经典影子估计 $O_l^+$ 和 $O_l^-$ 的期望值来预测 $O_l$ 的期望值：

$$
\langle O_l\rangle_s=\frac{\langle O_l^+\rangle_s-\langle iO_l^-\rangle_s}{2},
\tag{25}
$$

其中下标 $s$ 表示这些不是真实期望值，而是由经典影子过程生成的估计。

我们现在考虑对伪 Choi 态使用经典影子的 Clifford 测量版本。由于伪 Choi 态位于 $2n+1$ 个量子比特上，它的经典影子由 $N$ 个如下形式的分量组成：

$$
\hat\rho_i=(2^{2n+1}+1)U_i^\dagger |b_i\rangle\langle b_i|U_i-I.
\tag{26}
$$

然而，没有必要以这种显式形式存储影子。相反，使用定义 11 中指定的经典影子形式会很有帮助，并在需要时引入 $I$ 项以及因子 $2^{2n+1}+1$。

**定义 11.** 如果执行经典影子过程的随机 Clifford 测量版本，则所得大小为 $N$ 的经典影子可以以下列方式存储：

$$
\hat\rho=\{|\hat\rho_i\rangle\mid i\in\mathbb{Z}_N\},
\tag{27}
$$

其中

$$
|\hat\rho_i\rangle=U_i^\dagger |b_i\rangle.
\tag{28}
$$

估计哈密顿量系数向量 $c$ 的完整过程在算法 1 中给出。该算法还调用一个进一步的子程序（算法 2），用于利用经典影子确定期望值。算法 1 和算法 2 不使用定义 8 给出的经典影子的显式形式，而使用定义 11 给出的“压缩”版本。

Aaronson 和 Gottesman 先前的工作给出了在经典计算机上以多项式时间模拟 Clifford 线路的算法，以及一个以 $O(n^3)$ 时间计算两个稳定子态内积的算法 [21]。为以后引用方便，我们将第二个算法（见 [21] 第 III 节末尾）称为稳定子内积（SIP）算法。算法 1 调用前一种算法，而算法 2 利用 SIP 算法以多项式时间计算期望值。

注意，为了使算法 1 的输出求解 PC HLP，$\rho_c$ 的样本数必须足够大，使误差和成功概率满足哈密顿量学习问题 1 的要求。这个充分值稍后作为定理 16 给出。

为了配合算法 2，理解如何使用经典影子显式计算所涉及的期望值也很有帮助。命题 12 给出三个感兴趣期望值的表达式。这些表达式包含若干内积，它们可以用 [21] 的 SIP 算法高效计算。

**命题 12.** 令

$$
\hat\rho_i=(2^{2n+1}+1)U_i^\dagger |b_i\rangle\langle b_i|U_i-I
$$

是由经典影子过程的随机 Clifford 测量版本生成的一个经典影子，并考虑算子

$$
O_l^+=O_l+(O_l)^\dagger,
$$

$$
O_l^-=iO_l-i(O_l)^\dagger,
$$

其中 $O_l$ 是定义 9 中的解码算子。则有

$$
\begin{aligned}
\operatorname{Tr}(\hat\rho_iO_l^+)
&=(2^{2n+1}+1)\big(\langle b_i|U_i(H_l\otimes I_A)|\Phi_d\rangle_{SA}|0\rangle_C\big)
\big(\langle\Phi_d|_{SA}\langle1|_C U_i^\dagger|b_i\rangle\big)\\
&\quad +(2^{2n+1}+1)\big(\langle b_i|U_i|\Phi_d\rangle_{SA}|1\rangle_C\big)
\big(\langle\Phi_d|_{SA}(H_l\otimes I_A)\langle0|_C U_i^\dagger |b_i\rangle\big),
\end{aligned}
\tag{29}
$$

并且类似地，

$$
\begin{aligned}
\operatorname{Tr}(\hat\rho_iO_l^-)
&=i(2^{2n+1}+1)\big(\langle b_i|U_i(H_l\otimes I_A)|\Phi_d\rangle_{SA}|0\rangle_C\big)
\big(\langle\Phi_d|_{SA}\langle1|_C U_i^\dagger|b_i\rangle\big)\\
&\quad -i(2^{2n+1}+1)\big(\langle b_i|U_i|\Phi_d\rangle_{SA}|1\rangle_C\big)
\big(\langle\Phi_d|_{SA}(H_l\otimes I_A)\langle0|_C U_i^\dagger |b_i\rangle\big).
\end{aligned}
\tag{30}
$$

进一步地，

$$
\operatorname{Tr}(\hat\rho_iO_\alpha)=(2^{2n+1}+1)|\langle b_i|U_i|\Phi_d\rangle_{SA}|1\rangle_C|^2-1.
\tag{31}
$$

注意，$U_i^\dagger|b_i\rangle$ 位于 Hilbert 空间 $\mathcal{H}_S\otimes\mathcal{H}_A\otimes\mathcal{H}_C$ 上，所以上面所有内积都给出标量值。

命题 12 的证明见附录 B.2。如前所述，$U_i|b_i\rangle$ 是稳定子态。此外，对所有 $l\in M$，$H_l|\Phi_d\rangle_{SA}$ 也是稳定子态，因为哈密顿量项是 Pauli 算子，因此也是 Clifford 算子。由此可见，计算命题 12 中的期望值归结为计算若干稳定子态之间的内积，而这可以在经典计算机上完成。算法 2 使用 [21] 的 SIP 算法计算这些内积，然后执行中位数均值协议（正如经典影子过程 [18] 所规定的那样）以降低估计的方差。

**算法 1：FindCoeffClifford$(\rho_c^{\otimes N},\mathcal{H},n,N)$：使用基于随机 Clifford 测量的经典影子，从 $\rho_c$ 确定哈密顿量系数向量**

输入：

- $\rho_c^{\otimes N}$：$2n+1$ 个量子比特上的 $N$ 个伪 Choi 态集合，每个态位于 Hilbert 空间 $\mathcal{H}_S\otimes\mathcal{H}_A\otimes\mathcal{H}_C$ 上。
- $\mathcal{H}$：$M$ 个 $k$-局域哈密顿量项 $H_l$ 的集合，其系数 $c_m$ 是所需目标。
- 注意：$\rho_c^{\otimes N}$ 是量子态，而 $\mathcal{H}$ 是一组经典算子。
- $n$：Hilbert 空间 $\mathcal{H}_S$ 上系统中的量子比特数。
- $N$：伪 Choi 态数目。

1. 初始化哈密顿量系数数组。

   令 $\hat c\leftarrow [0,0,\ldots,0]_{1\times M}$，并令 $\hat c_l$ 表示 $\hat c$ 的第 $l$ 个元素。

2. 生成并存储经典影子。

   使用 $\rho_c$ 的 $N$ 个副本，利用 [18] 中基于随机 Clifford 测量的经典影子过程生成 $\rho_c$ 的大小为 $N$ 的经典影子 $\hat\rho$。

   使用 [21] 中引入的 tableau 算法，在经典存储器中存储 $\hat\rho$（按照定义 11），并计算和存储每个稳定子态 $|\rho_i\rangle=U_i^\dagger|b_i\rangle$。

3. 对每个相应哈密顿量项，生成 $\operatorname{Tr}(\rho O_l)=c_l/\alpha^2$ 的估计。

   对 $l$ 从 $0$ 到 $M-1$：

   $$
   \hat c_l \leftarrow \operatorname{ComputeExpectation}(\hat\rho,H_l,N,l,n),
   $$

   这是 $c_l/\alpha^2$ 的估计。

4. 生成 $\operatorname{Tr}(\rho O_\alpha)=1/\alpha^2$ 的估计。

   $$
   \hat o_\alpha\leftarrow \operatorname{ComputeExpectation}(\hat\rho,O_\alpha,N,-1,n),
   $$

   这是 $1/\alpha^2$ 的估计。

5. 从哈密顿量系数中移除因子 $1/\alpha^2$。

   令 $\hat c\leftarrow \hat c/\hat o_\alpha$。

6. 输出哈密顿量系数向量。

   返回 $\hat c=[\hat c_0,\hat c_1,\ldots,\hat c_{M-1}]$。

**算法 2：ComputeExpectation$(\hat\rho,O,N,l,n)$：用经典影子计算期望值**

输入：

- $\hat\rho$：资源态 $\rho$ 的大小为 $N$ 的经典影子，采用定义 11 的压缩形式。
- $H_l$：集合 $\mathcal{H}$ 中的 Hermitian 算子。
- $N$：经典影子 $\hat\rho$ 的大小。
- $l$：表示 $O$ 是 $M$ 个哈密顿量项中哪一个的整数。$l=-1$ 表示算法应使用用于估计归一化常数 $\alpha$ 的公式。
- $n$：系统中的量子比特数。

1. 遍历 $\hat\rho$ 的分量（$|\hat\rho_i\rangle=U_i^\dagger|b_i\rangle$），并对每个分量计算 $\operatorname{Tr}(\hat\rho_iO)$。

   令 $\hat o\leftarrow [0,0,\ldots,0]_{1\times N}$，并令 $\hat o_i$ 表示 $\hat o$ 的第 $i$ 个元素。

   如果 $l==-1$：

   对 $i$ 从 $0$ 到 $N-1$：

   使用 [21] 中给出的 SIP 算法计算方程 (31) 中的内积，从而计算 $\operatorname{Tr}(\hat\rho_iO_\alpha)$。

   否则：

   对 $i$ 从 $0$ 到 $N-1$：

   使用 [21] 中给出的 SIP 算法计算方程 (29) 中的四个内积，从而计算 $\operatorname{Tr}(\hat\rho_iO_l^+)$。

   使用 [21] 中给出的 SIP 算法计算方程 (30) 中的四个内积，从而计算 $\operatorname{Tr}(\hat\rho_iO_l^-)$。

   $$
   \hat o_i\leftarrow \frac{\operatorname{Tr}(\hat\rho_iO_l^+)-i\operatorname{Tr}(\hat\rho_iO_l^-)}{2},
   $$

   依照方程 (25)。

2. 执行中位数均值协议，并输出 $\operatorname{Tr}(\rho_cO_l)=c_l/\alpha^2$ 的估计。

   返回 $\operatorname{MedianOfMeans}(\hat o)$。

**算法 3：MedianOfMeans$(\hat o)$**

输入：

- $\hat o$：大小为 $N$ 的向量。

执行中位数均值协议：

将 $\hat o$ 的元素 $\hat o_i$ 分成 $K$ 个大小相等的组 $G_k$。

对 $k$ 从 $0$ 到 $K-1$：

$$
\hat o_k\leftarrow \operatorname{mean}(G_k).
$$

$$
\hat o_l\leftarrow \operatorname{median}(\hat o_0,\hat o_1,\ldots,\hat o_{K-1}).
$$

返回 $\hat o_l$。

[21] 中给出的 SIP 算法需要 $O(n^3)$ 时间来计算稳定子态之间的内积，而算法 2 对 $N$ 个快照中的每一个调用它 $O(1)$ 次（$N$ 的充分取值见定理 16）。算法 1 又会对 $M+1$ 个算子中的每一个调用算法 2，因此计算稳定子态之间所有内积的总时间复杂度为 $O(MNn^3)$。然而，所有这些计算相互独立，可以在算子和经典快照两方面并行化。因此，如果有大的经典存储器，可以通过大规模并行显著降低所需计算时间。

### 3.2.1 样本复杂度上界

本节的主要结果是定理 16，它证明了使用伪 Choi 态作为资源求解哈密顿量学习问题的样本复杂度。我们的结果依赖于影子范数的概念，为便于引用，我们在下面定义它。

**定义 13（基于 Clifford 影子的影子范数）.** 令 $O$ 是一个有限维算子。算子 $O$ 的影子范数定义为

$$
\|O\|_{\rm shadow}=\max_\sigma\left(\mathbb{E}_{U\in\mathcal{C}}\sum_{b\in\{0,1\}^n}\langle b|U\sigma U^\dagger|b\rangle\,\langle b|U\mathcal{M}^{-1}(O)U^\dagger|b\rangle^2\right)^{1/2},
$$

其中 $\mathcal{C}$ 是 Clifford 群，最大化在所有量子态上进行。

注意，上面的影子范数定义假设经典影子过程随机采样 Clifford 酉算子，而不是从其他系综中采样酉算子。

为了陈述定理 16 的证明，我们首先需要陈述界定影子范数的引理 14，以及给出 $\epsilon_s$ 取值的命题 15；该取值确保学习过程的总误差至多为 $\epsilon$，正如哈密顿量学习问题（定义 1）所要求的那样。

**引理 14（影子范数上界）.** 令集合 $\{O_\alpha\}\cup\{O_l^+,O_l^-\mid l\in\mathbb{Z}_M\}$ 记作 $\mathcal{O}\equiv\{O_i\mid i\in\mathbb{Z}_{2M}\}$。如果使用经典影子过程的 Clifford 测量版本来预测集合中算子的期望值，则每个算子的影子范数至多满足

$$
\|O_i\|_{\rm shadow}^2\le 3\operatorname{Tr}\big((O_i)^2\big)\le 6.
$$

引理 14 的证明见附录 B.3。

**命题 15.** 为了以至多 $\epsilon$ 的误差求解哈密顿量学习问题，令经典影子过程中的误差为

$$
\epsilon_s=\frac{\epsilon}{\alpha^2\sqrt{c_{\max}^2+1}\sqrt{M}},
$$

即可，其中 $c_{\max}$ 表示绝对值最大的哈密顿量系数。

命题 15 的证明见附录 B.4。

有了这些结果，我们可以证明下述结果，它给出求解学习问题所需资源态数量的标度。

**定理 16（PC HLP 的样本复杂度界）.** 算法 1 为了求解定义 1 给出的哈密顿量学习问题，所需伪 Choi 态 (4) 的副本数为

$$
N\in O\!\left(\frac{\alpha^4(c_{\max}+1)M\log(M/\delta)}{\epsilon^2}\right).
\tag{32}
$$

**定理 16 的证明.** 影子层析过程的样本复杂度取决于需要预测多少期望值。回忆 $M$ 是哈密顿量中的项数。算法 1 需要估计 $M$ 个期望值 $\langle O_l\rangle$（且每个 $\langle O_l\rangle$ 需要预测 2 个算子的期望值），以及 $\langle O_\alpha\rangle$。因此，需要通过影子层析估计其期望值的算子总数为 $2M+1$。令这些算子集合 $\{O_\alpha\}\cup\{O_l^+,O_l^-\mid l\in\mathbb{Z}_M\}$ 记作 $\mathcal{O}\equiv\{O_i\mid i\in\mathbb{Z}_{2M}\}$。

使用经典影子时，为了以总失败概率至多 $\delta$ 将所有期望值估计到采样误差 $\epsilon_s$ 内，样本复杂度为 [18]

$$
N_s=O\!\left(\frac{\log(M/\delta_s)}{\epsilon_s^2}\max_i\|O_i\|_{\rm shadow}^2\right).
\tag{33}
$$

由于我们使用的是经典影子过程的随机 Clifford 测量版本，引理 14 蕴含

$$
\max_i\|O_i\|_{\rm shadow}^2\le 6.
\tag{34}
$$

这个结果意味着，为了以概率 $\delta_s$ 在误差 $\epsilon_s$ 内预测算法 1 中的期望值，样本复杂度为

$$
N_s=O\!\left(\frac{\log(M/\delta_s)}{\epsilon_s^2}\right).
\tag{35}
$$

我们希望确定一个样本数上界，使得以概率 $1-\delta$，哈密顿量系数向量的 $l$-2 误差至多为 $\epsilon$，如哈密顿量学习问题 1 所要求。算法 1 的总失败概率就是经典影子过程的失败概率，因此 $\delta=\delta_s$。此外，为了在仍保证哈密顿量学习过程总误差至多为 $\epsilon$ 的同时最小化所需样本数，令 $\epsilon_s$ 取命题 15 中给出的值即可。将该 $\epsilon_s$ 值与方程 (35) 结合，得到所声称的结果。

值得注意的是，如果可以对量子态制备例程进行相干量子查询，则可以使用 Huggins 等人 [19] 的结果，以关于 $\epsilon$ 的二次更好标度来学习这些系数。然而，由于这样做需要引入一个更强的、允许相干查询的 oracle，我们在这里忽略此类优化，而在第 5 节重新讨论这种方法。

# 4 从酉时间演化黑箱学习哈密顿量

虽然伪 Choi 态作为学习资源可能看起来是一个奇怪的选择，但形如

$$
U=e^{-iHt}
\tag{36}
$$

的时间演化黑箱或许是一个更直观的学习资源选择，并且最近已经在哈密顿量学习的语境中得到研究 [11-14]。本节的目标是证明，通过查询这个时间演化酉算子及其逆算子，对于 $|t|\le \pi/(2\|H\|)$，我们可以产生类似于上一节伪 Choi 态的态，并因此使用与算法 1 非常相似的过程学习哈密顿量。这导向定理 26，它是本节的主要结果，给出为求解哈密顿量学习问题需要对 $U$ 和 $U^\dagger$ 查询多少次的上界。

生成伪 Choi 态的过程包含三个主要步骤。第一，使用时间演化黑箱生成一个编码哈密顿量的酉矩阵（称为哈密顿量的块编码）。第二，以受控方式将这个块编码作用到一个最大纠缠态（$|\Phi_d\rangle_{SA}$）和一个辅助量子比特上。这会在将块编码作用于输入态的一项和作为恒等作用于输入态的一项之间生成相对相位。最后，通过在计算基中测量辅助量子比特，以概率方式产生伪 Choi 态。该测量的结果指示该态是否成功生成。

这里出现的一个重要问题是，我们需要假设时间演化可以受控地实现。当我们考虑学习某个模拟器内部施加的哈密顿量时，这通常成立；但当学习一个无法如此操控的物理哈密顿量时，未必容易实现。在这样的情况下，如果酉算子的一个 $+1$ 本征态已知，我们仍然可以使用受控 swap 操作来执行控制。此外，值得注意的是，在实践中我们的方法还需要演化的逆。如果这些假设得到满足，那么我们能够证明学习资源可以被高效生成。另外，存在若干哈密顿量类别（“时间可逆哈密顿量”），对于它们，即使人们只能访问执行正向演化的黑箱，也可以高效执行反向时间演化。例如，可以表示为二部图的某些 Heisenberg 模型，最简单的是一维 Ising 模型，在给定时间演化黑箱访问权的情况下可以容易地时间反演。因此，如果一个哈密顿量可以高效地分解为相对较少的这类哈密顿量，我们的方法仍然可行，因为可以逐一学习这些时间可逆哈密顿量，直到恢复原始哈密顿量的所有系数。

## 4.1 生成伪 Choi 态

如上所述，生成伪 Choi 态的过程从使用时间演化酉算子创建哈密顿量的块编码开始。回忆伪 Choi 态由三个子系统构成。包含哈密顿量的映射作用于子系统 $S$（由下标 $S$ 表示），该子系统位于 $d$ 维 Hilbert 空间 $\mathcal{H}_S$ 中。子系统 $A$ 是一个与 $S$ 同样大小的辅助系统。最后，子系统 $C$ 是一个单量子比特，用于保留关于哈密顿量整体符号和范数的信息。除这三个子系统之外，我们现在还需要一个额外子系统 $B$，它是一个用于块编码目的的单量子比特，并将被称为“块编码量子比特”。我们在下面形式化块编码的概念。

**定义 17（块编码）.** 令 $U_{\rm block}$ 是一个作用在 Hilbert 空间 $\mathcal{H}_B\otimes\mathcal{H}_S$ 上的酉算子。如果

$$
\frac{H}{\Delta}=(\langle0|_B\otimes I_S)U_{\rm block}(|0\rangle_B\otimes I_S),
\tag{37}
$$

则我们称该酉算子是哈密顿量 $H$ 的一个块编码（更具体地，是 [26] 第 4 节中定义的一个 $(\Delta,\dim(\mathcal{H}_B),0)$-块编码），其中 $\Delta$ 是一个归一化因子。

在我们的语境中，这个酉块编码扮演的角色与其他量子哈密顿量学习方法中制备纯化 Gibbs 态的酉算子类似。$U_{\rm block}$ 不是用于制备 Gibbs 态，而是用于制备伪 Choi 态；随后我们可以像第 3.2 节中的算法 1 和算法 2 那样恢复哈密顿量系数。

Gilyén 等人 [26] 发展了一种生成算子对数的块编码的方法，而这正是我们希望对时间演化算子所做的事情。将他们的结果修改以适配我们的问题，可总结为下面的引理 18。

**引理 18（从时间演化酉算子产生块编码哈密顿量 [26]）.** 令 $U=e^{-iHt}$，其中 $H$ 是 Hermitian 的并且 $\|Ht\|\le 1/2$。令 $\epsilon_b\in(0,1/2]$ 是块编码误差。使用

$$
O(\log(1/\epsilon_b))
$$

次对 $U$ 和 $U^{-1}$ 的受控查询，以及 $O(\log(1/\epsilon_b))$ 个二量子比特门和一个辅助量子比特，可以产生如下形式的哈密顿量块编码：

$$
U_{\rm block}=\begin{bmatrix}
\frac{2\widetilde{H}t}{\pi} & I \\
J & K
\end{bmatrix},
\tag{38}
$$

使得

$$
\|Ht-\widetilde{H}t\|\le \epsilon_b.
\tag{39}
$$

引理 18 的证明见 [26]（引理 18 与 [26] 中的推论 71 相同，只是将 $H$ 替换为 $\widetilde{H}t$）；其一般思想是，$\sin(Ht)=(e^{iHt}-e^{-iHt})/(2i)$ 可以通过酉线性组合（LCU）技术实现，从而得到 $\sin(Ht)$ 的一个块编码。随后可以使用量子奇异值变换（QSVT）构造一个近似该量的 $\arcsin$ 的多项式，从而得到 $2Ht/\pi$ 的近似块编码。这可以通过量子奇异值变换方法或酉线性组合方法实现 [26-28]。

使用引理 18 中的哈密顿量块编码，我们现在可以按照引理 19 生成伪 Choi 态。由于块编码中的哈密顿量包含一个因子 $2t/\pi$，所产生的伪 Choi 态将与第 3 节中的态（方程 (4)）略有不同。也就是说，生成的不是 $\widetilde{H}$ 的伪 Choi 态，而是 $2\widetilde{H}t/\pi$ 的伪 Choi 态：

$$
|\psi'_c\rangle=
\frac{|0\rangle_C\left(\frac{\widetilde H}{\Delta}\otimes I_A\right)|\Phi_d\rangle_{SA}+|1\rangle_C|\Phi_d\rangle_{SA}}{\gamma},
\tag{40}
$$

其中

$$
\gamma=\sqrt{\frac{\|\widetilde c\|_2^2}{\Delta^2}+1},
\tag{41}
$$

并且

$$
\Delta=\frac{\pi}{2t}.
\tag{42}
$$

上面的向量 $\widetilde c$ 是与块编码哈密顿量 $\widetilde H$ 对应的哈密顿量系数向量（见下一节定义 20）。

**引理 19（从哈密顿量块编码生成伪 Choi 态）.** 令 $t$ 是区间 $(0,1/(2\|H\|)]$ 中的一个正数。存在一个算法，它使用一次对 $U_{\rm block}$ 的受控应用，生成如下形式的伪 Choi 态：

$$
|\psi'_c\rangle=rac{|0\rangle_C(\widetilde H/\Delta\otimes I_A)|\Phi_d\rangle_{SA}+|1\rangle_C|\Phi_d\rangle_{SA}}{\gamma},
$$

其中 $\Delta=\pi/(2t)$ 且 $\gamma=\sqrt{\|\widetilde c\|_2^2/\Delta^2+1}$；该生成由一次测量宣告成功，成功概率严格大于 $1/2$。

图 4.1 给出从哈密顿量块编码 $U_{\rm block}$ 生成伪 Choi 态的一个显式线路，引理 19 的证明细节见附录 B.5。注意，上面对演化时间的限制继承自引理 18。

**图 4.1：** 产生引理 19 中伪 Choi 态的量子线路。如果在计算基中测量寄存器 $B$ 中的量子比特后发现它处于态 $|0\rangle$，则其余寄存器的输出就是伪 Choi 态 $|\psi'_c\rangle$。该结果出现的概率等于

$$
\frac{\|c\|_2^2}{2\Delta^2}+\frac12,
$$

其中 $\|c\|_2$ 是哈密顿量系数向量的 2-范数，且 $\Delta=\pi/(2t)$。

## 4.2 通过影子层析学习

由于块编码 $U_{\rm block}$ 被用于产生我们的资源态，学习过程将生成对块编码中的哈密顿量的近似。这意味着，由于块编码中的哈密顿量并不完全等于真实哈密顿量，还会引入额外误差。

我们现在用真实哈密顿量、它的块编码近似、学习过程恢复的哈密顿量，以及它们对应的系数向量，来重新表述哈密顿量学习问题如下。

**定义 20.** 对真实哈密顿量 $H$、块编码哈密顿量 $\widetilde H$ 以及学习过程得到的近似 $\widehat H$，我们采用以下三个定义：

1. 令

   $$
   H:=\sum_{m=0}^{M-1}c_mH_m
   $$

   是我们希望学习的哈密顿量，并令 $c$ 是其哈密顿量系数向量（即它在某个正交归一基 $\{H_m\mid m\in\mathbb{Z}_M\}$ 中表示的系数）。

2. 令

   $$
   \widetilde H:=\sum_{m=0}^{M-1}\widetilde c_mH_m
   $$

   是由块编码过程得到的 $H$ 的近似，并令 $\widetilde c$ 是其哈密顿量系数向量。

3. 令

   $$
   \widehat H:=\sum_{m=0}^{M-1}\widehat c_mH_m
   $$

   是学习过程得到的对 $\widetilde H$ 的近似，并令 $\widehat c$ 是其哈密顿量系数向量。

以上定义自然导向如下的哈密顿量学习问题定义。

**定义 21（酉哈密顿量学习问题）.** 哈密顿量学习问题是：通过查询 $U=e^{-iHt}$ 和 $U^\dagger$，对于任意 $\epsilon>0$ 和 $\delta>0$，计算一个向量 $\widehat c$，使得以至少 $1-\delta$ 的概率有

$$
\|\widehat c-c\|_2\le \epsilon.
\tag{43}
$$

我们还如下定义学习块编码中出现的近似哈密顿量 $\widetilde H$ 的任务。

**定义 22（块编码哈密顿量学习问题）.** 块编码哈密顿量学习问题是：通过查询 $U_{\rm block}$，计算一个向量 $\widehat c$，使得以至少 $1-\delta$ 的概率有

$$
\|\widehat c-\widetilde c\|_2\le \epsilon_c.
\tag{44}
$$

回忆引理 18 还给出 $\epsilon_b$，即块编码哈密顿量误差的上界。

从伪 Choi 态 (40) 出发，我们可以以类似于上面所考虑的 PC HLP 的方式学习哈密顿量系数。具体地，回忆

$$
O_l=|0\rangle_C\langle1|_C\otimes (H_l\otimes I)|\Phi_d\rangle_{SA}\langle\Phi_d|_{SA},
\tag{45}
$$

其中 $H_l$ 是一个哈密顿量项，并令

$$
O_\gamma=|1\rangle_C\langle1|_C\otimes |\Phi_d\rangle_{SA}\langle\Phi_d|_{SA}.
\tag{46}
$$

按照以下方式定义伪 Choi 态的密度算子 $\rho'_c$：

$$
\rho'_c:=|\psi'_c\rangle\langle\psi'_c|,
\tag{47}
$$

从而

$$
\operatorname{Tr}(\rho'_cO_l)=\frac{c_l}{\Delta\gamma^2},
\tag{48}
$$

其中 $c_l$ 是第 $l$ 个哈密顿量系数，并且

$$
\operatorname{Tr}(\rho'_cO_\gamma)=\frac{1}{\gamma^2},
\tag{49}
$$

其中 $\gamma$ 在 (41) 中定义。因此，算法 4 中概述的整个学习过程包括：首先从哈密顿量生成足够数量的伪 Choi 态 (40)，运行算法 1，然后将结果乘以 $\Delta$。

## 4.3 从时间演化酉算子进行哈密顿量学习的查询复杂度

对于这个模型，比样本复杂度更有意义的是查询复杂度，也就是对 $U=e^{-iHt}$ 的（受控）查询次数。本节的主要结果是定理 26，它给出为了求解酉 HLP 21 需要查询时间演化酉算子的次数上界。我们首先为一个较简单的任务，即求解块编码 HLP 22，找到类似的上界。

**定理 23（求解块编码 HLP 的查询复杂度上界）.** 对于一个已知 $M$ 个哈密顿量项的哈密顿量，为求解块编码哈密顿量学习问题 22 所需对块编码 (37) 的查询次数至多为

$$
\widetilde N\in O\!\left(\frac{M\gamma^2(\widetilde c_{\max}^2+1/t^2)\log(M/\delta)}{\epsilon_c^2}\right).
\tag{50}
$$

**定理 23 的证明.** 使用经典影子预测算法 4 中 $2M$ 个算子的期望值的样本复杂度为

$$
N_s\in O\!\left(\frac{\log(M/\delta_s)}{\epsilon_s^2}\right).
\tag{51}
$$

这是为了以至少 $1-\delta_s$ 的概率，对所有 $m\in\mathbb{Z}_M$，将 $1/\gamma^2$ 和 $\hat o_m=\widetilde c_m/(\gamma^2\Delta)$ 预测到误差 $\epsilon_s$ 内所需的伪 Choi 态 (40) 数量。将每个 $\hat o_m$ 乘以 $\gamma^2\Delta$，就得到块编码哈密顿量的系数 $\widetilde c_m$，误差为

$$
\epsilon_m\equiv \gamma^2\epsilon_s\sqrt{\widetilde c_m^2+\Delta^2}.
\tag{52}
$$

回忆学习这些系数是定义 22 中块编码 HLP 的目标。算法 4 返回的哈密顿量系数向量与块编码哈密顿量的系数向量之间的 $l_2$ 误差为

$$
\|\widetilde c-\widehat c\|_2\le \sqrt{M}\max_m\epsilon_m
=\sqrt{M}\gamma^2\epsilon_s\sqrt{\widetilde c_{\max}^2+\Delta^2},
\tag{53}
$$

其中 $\widetilde c_{\max}$ 是绝对值最大的系数。为了满足块编码 HLP 22，我们令该误差上界等于 $\epsilon_c$。因此，以下 $\epsilon_s$ 取值足以求解块编码 HLP：

$$
\epsilon_s=\frac{\epsilon_c}{\sqrt{M}\gamma^2\sqrt{\widetilde c_{\max}^2+\Delta^2}}.
\tag{54}
$$

将这个 $\epsilon_s$ 值代入方程 (51)，意味着为求解哈密顿量学习问题所需伪 Choi 态总数为

$$
N_s\in O\!\left(\frac{M\gamma^4(\widetilde c_{\max}^2+\Delta^2)\log(M/\delta_s)}{\epsilon_c^2}\right).
\tag{55}
$$

现在我们已经有了以至少 $1-\delta_s$ 的概率求解块编码 HLP 22 所需伪 Choi 态 (40) 数量的上界，我们希望知道需要多少次对 $U_{\rm block}$ 的查询才能以至少 $1-\delta$ 的概率求解块编码 HLP。因此，我们必须考虑学习算法的失败概率。

为了高估整个学习过程的失败概率，我们假设如果产生的伪 Choi 态少于 $N_s$ 个，学习一定失败；并且只要产生的伪 Choi 态数至少为 $N_s$，经典影子的成功概率就是相同的。我们的学习算法失败的概率于是为

$$
P_{\rm fail}\le \delta_s+\delta_{N_s}\equiv \delta,
\tag{56}
$$

其中 $\delta_s$ 是当我们有 $N_s$ 个伪 Choi 态时经典影子失败的概率，$\delta_{N_s}$ 是在对 $U_{\rm block}$ 查询 $\widetilde N$ 次后产生少于 $N_s$ 个伪 Choi 态的概率；第三行来自块编码 HLP 22 的要求，即失败概率必须至多为 $\delta$。然后令 $\delta_s\equiv\delta_{N_s}\equiv\delta/2$。这个 $\delta_s$ 的选择给出

$$
N_s\in O\!\left(\frac{M\gamma^4(\widetilde c_{\max}^2+\Delta^2)\log(M/\delta)}{\epsilon_c^2}\right).
\tag{57}
$$

接着，可以通过 Chernoff 界证明，为了以至少 $1-\delta$ 的概率确保产生 $N_s$ 个伪 Choi 态，需要对块编码 $U_{\rm block}$ 查询

$$
\widetilde N\in O\!\left(\frac{N_s}{\gamma^2}\right)
\tag{58}
$$

次。注意，这里的渐近记号可能具有误导性，因为 $\gamma^2$ 大于 1，但 $\widetilde N$ 实际上大于 $N_s$（见附录 B.6）。将它与上面对 $N_s$ 的上界结合，并使用 $\Delta=\pi/(2t)$，得到

$$
\widetilde N\in O\!\left(\frac{M\gamma^2(\widetilde c_{\max}^2+1/t^2)\log(M/\delta)}{\epsilon_c^2}\right),
\tag{59}
$$

从而证明定理 23 的结果。

### 4.3.1 为块编码误差和块编码学习误差选择足够的取值

定理 23 给出求解块编码 HLP 22 所需哈密顿量块编码数目的上界。注意，求解块编码 HLP 只是求解酉 HLP 21 的一个子任务；缺失的步骤是从时间演化酉算子 $e^{-iHt}$ 生成哈密顿量块编码。这意味着，为了确定总查询复杂度，我们必须计入生成所需数量哈密顿量块编码的查询次数。此外，由于引理 18 中描述的过程生成的块编码具有误差 $\epsilon_b$，学习算法近似的不是 $H$ 的哈密顿量项系数，而是块编码中 $H$ 的近似的系数。因此，块编码误差 $\epsilon_b$ 会进一步影响总查询复杂度。

我们现在寻找块编码误差 $\epsilon_b$ 和块编码学习误差 $\epsilon_c$ 的取值，使得学习哈密顿量的总误差至多为 $\epsilon$，正如酉 HLP 21 所要求的。我们从下面的命题开始。

**命题 24.** 块编码哈密顿量 $\widetilde H$ 的哈密顿量系数向量 $\widetilde c$ 的误差满足上界

$$
\|\widetilde c-c\|_2\le \frac{\sqrt{M}\epsilon_b}{t},
$$

其中 $M$ 是哈密顿量项数，$t$ 是用于生成块编码的演化时间，$\epsilon$ 是引理 18 中的块编码误差。

**命题 24 的证明.**

$$
\begin{aligned}
|\widetilde c_m-c_m|
&=\frac{1}{d}\operatorname{Tr}(\widetilde H H_m)-\frac{1}{d}\operatorname{Tr}(HH_m)\\
&=\frac{1}{d}\operatorname{Tr}((\widetilde H-H)H_m)\\
&\le \frac{1}{d}\sum_{i=1}^k \sigma_i(\widetilde H-H)\sigma_i(H_m)\\
&\le \frac{1}{d}\sigma_{\max}(\widetilde H-H)\sum_{i=1}^k\sigma_i(H_m)\\
&=\frac{1}{d}\sigma_{\max}(\widetilde H-H)\sum_{i=1}^k |\lambda_i(H_m)|\\
&=\frac{1}{d}\sigma_{\max}(\widetilde H-H)\operatorname{Tr}\!\left(\sqrt{H_m^\dagger H_m}\right)\\
&=\sigma_{\max}(\widetilde H-H)\\
&=\|\widetilde H-H\|_2.
\end{aligned}
\tag{60}
$$

第一个不等式使用了 Von Neumann 迹不等式，其中 $\sigma_i(A)$ 是 $A$ 的按降序排列的第 $i$ 个奇异值。同样，$\sigma_{\max}(\widetilde H-H)$ 是 $\widetilde H-H$ 中幅值最大的奇异值。

注意该结果不依赖于 $m$，因此我们用它完成证明：

$$
\begin{aligned}
\|\widetilde c-c\|_2
&\le \sqrt M\|\widetilde c-c\|_\infty\\
&=\sqrt M\max_m|\widetilde c_m-c_m|\\
&\le \sqrt M\|\widetilde H-H\|_2\\
&\le \frac{\sqrt M\epsilon_b}{t},
\end{aligned}
\tag{61}
$$

其中最后一行使用了引理 18 的结果。

为 $\epsilon_b$ 和 $\epsilon_c$ 选择充分取值的下一步，是如引理 25 那样，用 $\epsilon_b$ 和 $\epsilon_c$ 来上界求解酉 HLP 的总学习误差。

**引理 25（酉 HLP 的误差上界）.** 通过使用算法 4 求解酉 HLP 所恢复的系数向量与真实哈密顿量系数向量之间的总误差上界为

$$
\|\widehat c-c\|_2\le \epsilon_c+\frac{\sqrt M\epsilon_b}{t},
$$

其中 $\epsilon_c$ 是学习块编码哈密顿量的误差（见定义 22），$\epsilon_b$ 是块编码本身的误差（见引理 18）。

**引理 25 的证明.**

$$
\begin{aligned}
\|\widehat c-c\|_2
&=\|\widehat c-\widetilde c+\widetilde c-c\|_2\\
&\le \|\widehat c-\widetilde c\|_2+\|\widetilde c-c\|_2\\
&\le \epsilon_c+\|\widetilde c-c\|_2.
\end{aligned}
\tag{62}
$$

注意，第二个不等式由对哈密顿量块编码 $U_{\rm block}$ 进行足够次数查询以求解块编码 HLP (22) 来保证。定理 23 给出该查询次数的上界。

将这与命题 24 的结果结合，得到引理 25。

最后，为了使哈密顿量学习问题 (21) 的总误差达到所需上界 $\|\widehat c-c\|_2\le\epsilon$，我们只需选择 $\epsilon_b$ 和 $\epsilon_c$，使引理 25 中不等式右端小于 $\epsilon$。由于学习过程比块编码过程昂贵得多，将大部分误差预算分配给 $\epsilon_c$ 是合理的，下一节将讨论这一点。

### 4.3.2 查询复杂度上界

有了前面的结果，我们现在可以陈述酉 HLP 21 的查询复杂度界。与块编码 HLP 和 PC HLP 不同，我们现在考虑通过第 4.1 节描述的过程对伪 Choi 态进行酉制备。注意，下面我们不使用幅度放大，因为该学习问题的成功概率至少为 $1/2$，这意味着幅度放大不会带来渐近优势。

**定理 26（求解酉 HLP 的查询复杂度上界）.** 对于一个具有 $M$ 个哈密顿量项的哈密顿量，为了求解酉哈密顿量学习问题 21，所需对时间演化酉算子 $e^{-iHt}$ 及其逆算子的查询次数至多为

$$
N\in O\!\left(\frac{M\log(M/\delta)}{t^2\epsilon^2}\log\!\left(\frac{M}{t\epsilon}\right)\right),
\tag{63}
$$

其中 $t\in O(1/\|H\|)$。

**定理 26 的证明.** 由定理 23，为求解块编码 HLP 22 所需块编码数为

$$
\widetilde N\in O\!\left(\frac{M\gamma^2(\widetilde c_{\max}^2+1/t^2)\log(M/\delta)}{\epsilon_c^2}\right).
\tag{64}
$$

引理 18 表明，生成每个块编码需要对时间演化黑箱 $U=e^{-iHt}$ 及其逆算子查询 $O(\log(1/\epsilon_b))$ 次。由于我们应用引理 18 产生块编码，注意 $\epsilon$ 以及 $\epsilon_b\le1/2$ 的前提条件是重要的；如果 $\epsilon_b\le\epsilon$，后一条件由我们对 $\epsilon$ 的假设保证。接着，回忆 $\gamma^2/2$ 是测量块编码量子比特时投影到伪 Choi 态上的概率。引理 19 蕴含，在假设 $t\in O(1/\|H\|)$ 下，$\gamma^2\in O(1)$。此外，我们假设每个哈密顿量系数满足 $|c_m|\le1$。由于可以通过选择更大或更小的演化时间来重新缩放哈密顿量系数的范数，我们可以为我们的态学习作出这样的选择，而不限制我们方法可学习的哈密顿量类别。因此，哈密顿量学习问题 (21) 的总查询复杂度上界为

$$
N\in O\!\left(\frac{M\log(M/\delta)}{t^2\epsilon_c^2}\log\!\left(\frac{1}{\epsilon_b}\right)\right).
\tag{65}
$$

为了满足问题 21，总误差必须满足 $\|\widehat c-c\|_2\le\epsilon$。由引理 25 可知，只要选择 $\epsilon_c$ 和 $\epsilon_b$ 使得 $\epsilon_c+M\epsilon_b/t\le\epsilon$，即可做到这一点。如果我们给这两项各分配 $\epsilon/2$ 的误差预算，即选择

$$
\epsilon_c:=\epsilon/2,
\tag{66}
$$

并且

$$
\epsilon_b:=\frac{\epsilon t}{2M},
\tag{67}
$$

则得到定理 26 中给出的查询复杂度。

注意，为了确定渐近标度，误差预算的选择在某种程度上是任意的，因为它只会以常数因子影响查询复杂度。然而，由于查询复杂度对 $\epsilon_c^{-1}$ 是二次的，但只对 $\epsilon_b^{-1}$ 是对数的，将大部分误差预算分配给 $\epsilon_c$ 是合乎逻辑的。例如，选择

$$
\epsilon_c\le \left(1-\frac{1}{M}\right)\epsilon
\tag{68}
$$

以及

$$
\epsilon_b\le \frac{t\epsilon}{M^2}
\tag{69}
$$

会使总误差至多为 $\epsilon$，并且对于较大的 $M$，只会使查询复杂度增加一个大约为 2 的常数因子。由此，我们的假设 $\epsilon_b\le1/2$ 立即由 $\epsilon\le M^2/(2t)$ 得出。

# 5 通过量子均值估计进行哈密顿量学习

前面考虑的方法具有很大优势。特别地，所需的量子操作是简单的 Pauli 或 Clifford 操作（取决于所用经典影子的类型），并且在测量完成后，所有期望值都可以在经典计算机上高效计算。还应指出，如果我们考察哈密顿量系数的 $l_\infty$ 误差，它也允许我们学习哈密顿量而不显式依赖于哈密顿量中的项数（尽管本文始终重点关注 $l_2$ 误差度量，因为它更好地突出我们方法与先前方法在查询复杂度上的差异）。然而，这种方法最显著的缺点是它关于 $1/\epsilon$ 的标度较差。可以通过放弃使用影子，并使用量子计算机直接从 PC 态估计所有项来缓解这一点；具体方式是使用均值估计算法计算哈密顿量的期望值。

[19] 中提出了一种估计可观测量向量期望值的算法。该方法背后的核心思想是，将均值估计问题归约为关于哈密顿量项之和的指数的梯度估计过程。随后可以使用 [29] 的技术最优地执行梯度估计过程，从而允许使用在相关参数上也最优标度的查询次数来估计均值向量。关键结果是，对于某个态 $\psi$，范数至多为 $\nu_{\max}$ 的 $M$ 个算子的一组均值，可以在 $l_\infty$ 误差 $\epsilon'$ 和至多 $\delta$ 的失败概率下，使用

$$
\widetilde O(\nu_{\max}\sqrt M/\epsilon')
$$

次对制备 $\psi$ 的酉算子的查询，以及对执行每个算子指数的 oracle 的查询来计算。在引理 29 中，我们证明使用该技术学习哈密顿量所需的同类查询次数为

$$
\widetilde O(\alpha^2M/\epsilon),
$$

其中 $\epsilon$ 是哈密顿量系数的 $l_2$ 误差，而 $\alpha^2$ 是伪 Choi 态中的归一化因子。

本节的主要结果稍后在定理 33 中给出，它给出求解哈密顿量学习问题所需对时间演化酉算子的查询次数上界。然而，我们首先在第 5.1 节证明引理 29，它解决一个更简单的问题。特别地，它假设我们有一个酉 oracle 来制备资源态，并给出求解哈密顿量学习问题所需对该 oracle 查询次数的上界。接着，在第 5.2 节中，我们展示如何通过查询时间演化算子及其逆算子，以酉方式生成资源态，然后证明定理 33。

## 5.1 从资源态的酉制备学习哈密顿量系数

与基于 Pauli 的经典影子的情形一样，我们将从伪 Choi 态出发，并对辅助系统 $A$ 做偏迹，得到以下资源态：

$$
\rho=\frac{1}{d\alpha^2}\left(H^2\otimes |0\rangle_C\langle0|_C+H\otimes |0\rangle_C\langle1|_C+H\otimes |1\rangle_C\langle0|_C+I\otimes |1\rangle_C\langle1|_C\right),
\tag{70}
$$

其中

$$
\alpha=\sqrt{\|c\|_2^2+1},
\tag{71}
$$

并且 $c$ 是哈密顿量系数向量。

接下来，我们定义将用于从资源态中提取哈密顿量系数的解码算子。

**定义 27（解码算子）.** 令解码算子集合定义为

$$
\mathcal{O}\equiv\{O_l\mid l\in\mathbb{Z}_M\},
\tag{72}
$$

其中

$$
O_l=\frac{H_l\otimes X_C}{2},
\tag{73}
$$

并且 $H_l$ 是 $M$ 个哈密顿量项之一。

进一步地，我们定义

$$
O_\alpha\equiv I\otimes |1\rangle_C\langle1|_C.
\tag{74}
$$

命题 28 表明，对于我们的资源态 $\rho$，解码算子的期望值可以用于恢复哈密顿量系数以及资源态的归一化因子。

**命题 28（计算哈密顿量系数）.** 如果 $\rho$ 是资源态 (70)，那么对于所有 $l\in\mathbb{Z}_M$，有

$$
\operatorname{Tr}(\rho O_l)=\frac{c_l}{\alpha^2},
\tag{75}
$$

其中 $c_l$ 是第 $l$ 个哈密顿量系数，而 $\alpha$ 是伪 Choi 态的归一化常数 (7)。进一步地，

$$
\operatorname{Tr}(\rho O_\alpha)=\frac{1}{\alpha^2}.
\tag{76}
$$

**命题 28 的证明.** 由 $O_l$ 和资源态 $\rho$ 的定义，容易看出

$$
\operatorname{Tr}(\rho O_l)=\frac{\operatorname{Tr}(HH_l)}{d\alpha^2}.
\tag{77}
$$

使用定义 1 中哈密顿量的表示展开上式，得到

$$
\begin{aligned}
\operatorname{Tr}(\rho O_l)&=\frac{\sum_m c_m\operatorname{Tr}(H_mH_l)}{d\alpha^2}\\
&=\frac{1}{d\alpha^2}\sum_m c_m\delta_{ml}d\\
&=\frac{c_l}{\alpha^2}.
\end{aligned}
\tag{78}
$$

第二个断言 $\operatorname{Tr}(\rho O_\alpha)=1/\alpha^2$ 直接来自方程 (135) 以及 $O_\alpha$ 的定义。

接下来，我们证明通过查询一个制备资源态的酉 oracle，可以高效求解哈密顿量学习问题。

**引理 29.** 令 $U_\rho$ 是一个制备方程 (70) 中态 $\rho$ 的酉 oracle。定义 1 中的哈密顿量学习问题可以使用

$$
\widetilde O\!\left(\frac{\alpha^2M}{\epsilon}\right)
$$

次对 $U_\rho$ 和 $U_\rho^\dagger$ 的查询，以及对为每个解码算子 $O_l$ 实现 $\operatorname{controlled}\text{-}e^{-i\theta O_l}$ 的 oracle 的查询来求解。

**证明.** 由命题 28，有

$$
\operatorname{Tr}(\rho O_l)=\frac{c_l}{\alpha^2}.
\tag{79}
$$

由此可见，哈密顿量可以通过估计一组哈密顿量算子的均值来估计。具体地，考虑向量

$$
d:=[\operatorname{Tr}(\rho O_0),\ldots,\operatorname{Tr}(\rho O_{M-1})],
\tag{80}
$$

哈密顿量系数向量可以由

$$
c_l=\alpha^2d_l
\tag{81}
$$

计算得到。由于哈密顿量学习问题考虑的是范数至多为常数的哈密顿量项（因此 $\nu_{\max}\in O(1)$），[19] 的均值估计算法可以用于以无穷范数误差 $\epsilon'$ 估计 $d$，所需查询次数为

$$
N\in \widetilde O(\sqrt M/\epsilon'),
\tag{82}
$$

查询对象为 $U_\rho$ 和 $U_\rho^\dagger$，以及对所有 $l\in[0,M-1]$ 的 $\operatorname{controlled}\text{-}e^{-i\theta O_l}$。剩下要做的就是确定 $\epsilon'$ 需要多小，才能保证哈密顿量系数向量估计的 $l_2$ 误差至多为 $\epsilon$。

如果我们定义 $\widehat c_l$ 为 $c_l$ 的估计，则

$$
|\widehat c_l-c_l|\le \alpha^2\epsilon'\sqrt{c_l^2+1}\in O(\alpha^2\epsilon'),
\tag{83}
$$

因为需要将均值估计的结果乘以 $\alpha^2$（如方程 (81)）。因此，如果我们希望估计 $c_l$ 时的 $l_\infty$ 误差至多为 $\epsilon_\infty$，则需要

$$
\epsilon'\in O(\epsilon_\infty/\alpha^2).
\tag{84}
$$

最后，为了使哈密顿量系数向量估计误差的 2-范数至多为 $\epsilon$，我们选择 $\epsilon_\infty\in\Theta(\epsilon/\sqrt M)$（因为由 Cauchy-Schwarz，$\|\cdot\|_2\le\sqrt M\|\cdot\|_\infty$）。这导向查询复杂度

$$
N\in \widetilde O(\alpha^2M/\epsilon).
\tag{85}
$$

我们现在希望利用引理 29 的结果来确定为求解酉 HLP 需要对时间演化黑箱查询多少次。

## 5.2 构造资源态的酉制备

在引理 29 中，我们证明哈密顿量学习问题可以使用 $\widetilde O(\alpha^2M/\epsilon)$ 次对制备方程 (70) 中态 $\rho$ 的酉操作的查询来求解。现在我们希望证明，该态可以通过查询时间演化算子 $U=e^{-iHt}$ 及其逆算子以酉方式制备。其思想是，如果我们知道制备该态需要对 $U$ 和 $U^\dagger$ 查询多少次，就可以使用引理 29 找到求解酉 HLP 所需对 $U$ 和 $U^\dagger$ 的查询次数。我们首先考虑第 4.1 节中的线路（这里在图 5.1 中重新给出），该线路用于生成伪 Choi 态。回忆 $U_{\rm block}$ 包含哈密顿量 $H$ 的一个块编码 $\widetilde H$，而引理 18 表明 $U_{\rm block}$ 可以通过查询时间演化酉算子 $U=e^{-iHt}$ 及其逆算子高效生成。该线路的完整分析见附录 B.5。

产生方程 (70) 中态的第一步，是以类似于图 5.1 的方式产生伪 Choi 态。然而，由于我们希望使用引理 29 的结果，必须注意两点。第一，通过查询时间演化算子得到的伪 Choi 态并不是哈密顿量 $H$ 的伪 Choi 态，而是 $\widetilde H/\Delta$ 的伪 Choi 态（其中 $\widetilde H$ 是哈密顿量的块编码，$\Delta=\pi/(2t)$），这意味着我们最终得到的态将与方程 (70) 中的态略有不同。我们稍后在考察查询复杂度时处理这一点。第二，需要注意的是，引理 29 要求资源态的酉制备，但图 5.1 的线路涉及测量块编码量子比特。我们可以通过使用定点幅度放大绕开这个测量，从而如下近似伪 Choi 态。

Yoder 等人 [30] 的定点幅度放大（FPAA）过程考虑一个起始态 $|s\rangle$、一个制备该起始态的线路 $A$、一个目标态 $|T\rangle$，以及一个在输入为目标态时翻转辅助量子比特的 oracle $U_{AA}$。它随后将一个线路 $S_L$（对 $U$、$A$ 和 $A^\dagger$ 进行 $O(L)$ 次查询）作用到初始态上，使得对于给定 $\delta_{AA}\in[0,1]$，有 $\|\langle T|S_L|s\rangle\|^2\ge1-\delta_{AA}$。在我们的情形中，制备线路 $A$ 只是图 5.1 中的线路，但不包括对寄存器 $B$ 的测量。回忆这个线路查询时间演化酉算子，也就是我们的学习资源，并制备态

$$
|s\rangle\equiv \frac{1}{\sqrt2}\left(|0\rangle_C|0\rangle_B\left(\frac{\widetilde H}{\Delta}\otimes I_A\right)|\Phi_d\rangle_{SA}+|0\rangle_C|1\rangle_B(J_S\otimes I_A)|\Phi_d\rangle_{SA}+|1\rangle_C|0\rangle_B|\Phi_d\rangle_{SA}\right),
\tag{86}
$$

它作为 FPAA 线路的初始态。我们的目标态是伪 Choi 态

$$
|T\rangle\equiv
\frac{|0\rangle_C|0\rangle_B(\widetilde H/\Delta\otimes I_A)|\Phi_d\rangle_{SA}+|1\rangle_C|0\rangle_B|\Phi_d\rangle_{SA}}{\gamma},
\tag{87}
$$

其中 $\gamma=\sqrt{\|\widetilde c\|_2^2/\Delta^2+1}$。

为了执行 FPAA，我们需要一个酉算子，当其作用在目标态上时会翻转一个辅助量子比特。虽然我们不知道伪 Choi 态（因为它包含所有未知哈密顿量系数），但我们知道，如果块编码量子比特处于态 $|0\rangle_B$，则其余寄存器包含伪 Choi 态。因此，我们所需的酉算子只是一个以寄存器 $B$ 为控制的零控制 CNOT 操作。有了它，我们可以将 FPAA 作用到 $|s\rangle$ 上，得到态

$$
|T_{\rm approx}\rangle\equiv S_L|s\rangle,
\tag{88}
$$

该态非常接近块编码哈密顿量 $\widetilde H/\Delta$ 的伪 Choi 态 $|T\rangle$。随后，我们简单地忽略寄存器 $A$ 中的所有量子比特，得到

$$
\chi\equiv \operatorname{Tr}_A(|T_{\rm approx}\rangle\langle T_{\rm approx}|),
\tag{89}
$$

它是下列态的近似：

$$
\begin{aligned}
\widetilde\rho\equiv \operatorname{Tr}_A(|T\rangle\langle T|)
=\frac{1}{d\gamma^2}\Big(&\frac{\widetilde H^\dagger\widetilde H}{\Delta^2}\otimes |0\rangle_C\langle0|_C
+\frac{\widetilde H}{\Delta}\otimes |0\rangle_C\langle1|_C \\
&+\frac{\widetilde H^\dagger}{\Delta}\otimes |1\rangle_C\langle0|_C
+I\otimes |1\rangle_C\langle1|_C\Big)\otimes |0\rangle\langle0|_B.
\end{aligned}
\tag{90}
$$

反过来，$\widetilde\rho$ 本质上是对方程 (70) 中态 $\rho$ 的近似，其中误差来源是块编码过程。我们还必须强调一个区别：这里的哈密顿量由 $\Delta$ 归一化，而 $\rho$ 中的哈密顿量没有如此归一化。

现在我们已经有了这个态的酉制备，需要确定需要多少次 FPAA 迭代，才能保证在使用引理 29 的结果后，哈密顿量系数预测的总误差足够小，从而满足定义 21 中的酉哈密顿量学习问题。这将告诉我们对时间演化算子 $U$ 及其逆算子所需的总查询次数，也就是算法的总查询复杂度。该值的上界由定理 33 给出，我们在本节末尾证明它。我们首先建立几个引理，以刻画总算法中特定部分的查询复杂度。

Yoder 等人 [30] 用 FPAA 过程之后得到目标态的成功概率来描述其定点幅度放大算法的查询复杂度，我们在引理 30 中总结该结果。

**引理 30（定点幅度放大）.** 令 $|s\rangle$ 是某个初始态，$|T\rangle$ 是所需目标态，并且它们的重叠为 $\langle T|s\rangle=\sqrt\lambda e^{i\xi}$。令 $A$ 是从零态制备 $|s\rangle$ 的线路，$U_{AA}$ 是一个在输入为 $|T\rangle$ 时翻转辅助量子比特的酉 oracle。此外，令 $S_L$ 是执行定点幅度放大的线路，它使用对 $A$、$A^\dagger$ 和 $U_{AA}$ 的 $O(L)$ 次查询。获得目标态的成功概率为 $P_L=|\langle T|S_L|s\rangle|^2$。对于给定的 $\delta_{AA}$，为以概率 $P_L\ge1-\delta_{AA}$ 提取目标态所需的 $L$ 值为

$$
L\in O\!\left(\frac{\log(1/\delta_{AA})}{\sqrt\lambda}\right).
$$

**证明.** 见 Yoder 等人 [30]。

由于我们对伪 Choi 态的制备应当是酉的，因此不涉及测量，我们在引理 31 中将这个查询复杂度重新表述为目标态 $|T\rangle$ 与输出态 $|T_{\rm approx}\rangle=S_L|s\rangle$ 之间的迹距离，而不是成功概率。注意，由于我们的最终目标是确定对时间演化酉算子的查询次数，我们只关心对制备线路 $A$ 的查询次数，而不关心对 $U_{AA}$ 的查询次数；如前所述，$U_{AA}$ 只是一个简单的二量子比特操作。

**引理 31（定点幅度放大的查询复杂度）.** 令 $|s\rangle$ 是方程 (86) 中定义的初始态，$|T\rangle$ 是方程 (87) 中定义的目标态，并且 $A$ 是从零态制备 $|s\rangle$ 的线路。此外，令 $S_L$ 是执行定点幅度放大的线路，它使用对 $A$ 和 $A^\dagger$ 的 $O(L)$ 次查询。为了使目标态 $|T\rangle$ 与输出态 $|T_{\rm approx}\rangle=S_L|s\rangle$ 之间的迹距离至多为 $D$，所需对 $A$ 和 $A^\dagger$ 的查询次数为

$$
L\in O(\log(1/D)).
$$

**证明.** 引理 30 保证，对 $A$ 和 $A^\dagger$ 查询 $O(\log(1/\delta_{AA})/\sqrt\lambda)$ 次足以确保 $|\langle T|S_L|s\rangle|^2\ge1-\delta_{AA}^2$，这蕴含

$$
\frac{1}{\delta_{AA}}\le \frac{1}{\sqrt{1-|\langle T|S_L|s\rangle|^2}}.
\tag{91}
$$

因此，我们可以将查询次数表示为

$$
L\in O\!\left(\frac{1}{\sqrt\lambda}\log\!\left(\frac{1}{\sqrt{1-|\langle T|S_L|s\rangle|^2}}\right)\right).
\tag{92}
$$

使用方程 (86) 和 (87) 中 $|s\rangle$ 和 $|T\rangle$ 的定义，可以证明 $\langle T|s\rangle\in[1/2,1]$（该计算与计算测量块编码量子比特得到所需态的成功概率完全相同，见附录 B.5）。因此，由于 $\langle T|s\rangle=\lambda e^{i\xi}$，我们无需在查询复杂度中考虑 $\lambda$，因为在最坏情况下它只会以常数因子影响查询次数。

由于 $S_L|s\rangle$ 和 $|T\rangle$ 是纯态，它们之间的迹距离为

$$
D=\frac12\sqrt{1-|\langle T|S_L|s\rangle|^2}.
$$

于是可以将方程 (92) 表示为

$$
L\in O\!\left(\log\!\left(\frac{1}{D}\right)\right).
\tag{93}
$$

接下来，我们证明引理 32；这只是使用方程 (90) 中的态 $\widetilde\rho$ 而不是方程 (70) 中的态 $\rho$ 对引理 29 的重新表述。

**引理 32（量子均值估计的查询复杂度）.** 令 $U_{\widetilde\rho}$ 是一个制备方程 (90) 中态 $\widetilde\rho$ 的酉 oracle。定义 1 中的哈密顿量学习问题可以使用

$$
\widetilde O\!\left(\frac{\Delta M}{\epsilon}\right)
$$

次对 $U_{\widetilde\rho}$ 和 $U_{\widetilde\rho}^\dagger$ 的查询，以及对为每个形如 $O_l=H_l\otimes X_C/2$ 的解码算子实现 $\operatorname{controlled}\text{-}e^{-i\theta O_l}$ 的 oracle 的查询来求解。

**证明.** 使用定义 20 中块编码哈密顿量 $\widetilde H$ 的定义，一个简短计算表明

$$
\operatorname{Tr}(\widetilde\rho O_l)=\frac{\operatorname{Re}[\widetilde c_l]}{\Delta\gamma^2}.
\tag{94}
$$

注意，虽然哈密顿量 $H$ 的系数 $c_m$ 是实数，块编码 $\widetilde H$ 中近似的系数 $\widetilde c_m$ 可能是复数，不过这里我们只学习它们的实部。幸运的是，这没有影响；在第 4.3 节中，我们证明 $|\widetilde c_l-c_l|\le \epsilon_b/t$，其中 $t$ 是演化时间，$\epsilon_b$ 是块编码误差；将 $\widetilde c_l$ 写成实部与虚部之和，容易看出 $|\operatorname{Re}[\widetilde c_l]-c_l|\le |\widetilde c_l-c_l|$，这意味着上界仍然成立。现在我们可以以类似于引理 29 的方式继续，使用 Huggins 等人 [19] 引入的量子均值估计协议来估计向量

$$
d:=[\operatorname{Tr}(\widetilde\rho O_0),\ldots,\operatorname{Tr}(\widetilde\rho O_{M-1})],
\tag{95}
$$

并由此通过

$$
\widetilde c_l:=\Delta\gamma^2d_l
\tag{96}
$$

近似哈密顿量系数；这里同样忽略任何可能的虚部。由与引理 29 相同的论证，需要

$$
\widetilde O(\Delta\gamma^2 M/\epsilon)
\tag{97}
$$

次对 $U_{\widetilde\rho}$ 和 $U_{\widetilde\rho}^\dagger$ 的查询，才能在 $l_2$ 误差 $\epsilon$ 内预测系数向量 $\widetilde c=[\widetilde c_0,\ldots,\widetilde c_{M-1}]$。为完成证明，我们引用附录 B.5，其中证明了 $\gamma\in[1,\sqrt2]\in O(1)$，因此我们将查询复杂度写为

$$
\widetilde O(\Delta M/\epsilon).
\tag{98}
$$

我们现在有足够资源来证明定理 33。

**定理 33（通过量子均值估计求解哈密顿量学习问题）.** 令 $U=e^{-iHt}$ 是在哈密顿量 $H$ 下演化时间 $t$ 的酉算子。为求解哈密顿量 $H$ 的酉哈密顿量学习问题，所需对 $U$ 和 $U^\dagger$ 的查询次数至多为

$$
N\in\widetilde O\!\left(\frac{M}{\epsilon t}\right).
$$

**证明.** 对时间演化算子及其逆算子的总查询次数可以通过将过程看作 4 层嵌套查询来计算。

由引理 32，量子均值估计过程对制备态 $\widetilde\rho$（方程 (90)）的酉算子 $U_{\widetilde\rho}$ 进行

$$
\widetilde O(\Delta M/\epsilon')
\tag{99}
$$

次查询，其中 $\Delta=\pi/(2t)$。$U_{\widetilde\rho}$ 使用定点幅度放大线路，该线路对制备态 $|s\rangle$（方程 (86)）的线路 $A$ 以及 $A^\dagger$ 查询

$$
O(\log(1/D))
\tag{100}
$$

次，其中 $D$ 是目标态与 FPAA 过程所得到的目标态近似之间的迹距离。最后，线路 $A$ 对哈密顿量的块编码进行一次查询，而该块编码使用

$$
O(\log(1/\epsilon_b))
\tag{101}
$$

次对时间演化算子 $U=e^{-iHt}$ 及其逆算子的查询制备，其中 $\epsilon_b$ 是块编码误差。总计，这给出查询复杂度

$$
O\!\left(\frac{M\log(1/D)\log(1/\epsilon_b)}{\epsilon' t}\right).
\tag{102}
$$

由于过程的每一步都涉及近似，我们必须为学习误差 $\epsilon'$、块编码误差 $\epsilon_b$ 和 FPAA 误差 $\epsilon_{AA}:=D$ 选择足够小的值，使得哈密顿量系数估计的总 $l_2$ 误差至多为 $\epsilon$，正如哈密顿量学习问题所要求。

回忆定义 20 中，$c$ 是我们希望学习的哈密顿量系数向量，$\widetilde c$ 是块编码哈密顿量的系数向量，$\widehat c$ 是学习过程估计出的系数向量。学习系数的总误差为

$$
\begin{aligned}
\|\widehat c-c\|_2
&=\|\widehat c-\widetilde c+\widetilde c-c\|_2\\
&\le \|\widehat c-\widetilde c\|_2+\|\widetilde c-c\|_2\\
&\le \|\widehat c-\widetilde c\|_2+\frac{M\epsilon_b}{t},
\end{aligned}
\tag{103}
$$

其中最后一行使用了命题 24 的结果。概念上，我们所做的是将总误差分解为学习块编码系数的误差和块编码系数本身的误差之和。接着，我们将 $\|\widehat c-\widetilde c\|_2$ 分解为来自量子均值估计的误差，以及用态 $\chi$ 近似 QME 资源态 $\widetilde\rho$ 所产生的误差：

$$
\|\widehat c-\widetilde c\|_2\le \|\widehat c-c'\|_2+\|c'-\widetilde c\|_2,
\tag{104}
$$

其中 $c'$ 是如果在 QME 过程中使用态 $\widetilde\rho$ 时会恢复的哈密顿量系数向量。我们通过考虑估计单个系数的误差来上界 $\|\widehat c-c'\|_2$：

$$
\begin{aligned}
|\widehat c_l-c'_l|
&=\Delta\gamma^2|\operatorname{Tr}(\chi O_l)-\operatorname{Tr}(\widetilde\rho O_l)|\\
&=\Delta\gamma^2|\operatorname{Tr}((\chi-\widetilde\rho)O_l)|\\
&\le \Delta\gamma^2\sum_{i=1}^k\sigma_i(\chi-\widetilde\rho)\sigma_i(O_l)\\
&\le \Delta\gamma^2\sigma_{\max}(O_l)\sum_{i=1}^k\sigma_i(\chi-\widetilde\rho)\\
&=\Delta\gamma^2\|O_l\|_2\sum_{i=1}^k|\lambda_i(\chi-\widetilde\rho)|\\
&=\frac{\Delta\gamma^2}{2}\operatorname{Tr}\left(\sqrt{(\chi-\widetilde\rho)^\dagger(\chi-\widetilde\rho)}\right)\\
&=\Delta\gamma^2 T(\chi,\widetilde\rho),
\end{aligned}
\tag{105}
$$

其中 $T(\chi,\widetilde\rho)$ 是 $\chi$ 和 $\widetilde\rho$ 之间的迹距离。第三行使用了 Von Neumann 迹不等式，其中 $\sigma_i(\cdot)$ 表示相应算子的第 $i$ 个奇异值。第五行使用了 $\|O_l\|_2=1/2$ 这一事实（$O_l$ 只是一个 Pauli 算子乘以因子 $1/2$），并将 $\chi-\widetilde\rho$ 的奇异值表示为其本征值的绝对值（这是有效的，因为 $\chi-\widetilde\rho$ 是 Hermitian 的，因此是 normal 的）。

由 Cauchy-Schwarz 不等式，我们有

$$
\|\widehat c-c'\|_2\le \sqrt M\max_l|\widehat c_l-c'_l|
\le \sqrt M\Delta\gamma^2T(\chi,\widetilde\rho).
\tag{106}
$$

回忆 $\chi$ 是对 FPAA 过程得到的态 $|T_{\rm approx}\rangle$ 追踪掉系统 $A$ 后得到的态，而 $\widetilde\rho$ 类似地是对 FPAA 的目标态 $|T\rangle$ 追踪掉系统 $A$ 后得到的态。因此，$\chi$ 和 $\widetilde\rho$ 之间的迹距离小于或等于 $|T_{\rm approx}\rangle$ 和 $|T\rangle$ 之间的迹距离 [31]。

根据引理 31，执行 $O(\log(1/D))$ 次 FPAA 迭代保证 $|T_{\rm approx}\rangle$ 和 $|T\rangle$ 之间的迹距离至多为 $D$。因此，我们得到如下预测哈密顿量系数的总误差表达式：

$$
\begin{aligned}
\|\widehat c-c\|_2
&\le \sqrt M\Delta\gamma^2D+\epsilon'+\frac{M\epsilon_b}{t}\\
&=\frac{\pi\gamma^2\sqrt M D}{2t}+\epsilon'+\frac{M\epsilon_b}{t}.
\end{aligned}
\tag{107}
$$

给三个项各分配 $\epsilon/3$ 的误差预算，即选择

$$
D:=\frac{2\epsilon t}{3\pi\gamma^2\sqrt M},\qquad \epsilon':=\epsilon/3,
\qquad \epsilon_b:=\frac{\epsilon t}{3M},
$$

可以确保总误差至多为 $\epsilon$，并给出最终查询复杂度

$$
N\in O\!\left(\frac{M\log^2(M/(\epsilon t))}{\epsilon t}\right).
\tag{108}
$$

使用抑制次主导对数项的 $\widetilde O$ 记号，得到

$$
N\in\widetilde O\!\left(\frac{M}{\epsilon t}\right),
\tag{109}
$$

从而证明定理 33。

注意，失败概率不会导致查询次数增加（在 $\widetilde O$ 记号下），因为与经典影子方法不同，我们用定点幅度放大替换了制备线路中的测量；因此，不是以某个概率得到所需资源态，而是保证得到资源态的一个近似。这意味着唯一的失败概率来自量子均值估计过程，而该过程保证失败概率小于 $1/3$ [19]。通过 Chernoff 论证，可以用对数数量的额外查询将该概率降到小于 $\epsilon$，因此 $\widetilde O$ 查询复杂度不受影响。

# 6 应用

由于一般而言一个哈密顿量可以有指数多个项，哈密顿量学习研究的一个重点是寻找合适的哈密顿量类别，使得学习更可处理。处理这个问题的一种方式是将范围限制在具有某种已知结构的哈密顿量上。沿着这一方向，最近若干哈密顿量学习方法考虑了低交集哈密顿量，其哈密顿量项的支撑重叠有限 [11,13,14]。这一类哈密顿量包含所有空间局域哈密顿量，因此包含许多物理相关的哈密顿量。

虽然低交集哈密顿量类别无疑很丰富，但它并不包含所有物理相关的哈密顿量。我们的方法很适合更一般的哈密顿量，例如那些 $k$-局域但并非低交集的哈密顿量（例如，如果每一对量子比特之间都有成对相互作用）。这是我们的工具在查询 $U=e^{-iHt}$ 以及 $U^\dagger$ 的假设下优于先前方法的第一个区域。然而，我们发展的学习算法甚至适用于超出 $k$-局域类别的哈密顿量。此外，除了本节给出的具有物理意义的哈密顿量示例之外，若干量子算法也将哈密顿量模拟用作子程序。显著的例子包括用于求解量子线性系统问题的算法 [32,33]、相位估计 [34]、半定规划 [35]、线性偏微分方程 [36]，以及关于模拟耦合振子系统的近期工作 [37]。因此，发展针对不同且更一般的哈密顿量类别的学习技术是有意义的，而不应只关注低交集类别。

本节中，我们给出若干 $k$-局域但非低交集哈密顿量的例子。我们还讨论先前哈密顿量学习技术在哪些设置中表现良好，以及在哪些设置中我们的方法优于它们；在若干情况下，我们将查询复杂度多项式地、甚至指数地降低。

## 6.1 费米子与硬核玻色子模型

哈密顿量学习的一个特别相关应用是粒子系统的学习问题。这些模型自然地以产生和湮灭算子来表示。这些算子的性质各不相同；然而，它们之间的共同点是，数算子（测量位于某个特定模式中的粒子数）可以表示为

$$
n=a^\dagger a,
\tag{110}
$$

其中 $a$ 是湮灭算子，$a^\dagger$ 是产生算子。这些算子的形式取决于底层粒子的对称性；不过流行的例子包括玻色情形，其中 $(a^\dagger)^p|0\rangle=\sqrt{p!}|p\rangle$，$|p\rangle$ 是具有 $p$ 个粒子的态；以及费米子或硬核玻色子情形，其中 $(a^\dagger)^p|0\rangle=\delta_{p\le1}|p\rangle$。玻色情形具有对易算子；而费米子情形使用反对易的产生和湮灭算子。

作为一个具体例子，考虑以下模型，它描述图 $G=(V,E)$ 上粒子的跃迁，以及图中最近邻之间的相互作用。为简单起见，假设产生和湮灭算子是费米子或硬核玻色子的。在这些假设下，哈密顿量可以表示为

$$
H=\sum_{j\in V}c_ja_j^\dagger a_j+\sum_{(i,j)\in E} d_{i,j}(a_i^\dagger a_j+a_j^\dagger a_i)+e_{i,j}a_i^\dagger a_i a_j^\dagger a_j.
\tag{111}
$$

注意到 $\hat n=a^\dagger a=(I+Z)/2$，这些哈密顿量项可以简化为

$$
H=\sum_{j\in V}c'_j Z_j+\sum_{(i,j)\in E} d_{i,j}(a_i^\dagger a_j+a_j^\dagger a_i)+e_{i,j}Z_iZ_j/4.
\tag{112}
$$

在这种情况下，只要对于不同的 $i,j$ 和 $k,\ell$，除非 $i=\ell$ 且 $j=k$，否则 $\operatorname{Tr}(a_i^\dagger a_j a_k^\dagger a_\ell)=0$，哈密顿量满足上述假设，并且此情形不需要产生和湮灭算子的具体量子比特表示。为了看出这一点，注意 $a_i$ 是一个非对角矩阵，因为 $a_i|1\rangle=|0\rangle$。因此，构造对角算子的唯一方式是将 $a_i$ 与 $a_i^\dagger$ 配对。在不同性假设下，这只能在 $i=\ell$ 时发生；类似地，需要 $j=k$。因此，这符合定义 1 中的哈密顿量学习问题，而不需要产生和湮灭算子的具体 Pauli 分解。相反，许多现有哈密顿量学习方法要求低交集哈密顿量，而这样的哈密顿量未必是低交集的。具体而言，如果考虑费米子哈密顿量的情形，Jordan-Wigner 表示不会产生低交集哈密顿量，除非图 $G$ 是一维图。因此，我们的方法与许多方法不同，因为这些哈密顿量可以被直接学习，而不需要先通过其产生和湮灭算子的某种表示来处理。

## 6.2 自旋玻璃模型

另一类很适合我们哈密顿量学习方法的模型是自旋玻璃。完全图上的一个具体例子是 Sherrington-Kirkpatrick（SK）模型 [38]，这是一个类 Ising 模型，其中晶格上的任意一对自旋都可以耦合，而不论它们之间的距离。SK 模型最初被引入用于研究自旋玻璃的磁性质，它在组合优化和神经网络研究中也很有意义 [39]。

在存在横场时，Sherrington-Kirkpatrick 哈密顿量具有形式

$$
H_{\rm SK}=\frac{1}{\sqrt n}\sum_{1\le i<j\le n}J_{ij}Z_iZ_j+g\sum_{i=1}^n X_i,
\tag{113}
$$

其中 $J_{ij}$ 是从标准 Gaussian 分布中采样的独立同分布随机变量，$g>0$ 是横场强度。

由于耦合发生在自旋对之间，该哈密顿量是 2-局域的，因此包含 $M\in O(n^2)$ 个项。然而，该哈密顿量显然不是低交集的，因为每一项都与 $O(M)$ 个其他项具有重叠支撑。注意，虽然完全图上的 Heisenberg 模型只包含成对相互作用，我们的方法也适用于更一般的自旋玻璃模型，这些模型允许两个以上自旋之间的相互作用。这些模型通常称为 $p$-spin 模型，是具有无限程 $p$ 体相互作用的 $p$-局域哈密顿量，因此学习过程的查询复杂度会增加，因为需要学习 $M\in O(n^p)$ 个哈密顿量系数。此外，虽然这些自旋玻璃模型只包含 Pauli $Z$ 相互作用，我们的方法也适用于具有更一般相互作用的模型，例如稠密图上的 Heisenberg 模型。

## 6.3 先前工作

本节中，我们考虑最近关于哈密顿量学习的若干工作。注意，不同作者使用的代价度量和误差度量不同，这使得比较各种方法成为一项困难工作；因此，我们这里的目标主要是强调每种方法在哪些场景下可能特别有用，并说明我们的方法在各情形中的表现。关于误差度量，我们希望指出，无穷范数是一个流行指标，即希望同时将每个单独哈密顿量系数估计到某个误差以内（$\max_i|\widehat c_i-c_i|\le\epsilon$）。然而，我们认为 2-范数（$\|\widehat c-c\|_2\le\epsilon$）更能突出学习的代价，因为无穷误差掩盖了对哈密顿量项数的一部分依赖。因此，除非另有说明，查询复杂度的讨论都指在 2-范数中将哈密顿量系数学习到误差 $\epsilon$。我们将讨论的所有方法都使用同一种基本学习资源（对 $U=e^{iHt}$ 的黑箱访问），但我们将其分为两类：需要量子控制的方法，以及不需要量子控制的方法。两种情形的区分因素是，不含量子控制的实验只使用一次 $U$ 的应用。

首先，我们考虑在学习哈密顿量系数时关于误差 $\epsilon$ 具有最佳标度的方法。具体而言，就是 Huang 等人 [14] 和 Dutkiewicz 等人 [17] 的结果，它们能够在演化时间上达到 Heisenberg 极限标度（$O(\epsilon^{-1})$）。如 [17] 所示，这只能通过使用量子控制实现，这使得他们的方法在精度重要时非常适合学习低交集哈密顿量。我们基于 QME 的方法也使用量子控制来达到 Heisenberg 极限标度，并且还有一个额外优点，即我们能够学习更一般的哈密顿量，例如 $k$-局域哈密顿量。我们基于影子的方法并未达到这种误差标度，但它对意料之外的哈密顿量项是鲁棒的，正如下一节将讨论的那样。直接比较我们的方法与 [14] 的方法是困难的，因为误差度量、复杂度度量和输入模型都不同。

重要的是，输入模型的差异在于，我们要求反向时间演化，但只要求一次短时间内对 $U$ 和 $U^\dagger$ 的受控应用。与此同时，[14] 要求能够快速交错许多短时间演化。我们的方法表现突出的一个情形是哈密顿量包含高权重 Pauli 项（即在 $k$ 个量子比特上非平凡作用的项，且 $k$ 较大）时。在这里，[14] 的技术需要关于 $k$ 指数级的查询和总演化时间。如果 $k\in O(n)$，这尤其糟糕。另一方面，我们的方法能够使用对 $U$ 和 $U^\dagger$ 的 $\operatorname{poly}(n)$ 次查询来处理这种情形。

还有若干方法没有突破标准量子极限（[11-13,15,16]），但具有其他显著优点；也许最显著的是，除 [12] 外它们不需要量子控制。这些方法中有几个也旨在超越低交集哈密顿量。Franca 等人 [16] 的结果关于哈密顿量项数标度特别好，学习含有 $M$ 项的哈密顿量需要 $\widetilde O(M/\epsilon^2)$ 次对 $U$ 的查询。然而，它们的常数因子关于 $k$ 指数大，因此如果哈密顿量包含高权重 Pauli 项，该方法并不有利。相反，Gu 等人 [13] 的方法对于含有许多项的哈密顿量标度不那么有利（需要 $O(M^5)$ 次查询），但可以处理高权重 Pauli 项而不引入关于 $k$ 的指数开销。这些方法非常适合学习低交集哈密顿量，甚至也适合一些（但不是全部）更一般类型的哈密顿量；但当存在高权重项或项数很大时，它们并不理想。

Yu 等人 [12] 和 Caro [15] 的技术试图弥补这一点，并考虑甚至更广泛的哈密顿量类别。[15] 的方法允许使用 $\operatorname{poly}(n)$ 次对 $U$ 的查询学习任意哈密顿量（在 2-范数中），只要该哈密顿量包含至多 $\operatorname{poly}(n)$ 个非零项，具有某些已知结构（例如 $k$-局域性），并且 $\|H\|\in\operatorname{poly}(n)$。在 [12] 中，作者不再要求预先知道底层结构，而只要求哈密顿量是稀疏的。主要缺点是，这些学习过程的资源复杂度关于学习系数的误差标度不好，因为二者都需要 $O(1/\epsilon^4)$ 次对 $U$ 的查询。此外，[12] 中演化时间对查询复杂度的影响并不清楚。

Caro [15] 的结果与我们的工作特别相关。首先，该过程使用时间演化酉算子的 Choi 态，而我们使用哈密顿量本身的伪 Choi 态。我们改进的误差标度似乎表明，伪 Choi 态在某些方面比普通 Choi 态更强；我们认为这来自于在制备伪 Choi 态时使用了量子控制。如上所述，[17] 展示了量子控制在实现更好误差标度方面的力量，因此使用仅由时间演化所得态的方法未能匹配我们的误差标度，也许并不意外。有趣的是，这两种方法在演化时间方面也具有相似的界。除此之外，我们的结果和 [15] 的结果具有一个关键优势：据我们所知，没有其他方法共享这一优势，即我们的基于影子的方法以及 [15] 的方法，在考虑无穷范数误差时，可以以查询高效的方式学习任意哈密顿量。如前所述，这一误差度量或许会模糊对哈密顿量项数的依赖；但在某些人确实只关心这个度量的情形下，只要哈密顿量范数受量子比特数的多项式界定，这两种方法可以使用多项式数量的查询来学习甚至包含指数多个项的哈密顿量（尽管我们的算法仍然更高效）。当然，由于需要输出指数多个系数的估计，计算复杂度将是指数级的；但这些系数可以在经典计算机上并行计算，这可能大幅减少所需的实际墙钟时间。

# 7 鲁棒性

我们希望关于协议提出的最后一点，涉及学习协议的鲁棒性问题。具体而言，在学习哈密顿量时，我们希望学习的哈密顿量总有可能包含某些项，而这些项并不存在于我们希望用来描述它的模型中。例如，我们可以假设哈密顿量具有形式 $H=x_1P_1+x_2P_2$，但用于生成伪 Choi 态的实际哈密顿量具有形式 $H_{\rm true}=x_1P_1+x_2P_2+x_3P_3$，其中 $P_1,P_2,P_3$ 是正交的 Pauli 算子。在这种情况下，很明显，如果不在模型中包含 $P_3$ 项，我们的协议永远无法学习伪 Choi 态的真实哈密顿量模型。尽管如此，我们可以问：协议是否对哈密顿量中的小误差具有鲁棒性，以及这种误差是否会在重构中显现出来。有趣的是，我们将看到，我们的协议既是鲁棒的，也是误差显现的；也就是说，当真实哈密顿量中存在未反映在模型中的项时，我们能够判断出来。

**定义 34（欠指定哈密顿量学习问题）.** 令

$$
H=\sum_{j=1}^{M}c_jH_j+\chi E,
$$

其中 $E$ 是未知 Hermitian 算子，满足 $\max_j|\operatorname{Tr}(EH_j)|=0$ 且 $d^{-1}\operatorname{Tr}(E^2)=1$，$\chi$ 是未知乘法常数。我们的目标是学习 $\widehat c$，使得 $\|c-\widehat c\|_2\le\epsilon$，并学习一个估计 $\widehat\chi$，使得 $|\chi-\widehat\chi|\le\epsilon_\chi$，成功概率大于 $1-\delta$。

推论 35 考虑学习额外项 $E$ 的系数 $\chi$ 时的误差。特别地，它表明，如果允许学习 $\chi$ 的误差大于某个下界，则欠指定 HLP 可以使用与酉 HLP 同阶的查询次数来求解。因此，可以通过估计 $\chi$ 的值来检查哈密顿量中是否存在任何额外项。注意，尽管 $\epsilon$ 的值与酉 HLP 相同，但为了协议正常工作，演化时间 $t$ 必须足够小，以归一化包含额外项的哈密顿量。

**推论 35.** 在定理 26 的假设下，如果

$$
\epsilon_\chi=\Omega\!\left(\frac{\epsilon\|\widetilde c\|_1}{|\chi|}\right)
$$

且 $\epsilon_s\gamma^2\le1$，则存在一个算法，使用

$$
O\!\left(\frac{M\log(M/\delta)}{t^2\epsilon^2}\log\!\left(\frac{M}{t\epsilon}\right)\right)
$$

次对 $e^{-iHt}$ 及其逆算子的受控应用来求解欠指定哈密顿量学习问题。

**证明.** 欠指定哈密顿量学习问题可以用与完全指定学习问题完全相同的方式求解。具体地，假设我们应用算法

$$
\operatorname{FindCoeffUnitary}(U,U^\dagger,\Delta,\mathcal{H},n,N_s),
$$

其中这里的 $U$ 是 $e^{-iHt}$，并且 $\Delta$ 被选为 $\pi/(2t)$，其中 $t\in(0,1/(2\|H\|)]$。注意，这里我们需要假设该常数被选得足够大，使得在 $\chi\ne0$ 时，有误差的哈密顿量也得到归一化。

暂时假设我们知道 $E$ 的身份，并对该态执行完整学习协议。该协议与现有协议之间的唯一区别是：现在存在 $M+1$ 个项，并且 $t$ 必须足够小以归一化真实哈密顿量。由定理 26 可知，学习哈密顿量所需对酉动力学的总查询次数按如下标度：

$$
N\in O\!\left(\frac{M\log(M/\delta)}{t^2\epsilon^2}\log\!\left(\frac{M}{t\epsilon}\right)\right),
\tag{114}
$$

其中这里的常数取为存在 $E$ 时真实哈密顿量的常数。

接着假设我们构造与求解酉 HLP 时相同的该态的 Clifford 影子。然后我们希望只从数据中重构 $c$。在注意到 $c$ 的系数值可以独立于 $E$ 的系数来计算之后，我们可以通过遵循 FindCoeffClifford 过程来做到这一点。因此，我们可以通过跳过态中的 $E$ 重构来重构 $c$ 而不重构 $E$（由于 $E$ 的身份未知，这本来也不可能）。然后由定理 26 可知，在这种情况下重构出的 $\widehat c$ 的误差至多为 $\epsilon$，并且我们在精度 $\epsilon_s$ 内学习 $1/\gamma^2$。因此，我们可以用上述完全相同的过程，在所需误差内学习向量 $c$。

给定结果后，$E$ 的系数可以由如下关系推断：

$$
\gamma^2=\frac{\|\widetilde c\|_2^2+\chi^2}{\Delta^2}+1.
\tag{115}
$$

因此，一旦从中减去向量 $\widehat c$，就可以从归一化的残余值推断 $\chi^2$ 的值：

$$
\widehat\chi^2=(\widehat\gamma^2-1)\Delta^2-\|\widetilde c\|_2^2.
\tag{116}
$$

由于我们在误差 $\epsilon_s$ 内计算 $\gamma^{-2}$ 的值，这意味着

$$
|(\gamma^{-2}\pm\epsilon_s)^{-1}-\gamma^2|
\le \frac{\gamma^2}{1-\epsilon_s\gamma^2}-\gamma^2
=\epsilon_s\gamma^4+O(\epsilon_s^2\gamma^6).
\tag{117}
$$

因此，如果 $\epsilon_s\gamma^2\le1$，则余项为 $O(\epsilon_s\gamma^4)$。回忆 $\gamma^2\in O(1)$，所以这个假设并不具有限制性。在哈密顿量系数的幅值上界为 1 的假设下，由代入 (54) 可知，我们对 $\chi^2$ 的估计误差至多为

$$
\epsilon_{\chi^2}=\sqrt{\frac{\Delta^4\gamma^8\epsilon^2}{M(1+\Delta^2)}+2\|\widetilde c\|_2^2\epsilon^2}
\in O\!\left(\epsilon\sqrt{\frac{\Delta^2}{M}+\|\widetilde c\|_2^2}\right),
\tag{118}
$$

其中我们使用了 $\gamma\in O(1)$，并假设 $\Delta\gg1$（这是合理的，因为 $\Delta$ 需要归一化哈密顿量）。

为了理解我们对 $\chi$ 的估计误差如何标度，需要考虑如何从 $\chi^2$ 的估计找到 $\chi$ 的估计。最简单的方式就是对 $\chi^2$ 的估计取平方根；在假设 $\epsilon_{\chi^2}\le \chi^2/2$ 下，这导向结论

$$
\epsilon_\chi\in O\!\left(\frac{\epsilon_{\chi^2}}{|\chi|}\right).
\tag{119}
$$

这给出

$$
\epsilon_\chi\in O\!\left(\frac{\epsilon\sqrt{\Delta^2/M+\|\widetilde c\|_2^2}}{|\chi|}\right).
\tag{120}
$$

回忆 $\Delta\in O(\|H\|_2)$，因此如果假设额外项在幅值上小于模型中预期的项，即 $\|\widetilde e\|_1\le\|\widetilde c\|_1$，则 $\Delta\in O(\|\widetilde c\|_1)$。因此，

$$
\epsilon_\chi\in O\!\left(\frac{\epsilon\|\widetilde c\|_1}{|\chi|}\right).
\tag{121}
$$

注意，在上述计算中，我们假设对额外哈密顿量项的块编码没有误差。实际上，上述步骤对应于学习块编码中额外哈密顿量项幅值 $\widetilde\chi$ 时的误差。$\chi$ 和 $\widetilde\chi$ 之间的差可以使用命题 24 上界，从而得到

$$
|\chi-\widehat\chi|\le |\chi-\widetilde\chi|+|\widetilde\chi-\widehat\chi|
\le \frac{\epsilon_b}{t}+\epsilon_\chi.
\tag{122}
$$

回忆在定理 26 中，$\epsilon_b$ 的值被专门选择为使得 $\sqrt M\epsilon_b/t$ 至多为 $\epsilon/2$，因此

$$
|\chi-\widehat\chi|\in O\!\left(\frac{\epsilon}{2\sqrt M}+\frac{\epsilon\|\widetilde c\|_1}{|\chi|}\right).
\tag{123}
$$

并且假设额外项的幅值小于，或至少不远大于，预期项的幅值（足够使 $|\chi|$ 小于量级为 $\sqrt M\|\widetilde c\|_1$ 的某个量），我们有

$$
|\chi-\widehat\chi|\in O\!\left(\frac{\epsilon\|\widetilde c\|_1}{|\chi|}\right).
\tag{124}
$$

因此，如果我们要求 $\chi$ 估计中的误差容忍度属于

$$
\Omega\!\left(\frac{\epsilon\|\widetilde c\|_1}{|\chi|}\right),
$$

那么可以看到我们的精度准则自动得到满足，并且可以求解欠指定哈密顿量学习问题。

这表明该协议对于底层哈密顿量中的误差是鲁棒的。具体地，它表明，如果哈密顿量中存在未知项，则影子层析会学习已知项的正确系数，而且未知项的（归一化）和的系数也会从结果中显现出来。这允许我们识别这类项的存在；但除了这些项必须与已知哈密顿量项正交这一事实之外，我们的协议并不提供直接指导。

理论上，由于所有额外项都可以表示为 Pauli 算子之和，人们可以系统地检查 $(k+1)$-局域项、$(k+2)$-局域项等等的系数，直到找到所有非零项（也就是当额外系数的幅值与 $\chi$ 的幅值一致时）。此外，这可以在不执行任何额外测量的情况下完成，因为所有这些都在经典计算机上使用经典影子完成。缺点是，如果对于额外项在 Pauli 基中的局域性没有任何了解，那么在最坏情况下，需要 $O(4^n)$ 时间来检查所有可能的哈密顿量项（尽管理论上如果有足够大的经典存储器，所有这些检查可以并行完成）；并且在多项式数量的查询下，所得指数大系数向量只在无穷范数中具有 $\epsilon$ 精度。然而，如果对额外项的潜在身份有某些直觉，则检查它们是否存在并学习其系数是直接的。在这些情况下，推论 35 给出学习所有系数（包括最初未考虑的系数）的误差上界：

$$
\|c+e-(\widehat c+\widehat e)\|_2\le \epsilon+\epsilon_\chi,
\tag{125}
$$

其中 $\epsilon$ 是我们为满足原始哈密顿量学习问题而希望达到的 $l_2$ 误差，$e$ 是额外哈密顿量项的系数向量，$\widehat e$ 是我们对它的估计。再次注意，我们仍然要求 $t$ 足够小以考虑额外项，因此选择略小于 $k$-局域哈密顿量所需值的 $t$ 可能是有用的，以防存在额外哈密顿量项。

我们希望讨论的剩余问题是：为了确保我们的经典影子估计正确，伪 Choi 态的制备需要多准确。为了本讨论，假设对于参数 $\omega$ 和态算子 $\rho_\perp$，有

$$
\widetilde\rho_c:=(1-\omega)|\psi'_c\rangle\langle\psi'_c|+\omega\rho_\perp.
\tag{126}
$$

这个设置不仅可以涵盖不精确制备伪 Choi 态的情况，也可以涵盖哈密顿量作用于未知数量量子比特的情况。乍看之下，对这种情况进行类似于上一个推论的显式分析似乎合适；但如果我们不知道底层量子比特，在这种情况下定义伪 Choi 态的方式会产生概念上的困难。更自然的设置是：哈密顿量项耦合到系统的一个未知储备库，这自然导致开放系统动力学，并在对环境自由度做偏迹之后产生类似于上述密度矩阵的对象。因此，我们关注该系统模型。

影子层析重构随后会使用这样的态来制备分布 $\widehat{\widetilde\rho}_i$，这些分布基于我们在计算基中测量该态所获得的测量统计。具体地，由 (48) 和 (49) 可知，在假设每个算子满足谱范数 $\|O_l\|\le1$ 的情况下，重构每个哈密顿量系数时的误差为

$$
|\operatorname{Tr}(\widetilde\rho_cO_l)-\operatorname{Tr}(\rho'_cO_l)|\le \|\widetilde\rho_c-\rho'_c\|_{\rm Tr}\le2\omega.
\tag{127}
$$

类似地，我们对 $1/\gamma^2$ 的估计会至多偏差 $2\omega$。注意，除了由伪 Choi 态不精确制备导致的这个误差之外，由于使用经典影子估计上述期望值，我们还会有一个额外误差 $\epsilon_s$。

令 $c_l$ 是第 $l$ 个哈密顿量项的真实系数，令 $c'_l$ 是在伪 Choi 态被准确制备（即 $\omega=0$）时我们会得到的估计。最后，令 $\widetilde c_l$ 是从不精确制备的伪 Choi 态得到的估计。估计该系数的误差为

$$
|c_l-\widetilde c_l|\le |c_l-c'_l|+|c'_l-\widetilde c_l|
\le 2\gamma^2\Delta(\epsilon_s+2\omega),
\tag{128}
$$

其中每一项上的因子 $2\gamma^2\Delta$ 来自必须将期望值乘以 $\gamma^2\Delta$；我们还使用了哈密顿量系数幅值上界为 1 的事实，以及假设 $\Delta\ge2$（这是合理的，因为 $\Delta\in O(\|H\|_2)$）。

如果由不精确制备伪 Choi 态导致的误差相比 $\epsilon_s$ 是次主导的，那么它不会支配来自影子层析的误差；由 (54) 可知，这将在如下条件下发生：

$$
\omega\in O\!\left(\frac{\epsilon_c}{\sqrt M\gamma^2\sqrt{\widetilde c_{\max}^2+\Delta^2}}\right).
\tag{129}
$$

由此可见，该结果在如下意义上是鲁棒的：所需的 $\omega$ 值随哈密顿量项数收缩得至多是多项式的。然而，由于对于许多感兴趣的系统，项数随量子比特数多项式增长，这意味着在最坏情形下，需要非常准确地制备伪 Choi 态，才能达到整个哈密顿量所需的精度。

# 8 结论与展望

在本文中，我们给出了一种新的哈密顿量学习方法，该方法从态-信道同构中获得启发，得到一个可以直接从中学习哈密顿量的态，并且该态可以使用简单的量子线路来制备。我们能够证明，这类方法可以容易地学习 $k$-局域哈密顿量，而 $k$-局域哈密顿量比大多数其他哈密顿量学习工作中考虑的低交集情形更广；并且在某些情况下，甚至可以学习更加一般的哈密顿量，而不需要指数多次查询。我们进一步考虑了这样一种场景中的学习问题：可以使用幅度估计通过均值估计算法进一步加速该问题，并实现关于误差容忍度的最优 $1/\epsilon$ 标度。

本文揭示了若干有趣的问题。虽然我们的方法将最近哈密顿量学习工作（[11,13,14]）的范围扩展到包括更一般的哈密顿量，但一个注意点是，我们需要反向时间演化来生成伪 Choi 态。未来工作的一个有趣方向是寻找无需反向时间演化即可高效生成类伪 Choi 态的方法，这将使我们的技术在更广泛的哈密顿量学习场景中极具吸引力。此外，Huang 等人 [14] 最近的工作引入了一种将哈密顿量重塑为非相互作用片区的有趣方法，从而允许并行学习哈密顿量的不同部分。如果这些方法可以应用到我们的方法中，那么也许可以为哈密顿量的不同部分而不是整个哈密顿量创建伪 Choi 态，这可能允许更长的演化时间，从而潜在地降低总查询次数。

更广泛地说，这种把哈密顿量块编码进量子态中的形式，允许比现有方法更加灵活的学习。虽然制备伪 Choi 态需要一个可信的量子计算机，使得它们对近期实验设置的吸引力较低，但它们打开了通过类似地将关于系统的信息编码进态中来处理许多不同学习问题的可能性。这类问题包括开放系统的 Lindbladian 学习、含时哈密顿量学习，甚至包括将哈密顿量学习方法应用于学习量子行走的结构。我们相信，这些结果代表着迈向更广泛理解量子系统动力学模型学习的一步，并进而帮助表征哪些物理模型能够或不能够从实验中高效学习。

## 致谢

JC 感谢 NSERC 和 CIFAR 的资助。NW 感谢 Google Inc. 对本工作的资助。本材料基于美国能源部科学办公室国家量子信息科学研究中心、量子优势协同设计中心（C2QA）在合同号 DE-SC0012704（PNNL FWP 76274）下支持的工作。

# A 估计哈密顿量系数（Pauli 影子）

此前我们考虑了使用基于 Clifford 的影子过程来估计哈密顿量系数，但也可以使用经典影子的 Pauli 版本。由于基于 Pauli 的影子分析中涉及的算子都是单量子比特算子，我们引入一些记号，以指明算子作用于哪个具体的二维子空间，以及某个测量结果对应于哪个量子比特。首先，由于下标 $i$ 已经表示每个比特串 $|b_i\rangle$ 来自哪一轮测量，我们用记号 $|b_i[j]\rangle$ 表示 $|b_i\rangle$ 的具体比特。更具体地，

$$
|b_i\rangle=\bigotimes_{j=0}^{\eta-1}|b_i[j]\rangle.
\tag{130}
$$

再次回忆，$|b_i\rangle$ 是一个经典比特串，而 Dirac 记号只是为了表述方便而使用。第二，每一轮测量中施加的随机酉算子 $U_i$ 是单量子比特 Clifford 算子的张量积。因此，我们将其写为

$$
U_i=\bigotimes_{j=0}^{\eta-1}U_{(i,j)},
\tag{131}
$$

其中 $U_{(i,j)}$ 是作用在第 $j$ 个量子比特上的单量子比特算子。类似地，我们可以将哈密顿量项 $H_l$ 写成

$$
H_l=\bigotimes_{j=0}^{\eta-1}H_{(l,j)}.
\tag{132}
$$

我们再次考虑对 $\operatorname{Cl}(2)^{\otimes\eta}$ 群中的所有测量结果和酉算子取期望的过程（视为一个信道）。这不再是单个退极化信道（如随机采样 $\operatorname{Cl}(2^\eta)$ 中的 Clifford 操作时那样），而是可以看作 $\eta$ 个退极化信道，每个信道作用在一个单量子比特上 [18]。像之前一样反演这些信道，得到定义 36 中指定的经典影子。

**定义 36（经典影子，由 Pauli 测量得到）.** 给定一个 $\eta$ 量子比特量子态 $\rho$ 的 $N$ 个副本，基于随机 Pauli 测量的经典影子过程返回 $\rho$ 的一个经典影子，其形式为

$$
\hat\rho=\{\hat\rho_i\mid i\in\mathbb{Z}_N\},
\tag{133}
$$

其中

$$
\hat\rho_i=\bigotimes_{j=0}^{\eta-1}\left(3U_{(i,j)}^\dagger |b_i[j]\rangle\langle b_i[j]|U_{(i,j)}-I\right).
\tag{134}
$$

回忆 $i$ 表示测量轮次，$j$ 表示量子比特；经典影子第 $i$ 轮中作用于 $\rho$ 的酉算子为 $U_i=\bigotimes_{j=0}^{\eta-1}U_{(i,j)}$，而 $|b_i[j]\rangle$ 表示经典影子过程第 $i$ 轮中测量第 $j$ 个量子比特在计算基中的结果。

正如使用 Clifford 版本的经典影子时一样，本节的目标是从伪 Choi 态中提取哈密顿量系数，也就是求解伪 Choi 哈密顿量学习问题（PC HLP）。然而，不同于生成伪 Choi 态的经典影子，我们先对辅助系统 $A$ 做偏迹，以简化学习过程。由此得到下列态，它将作为我们的学习资源：

$$
\rho=\frac{1}{d\alpha^2}\left(H^2\otimes |0\rangle_C\langle0|_C+H\otimes |0\rangle_C\langle1|_C+H\otimes |1\rangle_C\langle0|_C+I\otimes |1\rangle_C\langle1|_C\right),
\tag{135}
$$

其中 $d=2^n$ 是哈密顿量作用的 Hilbert 空间维数，$\alpha=\sqrt{\|c\|_2^2+1}$。

期望值对应于哈密顿量系数的解码算子集合也按照定义 37 修改。

**定义 37（解码算子）.** 令解码算子集合定义为

$$
\mathcal{O}\equiv\{O_l\mid l\in\mathbb{Z}_M\},
\tag{136}
$$

其中

$$
O_l=\frac{H_l\otimes X_C}{2},
\tag{137}
$$

并且 $H_l$ 是 $M$ 个哈密顿量项之一。

进一步地，我们定义

$$
O_\alpha\equiv I\otimes |1\rangle_C\langle1|_C.
\tag{138}
$$

由命题 28，有

$$
\operatorname{Tr}(\rho O_l)=\frac{c_l}{\alpha^2},
\tag{139}
$$

其中 $c_l$ 是第 $l$ 个哈密顿量系数，$\alpha$ 是伪 Choi 态的归一化常数 (7)。进一步地，

$$
\operatorname{Tr}(\rho O_\alpha)=\frac{1}{\alpha^2}.
\tag{140}
$$

现在我们已经有了一组算子，其作用在资源态 $\rho$ (135) 上的期望值对应于哈密顿量系数，因此我们希望使用 $\rho$ 的经典影子近似这些期望值。回忆，为得到 $\rho$，我们从伪 Choi 态 (15) 中追踪掉了辅助系统 $A$。为了从伪 Choi 态开始生成 $\rho$ 的经典影子，我们必须在经典影子过程中忽略辅助系统 $A$，这意味着所有随机（单量子比特）Clifford 操作和测量只作用在 $n+1$ 个量子比特上（Hilbert 空间 $\mathcal{H}_S$ 上系统的 $n$ 个量子比特，以及 Hilbert 空间 $\mathcal{H}_C$ 上的一个辅助量子比特）。就经典影子的定义而言，令 $\eta=n+1$，于是经典影子由 $N$ 个如下形式的分量组成：

$$
\hat\rho_i=\bigotimes_{j=0}^{n}\left(3U_{(i,j)}^\dagger |b_i[j]\rangle\langle b_i[j]|U_{(i,j)}-I\right).
\tag{141}
$$

有了这个形式以及定义 37 中给出的解码算子的定义，我们可以将感兴趣的期望值写成声明 38 中给出的显式形式。

**声明 38.** 令 $X_C$ 表示作用在 $\mathcal{H}_C$ 上的单量子比特 Pauli $X$ 操作，并令 $H_{l,j}$ 是 $H_l$ 中作用在第 $j$ 个量子比特上的单量子比特 Pauli 算子（回忆每个 $H_l$ 是 $\mathcal{H}_S$ 上的一个 $n$ 量子比特 Pauli 算子）。则

$$
\operatorname{Tr}(\hat\rho_iO_l)=\frac{3}{2}\langle b_i[n]|U_{(i,n)}^\dagger X_C U_{(i,n)}|b_i[n]\rangle
\prod_{j=0}^{n-1}\left(3\langle b_i[j]|U_{(i,j)}^\dagger H_{(l,j)}U_{(i,j)}|b_i[j]\rangle-\operatorname{Tr}(H_{(l,j)})\right).
\tag{142}
$$

类似地，

$$
\operatorname{Tr}(\hat\rho_iO_\alpha)=3\left|\langle b_i[n]|U_{(i,n)}|1\rangle_C\right|^2-1.
\tag{143}
$$

**声明 38 的证明.** 回忆 $\hat\rho_i$ 位于 $n+1$ 个量子比特上，$H_l$ 位于 $n$ 个量子比特上，而 $X_C$ 是单量子比特 Pauli $X$ 算子。于是

$$
\begin{aligned}
\operatorname{Tr}[\hat\rho_iO_l]
&=\operatorname{Tr}\!\left[\left(\bigotimes_{j=0}^{n}\left(3U_{(i,j)}^\dagger |b_i[j]\rangle\langle b_i[j]|U_{(i,j)}-I\right)\right)\frac{H_l\otimes X_C}{2}\right]\\
&=\frac12\operatorname{Tr}\!\left[\left(\bigotimes_{j=0}^{n}\left(3U_{(i,j)}^\dagger |b_i[j]\rangle\langle b_i[j]|U_{(i,j)}-I\right)\right)
\left(\left(\bigotimes_{j=0}^{n-1}H_{(l,j)}\right)\otimes X_C\right)\right]\\
&=\frac12\operatorname{Tr}\!\left[\left(\bigotimes_{j=0}^{n-1}\left(3U_{(i,j)}^\dagger |b_i[j]\rangle\langle b_i[j]|U_{(i,j)}H_{(l,j)}-H_{(l,j)}\right)\right)\right.\\
&\qquad\qquad\left.\otimes\left(3U_{(i,n)}^\dagger |b_i[n]\rangle\langle b_i[n]|U_{(i,n)}X_C-X_C\right)\right]\\
&=\frac32\langle b_i[n]|U_{(i,n)}^\dagger X_CU_{(i,n)}|b_i[n]\rangle
\prod_{j=0}^{n-1}\left(3\langle b_i[j]|U_{(i,j)}^\dagger H_{(l,j)}U_{(i,j)}|b_i[j]\rangle-\operatorname{Tr}[H_{(l,j)}]\right),
\end{aligned}
\tag{144}
$$

这给出方程 (142) 的结果。

类似地，

$$
\begin{aligned}
\operatorname{Tr}[\hat\rho_iO_\alpha]
&=\operatorname{Tr}\!\left[\left(\bigotimes_{j=0}^{n}\left(3U_{(i,j)}^\dagger |b_i[j]\rangle\langle b_i[j]|U_{(i,j)}-I\right)\right)(I_S\otimes |1\rangle_C\langle1|_C)\right]\\
&=\operatorname{Tr}\!\left[\left(\bigotimes_{j=0}^{n-1}\left(3U_{(i,j)}^\dagger |b_i[j]\rangle\langle b_i[j]|U_{(i,j)}-I\right)\right)
ight.\\
&\qquad\qquad\left.\otimes\left(3U_{(i,n)}^\dagger |b_i[n]\rangle\langle b_i[n]|U_{(i,n)}-I\right)|1\rangle_C\langle1|_C\right]\\
&=\prod_{j=0}^{n-1}\left(\operatorname{Tr}\left[3U_{(i,j)}^\dagger |b_i[j]\rangle\langle b_i[j]|U_{(i,j)}\right]-\operatorname{Tr}[I]\right)\\
&\qquad\times\left(3\langle b_i[n]|U_{(i,n)}|1\rangle_C\langle1|_C U_{(i,n)}^\dagger|b_i[n]\rangle-1\right)\\
&=3\langle b_i[n]|U_{(i,n)}|1\rangle_C\langle1|_C U_{(i,n)}^\dagger|b_i[n]\rangle-1,
\end{aligned}
\tag{145}
$$

这给出方程 (143) 的结果，并完成证明。

由于只需要单量子比特操作，计算每个迹需要 $O(n)$ 时间，并需要 $O(n)$ 存储器来存储所有中间值。事实上，如果关注 $k$-局域哈密顿量，每个哈密顿量项 $H_l$ 至多只包含 $k$ 个非恒等 Pauli，因此计算每个值只需要 $O(k)$ 次操作。

与随机 Clifford 测量的情形一样，没有必要存储整个经典影子。

**定义 39.** 如果执行经典影子过程的随机 Pauli 测量版本，则所得大小为 $N$ 的经典影子可以以下列方式存储：

$$
|\hat\rho\rangle=\{|\hat\rho_i\rangle\mid i\in\mathbb{Z}_N\},
\tag{146}
$$

其中

$$
|\hat\rho_i\rangle=\bigotimes_{j=1}^{n+1}U_{(i,j)}^\dagger |b[j]\rangle_i.
\tag{147}
$$

这里我们使用 Dirac 记号来描述所得比特串；不过注意，由于 $|b[j]\rangle_i$ 是经典比特，$|\hat\rho_i\rangle$ 是一个计算基向量，对应于某个比特串的一热 unary 表示。

算法 5 描述估计哈密顿量系数的完整过程。注意，它使用定义 39 给出的“压缩”Pauli 影子。此外，由于所涉及的所有操作都是单量子比特上的操作，因此无需使用 [21] 的 Tableau 或 SIP 算法来存储中间值或计算期望值。

由于这个过程中所有操作都是单量子比特操作，计算所需内积比基于 Clifford 影子的情形更高效。特别地，完成这一点所需的计算次数至多为 $O(MN)$，其中 $N$ 的充分取值见方程 (150)。注意，这个 $N$ 值包含因子 $4^k$，其中 $k$ 是哈密顿量的局域性。与此同时，基于 Clifford 的过程需要 $O(MNn^3)$ 次计算来计算所需内积，而定理 16 中给出的 $N$ 的充分值不包含因子 $4^k$。因此，除非 $k$ 值很大，否则 Pauli 版本过程将具有更好的后处理性能，代价是样本复杂度稍高。此外，与 Clifford 情形一样，这些操作可以并行执行，从而大大减少计算时间。

**算法 5：FindCoeffPauli$(\rho_c^{\otimes N},\mathcal{H},n,N)$：从 $\rho_c$ 确定哈密顿量系数向量**

输入：

- $\rho_c^{\otimes N}$：$n$ 个量子比特上的 $N$ 个伪 Choi 态集合，每个态位于 Hilbert 空间 $\mathcal{H}_S\otimes\mathcal{H}_A\otimes\mathcal{H}_C$ 上。
- $\mathcal{H}$：$M$ 个 $k$-局域哈密顿量项 $H_l$ 的集合，其系数 $c_m$ 是所需目标。
- $\rho_c^{\otimes N}$ 是量子态，而 $\mathcal{H}$ 是一组经典算子。

1. 初始化哈密顿量系数数组。

   令 $\widehat c\leftarrow[0,0,\ldots,0]_{1\times M}$，并令 $\widehat c_l$ 表示 $\widehat c$ 的第 $l$ 个元素。

2. 生成并存储经典影子。

   使用 $\rho_c$ 的副本生成 $\operatorname{Tr}_A(\rho_c)$ 的大小为 $N$ 的经典影子 $\widehat\rho$，方式是将基于随机 Pauli 测量的经典影子过程限制在空间 $\mathcal{H}_S\otimes\mathcal{H}_C$ 上，从而有效地对 $\mathcal{H}_A$ 执行偏迹。

   在经典存储器中存储 $\widehat\rho$（即存储每个向量 $|\widehat\rho_i\rangle$）。见经典影子的定义 39。

3. 对每个相应哈密顿量项，生成 $\operatorname{Tr}(\rho O_l)=c_l/\alpha^2$ 的估计。

   令 $\widehat o\leftarrow[0,0,\ldots,0]_{1\times N}$，并令 $\widehat o_i$ 表示 $\widehat o$ 的第 $i$ 个元素。

   对 $l$ 从 $0$ 到 $M-1$：

   对 $i$ 从 $0$ 到 $N-1$：

   $$
   \widehat o_i\leftarrow \frac32\langle b_i[n]|U_{(i,n)}^\dagger X_CU_{(i,n)}|b_i[n]\rangle
   \prod_{j=0}^{n-1}\left(3\langle b_i[j]|U_{(i,j)}^\dagger H_{(l,j)}U_{(i,j)}|b_i[j]\rangle-\operatorname{Tr}(H_{(l,j)})\right).
   $$

   这按照方程 (142) 等于 $\operatorname{Tr}(\widehat\rho_iO_l)$。

   $$
   \widehat c_l\leftarrow \operatorname{MedianOfMeans}(\widehat o).
   $$

4. 生成 $\operatorname{Tr}(\rho O_\alpha)=1/\alpha^2$ 的估计。

   对 $i$ 从 $0$ 到 $N-1$：

   $$
   \widehat o_i\leftarrow 3|\langle b_i[n]|U_{(i,n)}|1\rangle_C|^2-1.
   $$

   这按照方程 (143) 等于 $\operatorname{Tr}(\widehat\rho_iO_\alpha)$。

   $$
   \widehat o_\alpha\leftarrow \operatorname{MedianOfMeans}(\widehat o).
   $$

5. 从哈密顿量系数中移除因子 $1/\alpha^2$。

   令 $\widehat c\leftarrow \widehat c/\widehat o_\alpha$。

6. 输出哈密顿量系数向量。

   返回 $\widehat c=[\widehat c_0,\widehat c_1,\ldots,\widehat c_{M-1}]$。

## A.1 样本复杂度上界

该方法的样本复杂度与使用基于 Clifford 的经典影子来学习伪 Choi 态的情形非常相似。关键差异在于，当使用经典影子的随机 Pauli 测量版本时，引理 14 中对影子范数的上界不再适用。取而代之的是下述结果。

**引理 40（影子范数上界，Pauli 影子）.** 令集合 $\{O_\alpha\}\cup\{O_l\mid l\in\mathbb{Z}_M\}$ 记作 $\mathcal{O}\equiv\{O_i\mid i\in\mathbb{Z}_{2M}\}$。注意，这些算子至多在 $k+1$ 个量子比特上非平凡作用。如果使用经典影子过程的随机 Pauli 测量版本来预测集合中算子的期望值，则每个算子的影子范数至多为

$$
\|O_i\|_{\rm shadow}^2\le 3^{k+1}.
\tag{148}
$$

**引理 40 的证明.** 这直接来自 [18]，Huang 等人证明，对于基于随机 Pauli 测量的经典影子，有

$$
\|O\|_{\rm shadow}^2\le 3^k,
\tag{149}
$$

其中 $O$ 是一个单个 $k$-局域 Pauli 算子。

通过与基于 Clifford 的经典影子的情形相同的论证，这个影子范数上界导向样本复杂度

$$
N\in O\!\left(\frac{3^k\alpha^4(c_{\max}+1)M\log(M/\delta)}{\epsilon^2}\right).
\tag{150}
$$

# B 证明与技术结果

## B.1 方程 $(7)$ 的证明

**Proof.**

$$
\begin{aligned}
\langle\Phi_d|_{SA}(H^2\otimes I_A)|\Phi_d\rangle_{SA}
&=\frac{
\sum_{i=0}^{d-1}\langle i|_S\langle i|_A(H^2\otimes I_A)
\sum_{j=0}^{d-1}|j\rangle_S|j\rangle_A
}{d} \\
&=\frac{
\sum_{i=0}^{d-1}\sum_{j=0}^{d-1}
\langle i|_SH^2|j\rangle_S\langle i|_A|j\rangle_A
}{d} \\
&=\frac{
\sum_{i=0}^{d-1}\langle i|_SH^2|i\rangle_S
}{d} \\
&=\frac{\operatorname{Tr}(H^2)}{d} \\
&=\frac1d\operatorname{Tr}\!\left(
\sum_{l=0}^{M-1}c_lH_l
\sum_{m=0}^{M-1}c_mH_m
\right) \\
&=\frac1d\sum_{l=0}^{M-1}\sum_{m=0}^{M-1}c_lc_m\operatorname{Tr}(H_lH_m) \\
&=\sum_{m=0}^{M-1}c_m^2 \\
&=\|c\|_2^2.
\end{aligned}
\tag{151}
$$

因此

$$
\alpha:=\sqrt{\langle\Phi_d|_{SA}(H^2\otimes I_A)|\Phi_d\rangle_{SA}+1}
=
\sqrt{\|c\|_2^2+1}.
\tag{152}
$$

## B.2 Proposition 12 的证明

Proposition 12 包含了一些方程，展示如何使用 classical shadow 显式计算三个感兴趣的期望值。本节给出这三个表达式各自的推导。

回忆由 classical shadows 程序的随机 Clifford 测量版本生成的 classical shadows 具有形式

$$
\hat\rho_i=(2^{2n+1}+1)U_i^\dagger |b_i\rangle\langle b_i|U_i-I,
$$

并回忆以下算子的定义：

$$
O_l^+=O_l+(O_l)^\dagger,
$$

$$
O_l^-=iO_l-i(O_l)^\dagger,
$$

其中

$$
O_l=(H_l\otimes I_A)|\Phi_d\rangle_{SA}\langle\Phi_d|_{SA}\otimes |0\rangle_C\langle1|_C
$$

是 Definition 9 中的解码算子。还要注意，$U_i^\dagger|b_i\rangle$ 位于 Hilbert 空间 $\mathcal H_S\otimes\mathcal H_A\otimes\mathcal H_C$ 上，而 $H_l$ 作用在 Hilbert 空间 $\mathcal H_S$ 上。

**方程 $(29)$ 的证明.**

$$
\begin{aligned}
\operatorname{Tr}(\hat\rho_iO_l^+)
&=\operatorname{Tr}\Bigl(
\bigl[(2^{2n+1}+1)U_i^\dagger|b_i\rangle\langle b_i|U_i-I\bigr] \\
&\qquad\times
\bigl[(H_l\otimes I_A)|\Phi_d\rangle_{SA}\langle\Phi_d|_{SA}\otimes |0\rangle_C\langle1|_C
+|\Phi_d\rangle_{SA}\langle\Phi_d|_{SA}(H_l\otimes I_A)\otimes |1\rangle_C\langle0|_C\bigr]
\Bigr) \\
&=(2^{2n+1}+1)\operatorname{Tr}\Bigl(
[U_i^\dagger|b_i\rangle\langle b_i|U_i]
[(H_l\otimes I_A)|\Phi_d\rangle_{SA}\langle\Phi_d|_{SA}\otimes |0\rangle_C\langle1|_C]
\Bigr) \\
&\quad-\operatorname{Tr}\bigl((H_l\otimes I_A)|\Phi_d\rangle_{SA}\langle\Phi_d|_{SA}\otimes |0\rangle_C\langle1|_C\bigr) \\
&\quad+(2^{2n+1}+1)\operatorname{Tr}\Bigl(
[U_i^\dagger|b_i\rangle\langle b_i|U_i]
[|\Phi_d\rangle_{SA}\langle\Phi_d|_{SA}(H_l\otimes I_A)\otimes |1\rangle_C\langle0|_C]
\Bigr) \\
&\quad-\operatorname{Tr}\bigl(|\Phi_d\rangle_{SA}\langle\Phi_d|_{SA}(H_l\otimes I_A)\otimes |1\rangle_C\langle0|_C\bigr) \\
&=(2^{2n+1}+1)\operatorname{Tr}\Bigl(
[U_i^\dagger|b_i\rangle\langle b_i|U_i]
[(H_l\otimes I_A)|\Phi_d\rangle_{SA}\langle\Phi_d|_{SA}\otimes |0\rangle_C\langle1|_C]
\Bigr) \\
&\quad-\operatorname{Tr}\bigl((H_l\otimes I_A)|\Phi_d\rangle_{SA}\langle\Phi_d|_{SA}\bigr)\operatorname{Tr}(|0\rangle_C\langle1|_C) \\
&\quad+(2^{2n+1}+1)\operatorname{Tr}\Bigl(
[U_i^\dagger|b_i\rangle\langle b_i|U_i]
[|\Phi_d\rangle_{SA}\langle\Phi_d|_{SA}(H_l\otimes I_A)\otimes |1\rangle_C\langle0|_C]
\Bigr) \\
&\quad-\operatorname{Tr}\bigl(|\Phi_d\rangle_{SA}\langle\Phi_d|_{SA}(H_l\otimes I_A)\bigr)\operatorname{Tr}(|1\rangle_C\langle0|_C) \\
&=(2^{2n+1}+1)\operatorname{Tr}\Bigl(
[U_i^\dagger|b_i\rangle\langle b_i|U_i]
[(H_l\otimes I_A)|\Phi_d\rangle_{SA}\langle\Phi_d|_{SA}\otimes |0\rangle_C\langle1|_C]
\Bigr) \\
&\quad+(2^{2n+1}+1)\operatorname{Tr}\Bigl(
[U_i^\dagger|b_i\rangle\langle b_i|U_i]
[|\Phi_d\rangle_{SA}\langle\Phi_d|_{SA}(H_l\otimes I_A)\otimes |1\rangle_C\langle0|_C]
\Bigr) \\
&=(2^{2n+1}+1)\langle b_i|U_i
\bigl((H_l\otimes I_A)|\Phi_d\rangle_{SA}\langle\Phi_d|_{SA}\otimes |0\rangle_C\langle1|_C\bigr)
U_i^\dagger|b_i\rangle \\
&\quad+(2^{2n+1}+1)\langle b_i|U_i
\bigl(|\Phi_d\rangle_{SA}\langle\Phi_d|_{SA}(H_l\otimes I_A)\otimes |1\rangle_C\langle0|_C\bigr)
U_i^\dagger|b_i\rangle \\
&=(2^{2n+1}+1)
\left(\langle b_i|U_i(H_l\otimes I_A)|\Phi_d\rangle_{SA}\otimes |0\rangle_C\right)
\left(\langle\Phi_d|_{SA}\otimes\langle1|_C U_i^\dagger|b_i\rangle\right) \\
&\quad+(2^{2n+1}+1)
\left(\langle b_i|U_i|\Phi_d\rangle_{SA}\otimes |1\rangle_C\right)
\left(\langle\Phi_d|_{SA}(H_l\otimes I_A)\otimes\langle0|_C U_i^\dagger|b_i\rangle\right).
\end{aligned}
\tag{153}
$$

**方程 $(30)$ 的证明.**

$$
\begin{aligned}
\operatorname{Tr}(\hat\rho_iO_l^-)
&=\operatorname{Tr}\Bigl(
[(2^{2n+1}+1)U_i^\dagger|b_i\rangle\langle b_i|U_i-I] \\
&\qquad\times[i(H_l\otimes I_A)|\Phi_d\rangle_{SA}\langle\Phi_d|_{SA}\otimes |0\rangle_C\langle1|_C
-i|\Phi_d\rangle_{SA}\langle\Phi_d|_{SA}(H_l\otimes I_A)\otimes |1\rangle_C\langle0|_C]
\Bigr) \\
&=i(2^{2n+1}+1)\operatorname{Tr}\Bigl(
[U_i^\dagger|b_i\rangle\langle b_i|U_i]
[(H_l\otimes I_A)|\Phi_d\rangle_{SA}\langle\Phi_d|_{SA}\otimes |0\rangle_C\langle1|_C]
\Bigr) \\
&\quad-i\operatorname{Tr}\bigl((H_l\otimes I_A)|\Phi_d\rangle_{SA}\langle\Phi_d|_{SA}\otimes |0\rangle_C\langle1|_C\bigr) \\
&\quad-i(2^{2n+1}+1)\operatorname{Tr}\Bigl(
[U_i^\dagger|b_i\rangle\langle b_i|U_i]
[|\Phi_d\rangle_{SA}\langle\Phi_d|_{SA}(H_l\otimes I_A)\otimes |1\rangle_C\langle0|_C]
\Bigr) \\
&\quad+i\operatorname{Tr}\bigl(|\Phi_d\rangle_{SA}\langle\Phi_d|_{SA}(H_l\otimes I_A)\otimes |1\rangle_C\langle0|_C\bigr) \\
&=i(2^{2n+1}+1)\langle b_i|U_i
\bigl((H_l\otimes I_A)|\Phi_d\rangle_{SA}\langle\Phi_d|_{SA}\otimes |0\rangle_C\langle1|_C\bigr)
U_i^\dagger|b_i\rangle \\
&\quad-i(2^{2n+1}+1)\langle b_i|U_i
\bigl(|\Phi_d\rangle_{SA}\langle\Phi_d|_{SA}(H_l\otimes I_A)\otimes |1\rangle_C\langle0|_C\bigr)
U_i^\dagger|b_i\rangle \\
&=i(2^{2n+1}+1)
\left(\langle b_i|U_i(H_l\otimes I_A)|\Phi_d\rangle_{SA}\otimes |0\rangle_C\right)
\left(\langle\Phi_d|_{SA}\otimes\langle1|_C U_i^\dagger|b_i\rangle\right) \\
&\quad-i(2^{2n+1}+1)
\left(\langle b_i|U_i|\Phi_d\rangle_{SA}\otimes |1\rangle_C\right)
\left(\langle\Phi_d|_{SA}(H_l\otimes I_A)\otimes\langle0|_C U_i^\dagger|b_i\rangle\right).
\end{aligned}
\tag{154}
$$

**方程 $(31)$ 的证明.** 回忆由 Definition 9，

$$
O_\alpha=|\Phi_d\rangle_{SA}\langle\Phi_d|_{SA}\otimes |1\rangle_C\langle1|_C
$$

是对应于归一化常数 $\alpha$ 的解码算子。由此可得

$$
\begin{aligned}
\operatorname{Tr}(\hat\rho_iO_\alpha)
&=\operatorname{Tr}\Bigl(
[(2^{2n+1}+1)U_i^\dagger|b_i\rangle\langle b_i|U_i-I]
[|\Phi_d\rangle_{SA}\langle\Phi_d|_{SA}\otimes |1\rangle_C\langle1|_C]
\Bigr) \\
&=(2^{2n+1}+1)\operatorname{Tr}\Bigl(
[U_i^\dagger|b_i\rangle\langle b_i|U_i]
[|\Phi_d\rangle_{SA}\langle\Phi_d|_{SA}\otimes |1\rangle_C\langle1|_C]
\Bigr) \\
&\quad-\operatorname{Tr}(|\Phi_d\rangle_{SA}\langle\Phi_d|_{SA}\otimes |1\rangle_C\langle1|_C) \\
&=(2^{2n+1}+1)\langle b_i|U_i
(|\Phi_d\rangle_{SA}\langle\Phi_d|_{SA}\otimes |1\rangle_C\langle1|_C)
U_i^\dagger|b_i\rangle-1 \\
&=(2^{2n+1}+1)|\langle b_i|U_i|\Phi_d\rangle_{SA}|1\rangle_C|^2-1.
\end{aligned}
\tag{155}
$$

## B.3 Lemma 14 的证明

**Lemma 14 的证明.** 回忆 Lemma 14 中 Hermitian 算子的定义：

$$
O_\alpha=|\Phi_d\rangle_{SA}\langle\Phi_d|_{SA}\otimes |1\rangle\langle1|,
\tag{156}
$$

以及

$$
O_l^+=O_l+(O_l)^\dagger,
\tag{157}
$$

$$
O_l^-=iO_l-i(O_l)^\dagger,
\tag{158}
$$

其中

$$
O_l=(H_l\otimes I)|\Phi_d\rangle_{SA}\langle\Phi_d|_{SA}\otimes |0\rangle\langle1|
\tag{159}
$$

对所有 $0\le l\le M-1$ 定义。

首先考虑 $O_l^+$ 的 Hilbert-Schmidt 范数平方：

$$
\begin{aligned}
\operatorname{Tr}\!\left(O_l^+(O_l^+)^\dagger\right)
&=\operatorname{Tr}\!\left((O_l^+)^2\right) \\
&=\operatorname{Tr}(O_l^2)+\operatorname{Tr}(O_lO_l^\dagger)+\operatorname{Tr}(O_l^\dagger O_l)+\operatorname{Tr}((O_l^\dagger)^2) \\
&=\operatorname{Tr}(O_l^2)+2\operatorname{Tr}(O_lO_l^\dagger)+\operatorname{Tr}((O_l^\dagger)^2).
\end{aligned}
\tag{160}
$$

逐个考察上述每一项，可以看到：

$$
\begin{aligned}
\operatorname{Tr}(O_l^2)
&=\operatorname{Tr}\!\left(((H_l\otimes I)|\Phi_d\rangle_{SA}\langle\Phi_d|_{SA}\otimes |0\rangle\langle1|)^2\right) \\
&=\operatorname{Tr}\!\left(((H_l\otimes I)|\Phi_d\rangle_{SA}\langle\Phi_d|_{SA}\otimes |0\rangle\langle1|)
((H_l\otimes I)|\Phi_d\rangle_{SA}\langle\Phi_d|_{SA}\otimes |0\rangle\langle1|)
\right) \\
&=\operatorname{Tr}\!\left(\langle\Phi_d|_{SA}(H_l\otimes I)|\Phi_d\rangle_{SA}
\langle\Phi_d|_{SA}(H_l\otimes I)|\Phi_d\rangle_{SA}\right)
\operatorname{Tr}(|0\rangle\langle1||0\rangle\langle1|) \\
&=0.
\end{aligned}
\tag{161}
$$

类似地，

$$
\operatorname{Tr}((O_l^\dagger)^2)=0.
\tag{162}
$$

此外，

$$
\begin{aligned}
\operatorname{Tr}(O_lO_l^\dagger)
&=\operatorname{Tr}\!\left(
((H_l\otimes I)|\Phi_d\rangle_{SA}\langle\Phi_d|_{SA}\otimes |0\rangle\langle1|)
((H_l\otimes I)|\Phi_d\rangle_{SA}\langle\Phi_d|_{SA}\otimes |0\rangle\langle1|)^\dagger
\right) \\
&=\operatorname{Tr}\!\left(
((H_l\otimes I)|\Phi_d\rangle_{SA}\langle\Phi_d|_{SA}\otimes |0\rangle\langle1|)
(|\Phi_d\rangle_{SA}\langle\Phi_d|_{SA}(H_l^\dagger\otimes I)\otimes |1\rangle\langle0|)
\right) \\
&=\operatorname{Tr}\!\left((H_l\otimes I)|\Phi_d\rangle_{SA}\langle\Phi_d|_{SA}(H_l^\dagger\otimes I)\right)
\operatorname{Tr}(|0\rangle\langle1||1\rangle\langle0|) \\
&=\langle\Phi_d|_{SA}(H_l^\dagger\otimes I)(H_l\otimes I)|\Phi_d\rangle_{SA} \\
&=\langle\Phi_d|_{SA}|\Phi_d\rangle_{SA} \\
&=1,
\end{aligned}
\tag{163}
$$

其中我们使用了 $H_l$ 是正交归一基的一部分这一事实，因此 $H_l^\dagger H_l=I$。

由此得到如下上界：

$$
\operatorname{Tr}\!\left((O_l^+)^2\right)=2.
\tag{164}
$$

同样地：

$$
\operatorname{Tr}\!\left((O_l^-)^2\right)=2.
\tag{165}
$$

最后，从 $O_\alpha$ 的定义显然有

$$
\operatorname{Tr}(O_\alpha^2)=1.
\tag{166}
$$

[18] 的 Section 5B 证明了，对 Hermitian 算子 $O_i$ 有

$$
\|O_i\|_{\mathrm{shadow}}^2\le3\operatorname{Tr}\!\left((O_i)^2\right).
$$

由于 Lemma 14 将

$$
\mathcal O\equiv\{O_i\mid i\in\mathbb Z_{2M}\}
$$

定义为集合

$$
\{O_\alpha\}\cup\{O_l^+,O_l^-\mid l\in\mathbb Z_M\},
$$

所以可以看到

$$
\operatorname{Tr}\!\left((O_i)^2\right)\le2,
\tag{167}
$$

因此

$$
\|O_i\|_{\mathrm{shadow}}^2\le6,
\tag{168}
$$

从而完成 Lemma 14 的证明。

## B.4 选择足够小的 Classical Shadows 误差

为了使哈密顿量学习问题的总误差至多为 $\epsilon$，classical shadows 程序的误差 $\epsilon_s$ 不能太大。然而，减小 $\epsilon_s$ 需要增加测量次数 $N$。因此，我们寻找最大的 $\epsilon_s$ 值，使得总误差至多为 $\epsilon$。这个值由 Proposition 15 给出，并在下面证明。

**Proposition 15 的证明.** 在 Algorithm 1 中使用 classical shadows，我们计算 $\hat o_i$ 和 $\hat o_\alpha$；它们以至少 $\delta_s$ 的概率分别是在误差 $\epsilon_s$ 内对 $1/\alpha^2$ 和 $c_i/\alpha^2$ 的估计。这意味着在成功时，通过对 $1/\alpha^2$ 的估计取倒数得到的 $\alpha^2$ 中的不确定性至多为

$$
\epsilon_\alpha=\alpha^4\epsilon_s.
\tag{169}
$$

Algorithm 1 中的下一步是用 $\hat o_i$ 除以 $\hat o_\alpha$ 得到 $\hat c_i$，即我们对 $c_i$ 的估计。因此，$c_i$ 中的不确定性至多为

$$
\epsilon_i
=c_i\sqrt{
\left(\frac{\epsilon_\alpha}{\alpha^2}\right)^2
+
\left(\frac{\epsilon_s}{c_i/\alpha^2}\right)^2
}
=
\epsilon_s\alpha^2\sqrt{c_i^2+1}.
\tag{170}
$$

于是哈密顿量系数向量中的总 $l_2$ 误差为

$$
\|\hat c-c\|_2
\le
\sqrt M\max_i\epsilon_i
=
\sqrt M\epsilon_s\alpha^2\sqrt{\max_i c_i^2+1}.
\tag{171}
$$

为了使该总误差至多为哈密顿量学习问题所要求的 $\epsilon$，选择

$$
\epsilon_s=
\frac{\epsilon}{\alpha^2\sqrt{c_{\max}^2+1}\sqrt M}
\tag{172}
$$

即可。

## B.5 Lemma 19 的证明

这里我们给出 Lemma 19 的形式化证明；该引理给出了关于制备表示哈密顿量的伪 Choi 态的代价的关键结果。

**Lemma 19 的证明.** 首先制备态

$$
|\psi_0\rangle=|0\rangle_C|0\rangle_B|\Phi_d\rangle_{SA},
$$

并将其用作 Figure 4.1 中线路的输入态。对寄存器 $C$ 应用 Hadamard 门得到

$$
|\psi_1\rangle=
\frac1{\sqrt2}
\left(
|0\rangle_C|0\rangle_B|\Phi_d\rangle_{SA}
+|1\rangle_C|0\rangle_B|\Phi_d\rangle_{SA}
\right).
\tag{173}
$$

在对作用于寄存器 $B$ 和 $S$ 的 $U_{\mathrm{block}}$ 进行受控应用后，我们得到态

$$
|\psi_2\rangle=
\frac1{\sqrt2}
\left(
|0\rangle_C(U_{\mathrm{block}}\otimes I_A)|0\rangle_B|\Phi_d\rangle_{SA}
+|1\rangle_C|0\rangle_B|\Phi_d\rangle_{SA}
\right).
\tag{174}
$$

回忆哈密顿量的 block-encoding 具有形式

$$
U_{\mathrm{block}}
=|0\rangle_B\langle0|_B\otimes\frac{2\widetilde Ht}{\pi}
+|0\rangle_B\langle1|_B\otimes I_S
+|1\rangle_B\langle0|_B\otimes J_S
+|1\rangle_B\langle1|_B\otimes K_S,
\tag{175}
$$

其中 $I_S,J_S,K_S$ 是我们不关心的“junk”算子。因此，可以将前一个态写为

$$
|\psi_2\rangle
=\frac1{\sqrt2}
\left(
|0\rangle_C|0\rangle_B\left(\frac{\widetilde H}{\Delta}\otimes I_A\right)|\Phi_d\rangle_{SA}
+|0\rangle_C|1\rangle_B(J_S\otimes I_A)|\Phi_d\rangle_{SA}
+|1\rangle_C|0\rangle_B|\Phi_d\rangle_{SA}
\right).
\tag{176}
$$

测量 block-encoding 量子比特时得到结果 $|0\rangle_B$ 的概率为

$$
\begin{aligned}
\Pr(0)
&=\langle\psi_2|(I_C\otimes |0\rangle_B\langle0|_B\otimes I_{SA})|\psi_2\rangle \\
&=\left\langle\psi_2\middle|
\frac{
|0\rangle_C|0\rangle_B\left(\frac{\widetilde H}{\Delta}\otimes I_A\right)|\Phi_d\rangle_{SA}
+|1\rangle_C|0\rangle_B|\Phi_d\rangle_{SA}
}{\sqrt2}
\right\rangle \\
&=\frac12\left(
\langle\Phi_d|_{SA}\left(\frac{\widetilde H^\dagger\widetilde H}{\Delta^2}\otimes I_A\right)|\Phi_d\rangle_{SA}+1
\right) \\
&=\frac{\|\tilde c\|_2^2}{2\Delta^2}+\frac12,
\end{aligned}
\tag{177}
$$

其中在最后一行我们代入了 Definition 20 中 $\widetilde H$ 的表示；缺失的步骤几乎与 Appendix B.1 中对方程 $(7)$ 的证明相同。

如果对寄存器 $B$ 的测量结果为 $|0\rangle_B$，则所得态为

$$
\begin{aligned}
|\psi_3\rangle
&=\frac{(I_C\otimes |0\rangle_B\langle0|_B\otimes I_{SA})|\psi_2\rangle}{\sqrt{\Pr(0)}} \\
&=\frac{
|0\rangle_C|0\rangle_B\left(\frac{\widetilde H}{\Delta}\otimes I_A\right)|\Phi_d\rangle_{SA}
+|1\rangle_C|0\rangle_B|\Phi_d\rangle_{SA}
}{
\sqrt2\sqrt{\frac{\|\tilde c\|_2^2}{2\Delta^2}+\frac12}
},
\end{aligned}
\tag{178}
$$

其中 $\Delta=\pi/(2t)$。

忽略寄存器 $B$ 中的额外量子比特，这就是 $\widetilde H/\Delta$ 的伪 Choi 态：

$$
\psi_c'
=
\left(
\frac{
|0\rangle_C\left(\frac{\widetilde H}{\Delta}\otimes I_A\right)|\Phi_d\rangle_{SA}
+|1\rangle_C|\Phi_d\rangle_{SA}
}{\gamma}
\right),
\tag{179}
$$

其中

$$
\gamma=\sqrt{\frac{\|\tilde c\|_2^2}{\Delta^2}+1}.
\tag{180}
$$

为了检查产生伪 Choi 态的成功概率，也就是测量 block-encoding 量子比特并得到结果 $|0\rangle_B$，确实是一个有效概率，我们希望确保项

$$
\langle\Phi_d|_{SA}
\left(
\frac{\widetilde H^\dagger\widetilde H}{\Delta^2}\otimes I_A
\right)
|\Phi_d\rangle_{SA}
$$

位于 $[1/2,1]$ 中。我们首先将 $\|\tilde c\|_2^2$ 与哈密顿量的谱范数联系起来：

$$
\begin{aligned}
\|\tilde c\|_2^2
&=\langle\Phi_d|_{SA}(\widetilde H^\dagger\widetilde H\otimes I_A)|\Phi_d\rangle_{SA} \\
&=\frac1d\sum_{i=1}^{d}\sum_{j=1}^{d}
\langle i|_S\langle i|_A(\widetilde H^\dagger\widetilde H\otimes I_A)|j\rangle_S|j\rangle_A \\
&=\frac1d\sum_{i=1}^{d}\sum_{j=1}^{d}
\langle i|_S\widetilde H^\dagger\widetilde H|j\rangle_S\langle i|_A|j\rangle_A \\
&=\frac1d\sum_{i=1}^{d}\langle i|_S\widetilde H^\dagger\widetilde H|i\rangle_S \\
&=\frac1d\operatorname{Tr}(\widetilde H^\dagger\widetilde H) \\
&=\frac1d\|\widetilde H\|_F^2
\ge
\frac{\|\widetilde H\|_2^2}{d}.
\end{aligned}
\tag{181}
$$

使用这一点，可以看到

$$
\begin{aligned}
\Pr(0)
&\ge \frac12\left(\frac{\|\widetilde H\|_2^2}{d\Delta^2}+1\right) \\
&=\frac{2\|\widetilde Ht\|_2^2}{d\pi^2}+\frac12 \\
&\ge \frac12,
\end{aligned}
\tag{182}
$$

其中第二行使用了 $\Delta=\pi/(2t)$。类似地，使用 $\|\widetilde H\|_F\le \sqrt r\|\widetilde H\|_2$，我们有

$$
\begin{aligned}
\Pr(0)
&\le \frac12\left(\frac{r\|\widetilde H\|_2^2}{d\Delta^2}+1\right) \\
&=\frac{2r\|\widetilde Ht\|_2^2}{d\pi^2}+\frac12.
\end{aligned}
\tag{183}
$$

由 Lemma 18，我们继承如下关于演化时间的上界：

$$
t\le \frac1{2\|H\|},
\tag{184}
$$

这意味着，如果 block-encoded 哈密顿量没有误差，也就是 $\widetilde H=H$，则成功概率当然小于 $1$。然而，我们必须考虑 block-encoding 程序带来的误差。所幸 Lemma 18 的结果保证

$$
\|Ht-\widetilde Ht\|\le \epsilon_b,
\tag{185}
$$

其中 $\epsilon_b\in(0,1/2)$。因此，成功概率仍然是有效的，因为它不可能大于 $1$ 或小于 $1/2$。

## B.6 方程 $(58)$ 的证明

由于我们已经有了 $N_s$ 的上界，即求解 Block-Encoded Hamiltonian Learning Problem 22 所需的伪 Choi 态数量，我们现在想知道，为了以高概率生成 $N_s$ 个伪 Choi 态，需要多少次对 $U_{\mathrm{block}}$ 的查询。方程 $(58)$ 给出了该值的一个上界，下面进行证明。

**方程 $(58)$ 的证明.** 考虑来自 [40] 的如下 Chernoff bound：

**Lemma 41.** 令 $X_1,\ldots,X_n\in[0,1]$ 是独立随机变量，且 $\mathbb E[X_i]=p_i$；令

$$
X=\sum_{i=1}^{n}X_i,
$$

并令

$$
\mu=\mathbb E[X]=\sum_{i=1}^{N}X_ip_i.
$$

对于 $\beta\in(0,1)$，有

$$
\Pr(X\le(1-\beta)\mu)\le e^{-\beta^2\mu/2}.
\tag{186}
$$

现在，令 $X$ 为在对 $U_{\mathrm{block}}$ 查询 $\widetilde N$ 次后产生的伪 Choi 态数量。我们希望 $X$ 大于或等于 $N_s$，所以我们寻找 $\Pr(X\le N_s)$ 的上界。由于从对 block-encoding 的一次查询得到每个伪 Choi 态的成功概率为 $\gamma^2/2$，见 Appendix B.5，所以有

$$
\mu=\frac{\widetilde N\gamma^2}{2}.
$$

为了使用 Chernoff bound 41，我们因此选择

$$
\beta=1-\frac{2N_s}{\gamma^2\widetilde N}.
\tag{187}
$$

注意，由于为了应用 Chernoff bound，$\beta$ 必须大于零，所以要求

$$
\widetilde N\ge \frac{2N_s}{\gamma^2}.
$$

由 Chernoff bound，我们于是有

$$
\Pr(X\le N_s)
\le
\exp\!\left[
-\frac{\widetilde N\gamma^2}{4}
\left(
1-\frac{4N_s}{\gamma^2\widetilde N}
+
\frac{4N_s^2}{\gamma^4\widetilde N^2}
\right)
\right]
\tag{188}
$$

$$
=
\exp\!\left(
-\frac{\widetilde N\gamma^2}{4}+N_s-
\frac{N_s^2}{\gamma^2\widetilde N}
\right)
\tag{189}
$$

$$
\le
\exp\!\left(
-\frac{\widetilde N\gamma^2}{4}+N_s
\right).
\tag{190}
$$

我们希望失败概率至多为 $\delta_{N_s}$，所以令

$$
\delta_{N_s}\equiv
\exp\!\left(
-\frac{\widetilde N\gamma^2}{4}+N_s
\right),
\tag{191}
$$

由此可见

$$
\ln\!\left(\frac1{\delta_{N_s}}\right)
=
\frac{\widetilde N\gamma^2}{4}-N_s.
\tag{192}
$$

最后，解出 $\widetilde N$ 得到

$$
\widetilde N
=
\frac{4\ln(1/\delta_{N_s})}{\gamma^2}
+
\frac{4N_s}{\gamma^2}.
\tag{193}
$$

一般而言，我们假设 $N_s$ 会远大于 $\ln(1/\delta_{N_s})$。因此，为了以至少 $1-\delta_{N_s}$ 的概率生成至少 $N_s$ 个伪 Choi 态，所需的对 $U_{\mathrm{block}}$ 的查询次数为

$$
\widetilde N\in O\!\left(\frac{N_s}{\gamma^2}\right).
\tag{194}
$$
