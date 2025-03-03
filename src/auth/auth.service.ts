import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { SignupRequest, SignupResponse, LoginRequest, LoginResponse, UserInfo } from './auth.models';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Logger } from '@nestjs/common';

@Injectable()
export class AuthService {
  private logger = new Logger(AuthService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async signup(signupRequest: SignupRequest): Promise<SignupResponse> {
    const { email, name, password } = signupRequest;

    const hashedPassword = await bcrypt.hash(password, 12);
    const userToCreate = {
      email,
      name,
      password: hashedPassword,
    };

    const user = await this.usersService.createUser(userToCreate);
    return { id: user.id, email: user.email, name: user.name };
  }

  async login(loginRequest: LoginRequest): Promise<LoginResponse> {
    const { email, password } = loginRequest;

    const user = await this.usersService.findByEmail(email);
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    try {
      const token = this.jwtService.sign({
        sub: user.id,
        email: user.email,
        name: user.name,
      })
      return { accessToken: token, email: user.email };
    } catch (error) {
      this.logger.error(error);
      throw new HttpException('Something went wrong, try again later!', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getUserInfo(email: string): Promise<UserInfo> {
    const user = await this.usersService.findByEmail(email);
    return {
      name: user.name,
      email: user.email,
    };
  }
}
