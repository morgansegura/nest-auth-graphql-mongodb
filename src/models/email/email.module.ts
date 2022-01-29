import { Module } from '@nestjs/common';
import EmailService from './email.service';
import { ConfigModule } from '@nestjs/config';
import { EmailResolver } from './email.resolver';
import { EmailConfirmationService } from './emailConfirmation.service';

@Module({
  imports: [ConfigModule],
  controllers: [],
  providers: [EmailService, EmailResolver, EmailConfirmationService],
  exports: [EmailService, EmailConfirmationService],
})
export class EmailModule {}
