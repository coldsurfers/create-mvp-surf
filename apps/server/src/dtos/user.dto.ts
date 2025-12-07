import z from 'zod';

export const UserDTOSchema = z.object({
  id: z.string(),
  email: z.string(),
  provider: z.string(),
  deactivatedAt: z.date().nullable(),
});
export type UserDTO = z.infer<typeof UserDTOSchema>;
