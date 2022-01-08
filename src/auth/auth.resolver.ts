import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { UserType } from './user.type';
import { AuthCredentialsInput } from './inputs/auth-credentials.input';
import {
  ClassSerializerInterceptor,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { GqlAuthGuard } from './guards/gql-auth.guard';
import { CurrentUser } from './decorators/get-user.decorator';
import { JwtToken } from './interfaces/jwt-token.interface';

@Resolver(() => UserType)
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(GqlAuthGuard)
  @Query(() => UserType)
  getUserById(@Args('id') id: string): Promise<User> {
    return this.authService.getUserById(id);
  }

  @Mutation(() => UserType)
  signUp(
    @CurrentUser()
    @Args('input')
    authCredentialsInput: AuthCredentialsInput,
  ): Promise<void> {
    return this.authService.signUp(authCredentialsInput);
  }

  @Mutation(() => UserType)
  signIn(
    @Args('input') authCredentialsInput: AuthCredentialsInput,
  ): Promise<JwtToken> {
    return this.authService.signIn(authCredentialsInput);
  }
}
