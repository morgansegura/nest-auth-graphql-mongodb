import { CacheModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './models/auth/auth.module';
import { TypeormService } from './config/typeorm/typeorm.service';
import { CacheService } from './config/cache/cache.service';
import { GraphqlService } from './config/graphql/graphql.service';
import { GraphQLModule } from '@nestjs/graphql';
import { GraphqlModule } from './config/graphql/graphql.module';
import { TypeormModule } from './config/typeorm/typeorm.module';
import { DataloaderModule } from './shared/dataloader/dataloader.module';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      envFilePath: ['.env.development.local', '.env.development'],
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeormService,
    }),
    CacheModule.registerAsync({
      useClass: CacheService,
    }),
    GraphQLModule.forRootAsync({
      useClass: GraphqlService,
    }),

    AuthModule,
    GraphqlModule,
    TypeormModule,
    DataloaderModule,
  ],
})
export class AppModule {}
