import { Module } from '@nestjs/common';
import { ResetService } from './reset.service';
import { ResetResolver } from './reset.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResetEntity } from './reset.entity';
import { ResetRepository } from './reset.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([ResetEntity]),
    TypeOrmModule.forFeature([ResetRepository]),
  ],
  providers: [ResetService, ResetResolver],
})
export class ResetModule {}
