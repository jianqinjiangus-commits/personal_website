export type LinkItem = {
  name: string
  desc: string
  link: string
}

export const myLinks: LinkItem[] = [
  {
    name: 'Email',
    desc: 'Contact me by email.',
    link: 'mailto:2400010734@stu.pku.edu.cn'
  },
  {
    name: 'GitHub',
    desc: 'My code and projects.',
    link: 'TODO: GitHub URL'
  },
  {
    name: 'Blog RSS',
    desc: 'Subscribe to my posts.',
    link: '/rss.xml'
  }
]

export const references: LinkItem[] = [
  {
    name: 'Astro',
    desc: 'The web framework used to build this site.',
    link: 'https://astro.build/'
  },
  {
    name: 'Astro Theme Pure',
    desc: 'The base theme used in this repository.',
    link: 'https://astro-pure.js.org/'
  }
]

export const linkApplyInfo = [
  { name: 'Name', val: "TON's Space" },
  { name: 'Desc', val: 'Mathematics, Scientific Computing, Quantum Algorithms, and Notes' },
  { name: 'Link', val: 'TODO: deployed site URL' },
  { name: 'Avatar', val: 'TODO: avatar URL' },
  { name: 'RSS', val: '/rss.xml' },
  { name: 'Email', val: '2400010734@stu.pku.edu.cn' }
] as const
