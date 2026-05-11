import type { CardListData, Config, IntegrationUserConfig, ThemeUserConfig } from 'astro-pure/types'

export const theme: ThemeUserConfig = {
  // [Basic]
  title: "TON's Space",
  author: 'TON',
  description:
    'TON 的个人学术与技术网站，用于整理博客、课程笔记、论文阅读、数值实验、量子计算学习记录和个人项目。',
  favicon: '/favicon/favicon.ico',
  socialCard: '/images/social-card.png',
  locale: {
    lang: 'zh-CN',
    attrs: 'zh_CN',
    dateLocale: 'zh-CN',
    dateOptions: {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }
  },
  logo: {
    src: '/src/assets/avatar.png',
    alt: 'TON Avatar'
  },

  titleDelimiter: '•',
  prerender: true,
  npmCDN: 'https://cdn.jsdelivr.net/npm',
  head: [],
  customCss: [],

  header: {
    menu: [
      { title: 'Blog', link: '/blog' },
      { title: 'Notes', link: '/notes' },
      { title: 'Knowledge base', link: '/indexes' },
      { title: 'Projects', link: '/projects' },
      { title: 'About', link: '/about' },
      { title: 'Links', link: '/links' }
    ]
  },

  footer: {
    year: `© ${new Date().getFullYear()}`,
    links: [
      {
        title: 'Email: 2400010734@stu.pku.edu.cn',
        link: 'mailto:2400010734@stu.pku.edu.cn',
        style: 'text-sm'
      },
      {
        title: 'Site Policy',
        link: '/terms',
        pos: 2
      }
    ],
    credits: true,
    social: [
      { icon: 'github', label: 'GitHub', href: '/links' },
      { icon: 'rss', label: 'RSS', href: '/rss.xml' }
    ]
  },

  // [Content]
  content: {
    externalLinks: {
      content: ' ↗',
      properties: { style: 'user-select:none' }
    },
    blogPageSize: 8,
    share: ['x', 'bluesky']
  }
}

export const integ: IntegrationUserConfig = {
  // [Links]
  links: {
    logbook: [
      { date: '2026-05-10', content: "TON's Space initialized for long-term publishing." },
      { date: '2026-05-10', content: 'Blog / Notes / Projects sections are now live.' }
    ],
    applyTip: [
      { name: 'Name', val: theme.title },
      {
        name: 'Desc',
        val: 'Mathematics, Scientific Computing, Quantum Algorithms, and Notes'
      },
      { name: 'Link', val: 'TODO: deployed site URL' },
      { name: 'Avatar', val: 'TODO: avatar URL' },
      { name: 'RSS', val: '/rss.xml' },
      { name: 'Email', val: '2400010734@stu.pku.edu.cn' }
    ],
    cacheAvatar: false
  },

  // [Search]
  pagefind: true,

  // [Quote]
  quote: {
    server: 'https://dummyjson.com/quotes/random',
    target: `(data) => (data.quote.length > 80 ? \`\${data.quote.slice(0, 80)}...\` : data.quote || 'Error')`
  },

  // [Typography]
  typography: {
    class: 'prose text-base',
    blockquoteStyle: 'italic',
    inlineCodeBlockStyle: 'modern'
  },

  // [Lightbox]
  mediumZoom: {
    enable: true,
    selector: '.prose .zoomable',
    options: {
      className: 'zoomable'
    }
  },

  // [Comment]
  waline: {
    enable: false,
    server: 'TODO: waline server URL',
    showMeta: false,
    emoji: ['bmoji', 'weibo'],
    additionalConfigs: {
      pageview: true,
      comment: true,
      locale: {
        reaction0: 'Like',
        placeholder: '欢迎留言（可选填写邮箱用于接收回复）'
      },
      imageUploader: false
    }
  }
}

export const terms: CardListData = {
  title: 'Terms content',
  list: [
    {
      title: 'Privacy Policy',
      link: '/terms/privacy-policy'
    },
    {
      title: 'Terms and Conditions',
      link: '/terms/terms-and-conditions'
    },
    {
      title: 'Copyright',
      link: '/terms/copyright'
    },
    {
      title: 'Disclaimer',
      link: '/terms/disclaimer'
    }
  ]
}

const config = { ...theme, integ } as Config
export default config
