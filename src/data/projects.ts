export type ProjectItem = {
  name: string
  description: string
  tags: string[]
  source: string
  demo: string
  status: 'active' | 'paused' | 'done'
  category: string
}

export const projects: ProjectItem[] = [
  {
    name: "TON's Space",
    description: 'A personal academic website for blogs, notes, research logs, and projects.',
    tags: ['Astro', 'Markdown', 'MDX', 'Website'],
    source: 'TODO: GitHub repository URL',
    demo: 'TODO: deployed site URL',
    status: 'active',
    category: 'Websites'
  },
  {
    name: 'Quantum Paper Reading Workflow',
    description:
      'A workflow for reading quantum computing papers and producing structured research notes.',
    tags: ['Quantum Computing', 'Paper Reading', 'Hamiltonian Learning', 'Classical Shadows'],
    source: 'TODO',
    demo: 'TODO',
    status: 'active',
    category: 'Research Workflows'
  },
  {
    name: 'Numerical Experiment Workflow',
    description:
      'A reproducible workflow for numerical analysis assignments, code, figures, README files, and reports.',
    tags: ['Numerical Analysis', 'Python', 'MATLAB', 'Scientific Computing'],
    source: 'TODO',
    demo: 'TODO',
    status: 'active',
    category: 'Numerical Experiments'
  },
  {
    name: 'Codex Agent Workflow',
    description: 'A personal agent workflow organized around generale, quantool, and codeey.',
    tags: ['Codex', 'Agent', 'Automation', 'Workflow'],
    source: 'TODO',
    demo: 'TODO',
    status: 'active',
    category: 'Agents / Skills'
  }
]
