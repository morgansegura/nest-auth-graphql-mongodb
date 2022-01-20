import { EntityRepository, Repository } from 'typeorm';
import { ResetEntity } from './reset.entity';

@EntityRepository(ResetEntity)
export class ResetRepository extends Repository<ResetEntity> {}
