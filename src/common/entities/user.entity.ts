import { Exclude } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
  IsEmail,
  IsString,
  Length,
  MinLength,
} from 'class-validator';
import * as uuid from 'uuid';
import * as bcrypt from 'bcrypt';
import {
  BeforeInsert,
  BeforeRemove,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ObjectIdColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export class LoginUserInput {
  @IsEmail(undefined, { message: 'Invalid email message' })
  @IsNotEmpty({ message: 'Your email can not be blank.' })
  email: string;
  @Length(1, 23, {
    message: 'Your password must be between 1 and 23 characters.',
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class CreateUserInput {
  @IsString()
  @MinLength(4, {
    message: 'Your username must be at least 4 characters',
  })
  @IsNotEmpty({ message: 'Your username can not be blank.' })
  username: string;

  @Length(1, 23, {
    message: 'Your password must be between 1 and 23 characters.',
  })
  @IsString()
  @IsNotEmpty({ message: 'Your password can not be blank.' })
  password: string;

  @IsEmail(undefined, { message: 'Invalid email message' })
  @IsNotEmpty({ message: 'Your email can not be blank.' })
  email: string;
}

export class LoginResponse {
  @IsString()
  token: string;
}
@Entity()
export class User {
  @ObjectIdColumn()
  @Exclude()
  _id: string;

  @PrimaryGeneratedColumn('uuid')
  @Index({ unique: true })
  id: string;

  @Column({ unique: true })
  @IsString()
  @IsNotEmpty()
  username: string;

  @Column()
  @IsString()
  @IsNotEmpty()
  @Exclude()
  password: string;

  @Column()
  @IsString()
  @IsNotEmpty()
  @Index({ unique: true })
  email: string;

  @Column()
  @IsString()
  @IsNotEmpty()
  role: string;

  @Column()
  @IsBoolean()
  @IsNotEmpty()
  status: boolean;

  @Column()
  @IsBoolean()
  @IsNotEmpty()
  isEmailConfirmed: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: string;
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: string;

  @BeforeInsert()
  async b4register() {
    this.id = await uuid.v4();
    this.role = await 'MEMBER';
    this.status = await true;
    this.password = await bcrypt.hash(this.password, 10);
  }

  @BeforeUpdate()
  async b4update() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  @BeforeRemove()
  async b4block() {
    this.status = false;
  }

  async matchesPassword(password) {
    return await bcrypt.compare(password, this.password);
  }
}
