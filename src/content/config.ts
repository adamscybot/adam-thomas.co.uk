import { string } from 'astro/zod'
import { defineCollection, z } from 'astro:content'

const blog = defineCollection({
  // Type-check frontmatter using a schema
  schema: z.object({
    title: z.string(),
    description: z.string(),
    // Transform string to Date object
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    sectionLinks: z.array(
      z.object({
        link: z.string(),
        name: z.string(),
      }),
    ).optional(),
  }),
})

export const collections = { blog }
