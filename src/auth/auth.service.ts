import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UsersRepository } from './users.repository';
import { AuthCredentialsInput } from './inputs/auth-credentials.input';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { JwtToken } from './interfaces/jwt-token.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UsersRepository) private usersRepository: UsersRepository,
    private jwtService: JwtService,
  ) {}

  async getUserById(id: string): Promise<User> {
    return this.usersRepository.findOne({ id });
  }

  async signUp(authCredentialsInput: AuthCredentialsInput): Promise<void> {
    return await this.usersRepository.createUser(authCredentialsInput);
  }

  async signIn(authCredentialsInput: AuthCredentialsInput): Promise<JwtToken> {
    const { username, password } = authCredentialsInput;
    const user = await this.usersRepository.findOne({ username });

    if (user && (await bcrypt.compare(password, user.password))) {
      const payload: JwtPayload = { username, sub: user.id };

      return {
        accessToken: this.jwtService.sign(payload),
      };
    } else {
      throw new UnauthorizedException('Incorrect username or password!');
    }
  }
  // async signIn(user: any): Promise<{ accessToken: string }> {
  //   const payload = { username: user.username, sub: user.id };
  //   return {
  //     accessToken: this.jwtService.sign(payload),
  //   };
  // }

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersRepository.findOne(username);
    if (user && user.password === pass) {
      const { password, ...result } = user;

      return result;
    }
    return null;
  }
}
