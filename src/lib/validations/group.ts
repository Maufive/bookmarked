import { z } from 'zod';

export const groupCreateSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(20, 'Only 20 characters allowed'),
});
