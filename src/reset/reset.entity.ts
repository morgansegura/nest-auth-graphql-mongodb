import { Exclude } from 'class-transformer';
import {
  Column,
  Entity,
  ObjectIdColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('password_resets')
export class ResetEntity {
  @ObjectIdColumn()
  @Exclude()
  _id: string;

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  email: string;

  @Column()
  token: string;
}
