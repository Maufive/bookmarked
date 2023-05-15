import { z } from 'zod';

export const editBookmarkSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(100, 'Only 100 characters allowed'),
  description: z.string().optional(),
});
