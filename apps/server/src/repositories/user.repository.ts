import type { UserDTO } from '@/dtos/user.dto';

export type UserRepository = {
  findMany: () => Promise<UserDTO[]>;
  findById: (id: string) => Promise<UserDTO | null>;
};
