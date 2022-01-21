import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  CreateUserInput,
  LoginResponse,
  LoginUserInput,
  User,
} from './user.entity';
import { MongoRepository } from 'typeorm';
import * as jwt from 'jsonwebtoken';
import { AuthenticationError } from 'apollo-server-core';
import { jwtConstants } from '../config/constants';
import { UpdateUserInput } from '../graphql';
import * as generateUsername from 'better-usernames';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: MongoRepository<User>,
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
    const { username, password } = input;
    const message = 'Incorrect email or password. Please try again.';

    const user = await this.usersRepository.findOne({ username });

    if (!user || !(await user.matchesPassword(password))) {
      throw new AuthenticationError(message);
    }

    const token = await jwt.sign(
      {
        username: user.username,
        sub: user.id,
      },
      jwtConstants,
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
      const decodeToken = await jwt.verify(token, jwtConstants);
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
}
