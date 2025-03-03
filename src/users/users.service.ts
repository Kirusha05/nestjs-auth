import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { UserEntity } from './users.entity';
import { InjectRepository } from '@nestjs/typeorm';

export interface CreateUser {
  email: string;
  password: string;
}

@Injectable()
export class UsersService {
  private logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async createUser(userToCreate: CreateUser): Promise<UserEntity> {
    try {
      const user = this.userRepository.create(userToCreate);
      return await this.userRepository.save(user);
    } catch (err) {
      if (err.code == 23505) {
        throw new HttpException(
          'User with this email already exists.',
          HttpStatus.CONFLICT,
        );
      }
      this.logger.error(err);
      throw new HttpException(
        'Something went wrong, try again later!',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findByEmail(email: string): Promise<UserEntity> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return user;
  }
}
