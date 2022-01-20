import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ResetRepository } from './reset.repository';
import { ResetEntity } from './reset.entity';

@Injectable()
export class ResetService {
  constructor(
    @InjectRepository(ResetRepository) private resetRepository: ResetRepository,
  ) {}

  async getResetById(id: string): Promise<ResetEntity> {
    return this.resetRepository.findOne({ id });
  }
}
