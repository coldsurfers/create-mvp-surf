import z from 'zod';

export const UserDTOSchema = z.object({
  id: z.string(),
  email: z.string(),
});
export type UserDTO = z.infer<typeof UserDTOSchema>;
