import { defineCollection } from 'astro:content'
import { glob } from 'astro/loaders'
import { z } from 'astro/zod'

function removeDupsAndLowerCase(array: string[]) {
  if (!array.length) return array
  const lowercaseItems = array.map((str) => str.toLowerCase())
  const distinctItems = new Set(lowercaseItems)
  return Array.from(distinctItems)
}

const blog = defineCollection({
  loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
  schema: ({ image }) =>
    z.object({
      title: z.string().max(60),
      description: z.string().max(160),
      publishDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      heroImage: z
        .object({
          src: image(),
          alt: z.string().optional(),
          inferSize: z.boolean().optional(),
          width: z.number().optional(),
          height: z.number().optional(),
          color: z.string().optional()
        })
        .optional(),
      tags: z.array(z.string()).default([]).transform(removeDupsAndLowerCase),
      category: z.string().optional(),
      language: z.string().optional(),
      draft: z.boolean().default(false),
      comment: z.boolean().default(true)
    })
})

const docs = defineCollection({
  loader: glob({ base: './src/content/docs', pattern: '**/*.{md,mdx}' }),
  schema: () =>
    z.object({
      title: z.string().max(60),
      description: z.string().max(160),
      publishDate: z.coerce.date().optional(),
      updatedDate: z.coerce.date().optional(),
      tags: z.array(z.string()).default([]).transform(removeDupsAndLowerCase),
      draft: z.boolean().default(false),
      order: z.number().default(999)
    })
})

const notes = defineCollection({
  loader: glob({ base: './src/content/notes', pattern: '**/*.{md,mdx}' }),
  schema: () =>
    z.object({
      title: z.string().max(80),
      description: z.string().max(200),
      publishDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      tags: z.array(z.string()).default([]).transform(removeDupsAndLowerCase),
      category: z.string(),
      type: z.enum([
        'course-note',
        'paper-note',
        'research-note',
        'problem-solution',
        'reading-list',
        'workflow'
      ]),
      draft: z.boolean().default(false)
    })
})

const indexes = defineCollection({
  loader: glob({ base: './src/content/indexes', pattern: '**/*.{md,mdx}' }),
  schema: () =>
    z.object({
      title: z.string().max(80),
      description: z.string().max(200),
      publishDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      tags: z.array(z.string()).default([]).transform(removeDupsAndLowerCase),
      category: z.string(),
      type: z.enum([
        'course-note',
        'paper-note',
        'research-note',
        'problem-solution',
        'reading-list',
        'workflow'
      ]),
      draft: z.boolean().default(false)
    })
})

export const collections = { blog, docs, notes, indexes }
