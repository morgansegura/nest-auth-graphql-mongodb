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
    const { username, password, email } = input;
    const message = 'Email has already been taken.';

    const existedUser = await this.usersRepository.findOne({ email });

    if (existedUser) {
      throw new Error(message);
    }

    const user = new User();
    user.username = username;
    user.password = password;
    user.email = email;
    return await this.usersRepository.save(user);
  }

  async update(id: string, input: UpdateUserInput): Promise<boolean> {
    const { username, password, email } = input;

    // const updatedUser = await this.usersRepository.updateOne({ id }, { $set: { input } })

    const user = await this.usersRepository.findOne({ id });
    console.log(user);
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
        // issuer: 'http://chnirt.dev.io',
        subject: user.id,
        audience: user.username,
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
    let currentUser;

    try {
      const decodeToken = await jwt.verify(token, jwtConstants);

      currentUser = await this.usersRepository.findOne({
        id: atob(decodeToken.split('.')[1]),
        // id: decodeToken,
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

  // async validateUser(username: string, pass: string): Promise<any> {
  //   const user = await this.usersRepository.findOne(username);
  //   if (user && user.password === pass) {
  //     const { password, ...result } = user;

  //     return result;
  //   }
  //   return null;
  // }
}
