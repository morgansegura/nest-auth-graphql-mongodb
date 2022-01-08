import { Field, InputType } from '@nestjs/graphql';
import { IsString, Length, Matches } from 'class-validator';

@InputType()
export class AuthCredentialsInput {
  @IsString()
  @Length(4, 20, {
    message: 'Password must be between 4 and 20 characters in length.',
  })
  @Field()
  username: string;

  @IsString()
  @Length(8, 32, {
    message: 'Password must be between 8 and 32 characters in length.',
  })
  @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'Password must include at least 1 lowercase letter, 1 uppercase letter and 1 number or special character.',
  })
  @Field()
  password: string;

  @Field({ nullable: true })
  accessToken: string;
}
