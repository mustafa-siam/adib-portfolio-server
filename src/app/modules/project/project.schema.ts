import { z } from 'zod';

const keyStatSchema = z.object({
  value: z.string().min(1, 'Stat value is required'),
  label: z.string().min(1, 'Stat label is required'),
});

const processStepSchema = z.object({
  number: z.string().min(1, 'Step number is required'),
  title: z.string().min(1, 'Step title is required'),
  description: z.string().min(1, 'Step description is required'),
});

const testimonialSchema = z.object({
  quote: z.string().min(1, 'Quote is required'),
  author: z.string().min(1, 'Author name is required'),
  role: z.string().min(1, 'Role is required'),
  avatar: z.string().min(1, 'Avatar image URL is required'),
});

export const projectBodySchema = z.object({
  slug: z.string().min(1, 'Project slug is required'),
  title: z.string().min(1, 'Project title is required'),
  category: z.string().min(1, 'Category is required'),
  tags: z.array(z.string()).min(1, 'At least one tag is required'),
  poster: z.string().optional(),
  videoUrl: z.string().optional(),
  summary: z.string().min(1, 'Summary is required'),
  clientBadge: z.string().optional(),
  roleBadge: z.string().optional(),
  liveLink: z.string().optional(),
  overview: z.object({
    heading: z.string().min(1, 'Overview heading is required'),
    description: z.string().min(1, 'Overview description is required'),
    stats: z.array(keyStatSchema).default([]),
  }),
  process: z.object({
    heading: z.string().min(1, 'Process heading is required'),
    description: z.string().min(1, 'Process description is required'),
    steps: z.array(processStepSchema).default([]),
    image: z.string().optional(),
  }),
  testimonial: testimonialSchema.optional(),
  isFeatured: z.boolean().default(false),
});

const createProject = z.object({
  body: projectBodySchema,
});

const updateProject = z.object({
  body: projectBodySchema.deepPartial(),
});

export const projectSchema = {
  createProject,
  updateProject,
};

export type IProject = z.infer<typeof projectBodySchema>;
