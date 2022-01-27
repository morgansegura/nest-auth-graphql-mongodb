import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  CreateUserInput,
  LoginResponse,
  LoginUserInput,
  User,
} from '../../common/entities/user.entity';
import { MongoRepository } from 'typeorm';
import { AuthenticationError } from 'apollo-server-core';
import { jwtConstants } from '../../config/constants';
import { UpdateUserInput } from '../../graphql';
import * as generateUsername from 'better-usernames';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

import { VerificationTokenPayload } from '../../common/interfaces/verificationTokenPayload.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: MongoRepository<User>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async findAll(offset: number, limit: number): Promise<User[]> {
    return await this.usersRepository.find({
      order: { createdAt: 'DESC' },
      skip: offset,
      take: limit,
      cache: true,
    });
  }

  async findById(id: string): Promise<User> {
    return await this.usersRepository.findOne({ id });
  }

  async findByEmail(email: string): Promise<User> {
    return await this.usersRepository.findOne({ email });
  }

  async create(input: CreateUserInput): Promise<User> {
    const { password, email } = input;
    const message = 'Email has already been taken.';

    const existedUser = await this.usersRepository.findOne({ email });
    if (existedUser) {
      throw new Error(message);
    }

    const user = new User();
    user.username = generateUsername();
    user.password = password;
    user.email = email;

    console.log({ user });
    try {
      return await this.usersRepository.save(user);
    } catch (error) {
      throw new Error(error);
    }
  }

  async update(id: string, input: UpdateUserInput): Promise<boolean> {
    const { username, password, email } = input;

    const user = await this.usersRepository.findOne({ id });

    user.username = username;
    user.password = password;
    user.email = email;

    return (await this.usersRepository.save(user)) ? true : false;
  }

  async delete(id: string): Promise<boolean> {
    const user = new User();
    user.id = id;
    return (await this.usersRepository.remove(user)) ? true : false;
  }

  async deleteAll(): Promise<boolean> {
    return (await this.usersRepository.deleteMany({})) ? true : false;
  }

  async login(input: LoginUserInput): Promise<LoginResponse> {
    const { email, password } = input;
    const message = 'Incorrect email or password. Please try again.';

    const user = await this.usersRepository.findOne({ email });

    if (!user || !(await user.matchesPassword(password))) {
      throw new AuthenticationError(message);
    }

    const token = jwt.sign(
      {
        username: user.username,
        sub: user.id,
      },
      `${process.env.JWT_TOKEN}`,
      {
        expiresIn: '30d',
      },
    );

    return { token };
  }

  async findOneByToken(token: string) {
    const message = 'The token you provided was invalid.';
    let currentUser = {};

    try {
      const decodeToken = await jwt.verify(token, jwtConstants.secret);
      currentUser = await this.usersRepository.findOne({
        id: decodeToken.sub.toString(),
      });
    } catch (error) {
      throw new AuthenticationError(message);
    }

    return currentUser;
  }

  async setRole(id: string, role: string): Promise<boolean> {
    return (await this.usersRepository.updateOne({ id }, { $set: { role } }))
      ? true
      : false;
  }

  async getAuthenticatedUser(email: string, hashedPassword: string) {
    try {
      const user = await this.findByEmail(email);
      const isPasswordMatching = await bcrypt.compare(
        hashedPassword,
        user.password,
      );
      if (!isPasswordMatching) {
        throw new HttpException(
          'Wrong credentials provided',
          HttpStatus.BAD_REQUEST,
        );
      }
      user.password = undefined;
      return user;
    } catch (error) {
      throw new HttpException(
        'Wrong credentials provided',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async getCookieWithJwtToken(email: string) {
    const payload: VerificationTokenPayload = { email };

    const user = await this.findByEmail(payload.email);

    const token = jwt.sign(
      {
        username: user.username,
        sub: user.id,
      },
      `${process.env.JWT_TOKEN}`,
      {
        expiresIn: '30d',
      },
    );

    return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get(
      'JWT_EXPIRATION_TIME',
    )}`;
  }

  async markEmailAsConfirmed(email: string): Promise<boolean> {
    return (await this.usersRepository.update(
      { email },
      {
        isEmailConfirmed: true,
      },
    ))
      ? true
      : false;
  }
}
