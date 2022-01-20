import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ResetType {
  @Field(() => ID)
  id: string;

  @Field()
  email: string;

  @Field()
  token: string;
}
