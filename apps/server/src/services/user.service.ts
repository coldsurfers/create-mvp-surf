import type { UserDTO } from '@/dtos/user.dto';
import type { UserRepository } from '@/repositories/user.repository';

export class UserService {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async getUserById(id: string): Promise<UserDTO | null> {
    return this.userRepository.findById(id);
  }

  async getUsers(): Promise<UserDTO[]> {
    return this.userRepository.findMany();
  }
}
