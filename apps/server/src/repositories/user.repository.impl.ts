import type { UserDTO } from '@/dtos/user.dto';
import { dbClient } from '@/lib/db';
import type { User } from '@prisma/client';
import type { UserRepository } from './user.repository';

export class UserRepositoryImpl implements UserRepository {
  async findById(id: string): Promise<UserDTO | null> {
    const user = await dbClient.user.findUnique({
      where: { id },
    });
    return user ? this.toDTO(user) : null;
  }
  async findMany(): Promise<UserDTO[]> {
    const users = await dbClient.user.findMany();
    return users.map((user) => this.toDTO(user));
  }

  private toDTO(user: User): UserDTO {
    return {
      id: user.id,
      email: user.email,
    };
  }
}
