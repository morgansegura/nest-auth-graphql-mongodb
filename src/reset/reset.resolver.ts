import { Args, Query, Resolver } from '@nestjs/graphql';
import { ResetEntity } from './reset.entity';
import { ResetService } from './reset.service';
import { ResetType } from './reset.type';

@Resolver(() => ResetType)
export class ResetResolver {
  constructor(private resetService: ResetService) {}

  @Query(() => ResetType)
  getResetById(@Args('id') id: string): Promise<ResetEntity> {
    return this.resetService.getResetById(id);
  }
}
