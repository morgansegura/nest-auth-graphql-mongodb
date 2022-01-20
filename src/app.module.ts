import { CacheModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { TypeormService } from './config/typeorm/typeorm.service';
import { CacheService } from './config/cache/cache.service';
import { GraphqlService } from './config/graphql/graphql.service';
import { GraphQLModule } from '@nestjs/graphql';
import { GraphqlModule } from './config/graphql/graphql.module';
import { TypeormModule } from './config/typeorm/typeorm.module';
import { DataloaderModule } from './shared/dataloader/dataloader.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useClass: TypeormService,
    }),
    CacheModule.registerAsync({
      useClass: CacheService,
    }),
    GraphQLModule.forRootAsync({
      useClass: GraphqlService,
    }),
    // GraphQLModule.forRoot({
    //   autoSchemaFile: true,
    //   installSubscriptionHandlers: true,
    //   context: ({ req, res }) => {
    //     return { request: req, response: res };
    //   },
    //   formatError: error => {
    //     const graphQLFormattedError = {
    //       message:
    //         error.extensions?.exception?.response?.message || error.message,
    //       code: error.extensions?.code || 'SERVER_ERROR',
    //       name: error.extensions?.exception?.name || error.name,
    //     };
    //     return graphQLFormattedError;
    //   },
    // }),
    AuthModule,
    GraphqlModule,
    TypeormModule,
    DataloaderModule,
  ],
})
export class AppModule {}
