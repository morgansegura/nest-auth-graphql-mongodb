import { ClassSerializerInterceptor, UseInterceptors } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from '../auth/auth.service';
import { EmailConfirmationService } from './emailConfirmation.service';

@UseInterceptors(ClassSerializerInterceptor)
@Resolver('Email')
export class EmailResolver {
  constructor(
    private emailConfirmationService: EmailConfirmationService,
    private authService: AuthService,
  ) {}

  @Mutation(() => Boolean)
  async resendConfirmationLink(@Args('id') id: string) {
    return await this.emailConfirmationService.resendConfirmationLink(id);
  }
}
