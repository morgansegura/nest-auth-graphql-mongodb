import {
  ClassSerializerInterceptor,
  HttpException,
  HttpStatus,
  Inject,
  UseInterceptors,
} from '@nestjs/common';
import {
  Args,
  Context,
  Mutation,
  Query,
  Resolver,
  Subscription,
} from '@nestjs/graphql';
import { PubSubEngine } from 'graphql-subscriptions';
import { UpdateUserInput } from '../../graphql';
import { AuthService } from './auth.service';

import {
  CreateUserInput,
  LoginResponse,
  LoginUserInput,
  User,
} from '../../common/entities/user.entity';
import { EmailConfirmationService } from '../email/emailConfirmation.service';

@UseInterceptors(ClassSerializerInterceptor)
@Resolver('Users')
export class AuthResolver {
  constructor(
    @Inject('PUB_SUB') private pubSub: PubSubEngine,
    private authService: AuthService,
    private readonly emailConfirmationService: EmailConfirmationService,
  ) {}

  @Query(() => String)
  async hello() {
    return await 'world';
  }

  @Query(() => User)
  async me(@Context('currentUser') currentUser: User) {
    return await currentUser;
  }

  @Query(() => [User])
  async users(@Args('offset') offset: number, @Args('limit') limit: number) {
    return this.authService.findAll(offset, limit);
  }

  @Query(() => User)
  async user(@Args('id') id: string) {
    return this.authService.findById(id);
  }

  @Mutation(() => User, { name: 'register' })
  async createUser(
    @Args('input') input: CreateUserInput,
    @Context('pubSub') pubSub,
  ) {
    const createdUser = await this.authService.create(input);
    await this.emailConfirmationService
      .sendVerificationLink(input.email)
      .then(() => {
        this.pubSub.publish('userCreated', { userCreated: createdUser });
        return createdUser;
      })
      .catch(errors => {
        throw new Error(errors);
      });
  }

  @Mutation(() => Boolean)
  async updateUser(
    @Args('id') id: string,
    @Args('input') input: UpdateUserInput,
  ) {
    return await this.authService.update(id, input);
  }

  @Mutation(() => Boolean)
  async deleteUser(@Args('id') id: string) {
    return await this.authService.delete(id);
  }

  @Mutation(() => Boolean)
  async deleteUsers() {
    return await this.authService.deleteAll();
  }

  @Mutation(() => LoginResponse)
  async login(@Args('input') input: LoginUserInput) {
    return await this.authService.login(input);
  }

  @Mutation(() => Boolean)
  async setRole(@Args('id') id: string, @Args('role') role: string) {
    return await this.authService.setRole(id, role);
  }

  @Subscription('userCreated')
  userCreated(@Context('pubSub') pubSub: any) {
    return this.pubSub.asyncIterator('userCreated');
  }
}
