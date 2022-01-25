import { Global, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';

import { RedisPubSub } from 'graphql-redis-subscriptions';
import * as Redis from 'ioredis';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [
    AuthService,
    AuthResolver,
    {
      provide: 'PUB_SUB',
      useFactory: () => {
        const options = {
          host: 'localhost',
          port: 6379,
        };
        return new RedisPubSub({
          publisher: new Redis(options),
          subscriber: new Redis(options),
        });
      },
    },
  ],
  exports: [AuthService],
})
export class AuthModule {}
