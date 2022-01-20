import { Injectable } from '@nestjs/common';
import { TypeOrmOptionsFactory, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { getMetadataArgsStorage } from 'typeorm';
import { mongoURI } from '../constants';

@Injectable()
export class TypeormService implements TypeOrmOptionsFactory {
  async createTypeOrmOptions(): Promise<TypeOrmModuleOptions> {
    return {
      type: 'mongodb',
      url: `${mongoURI}`,
      entities: getMetadataArgsStorage().tables.map(tbl => tbl.target),
      // entities: [User],
      // entities: [__dirname + '/**/*.entity.ts'],
      synchronize: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      logging: true,
    };
  }
}
