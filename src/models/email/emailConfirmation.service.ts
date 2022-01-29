import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';
import EmailService from '../email/email.service';
import VerificationTokenPayload from '../../common/interfaces/verificationTokenPayload.interface';
import { AuthService } from '../auth/auth.service';
import { jwtConstants } from 'src/config/constants';

@Injectable()
export class EmailConfirmationService {
  constructor(
    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
    private readonly authService: AuthService,
  ) {}
  public async confirmEmail(id: string) {
    const user = await this.authService.findById(id);

    if (user.isEmailConfirmed) {
      throw new BadRequestException('Email already confirmed');
    }

    await this.authService.markEmailAsConfirmed(id);
  }

  public async decodeConfirmationToken(token: string) {
    try {
      const payload = await jwt.verify(
        token,
        `${this.configService.get('JWT_SECRET')}`,
      );

      if (typeof payload === 'object' && 'sub' in payload) {
        return payload.sub;
      }
      throw new BadRequestException();
    } catch (error) {
      if (error?.name === 'TokenExpiredError') {
        throw new BadRequestException('Email confirmation token expired');
      }

      throw new BadRequestException('Bad confirmation token');
    }
  }
  public async sendVerificationLink(email: string) {
    const payload: VerificationTokenPayload = { email };

    const user = await this.authService.findByEmail(payload.email);

    const token = jwt.sign(
      {
        username: user.username,
        sub: user.id,
      },
      `${this.configService.get('JWT_SECRET')}`,
      {
        expiresIn: `${this.configService.get('JWT_EXPIRATION_TIME')}s`,
      },
    );

    const url = `${this.configService.get(
      'EMAIL_CONFIRMATION_URL',
    )}?token=${token}`;

    const text = `Welcome to the application. To confirm the email address, click here: ${url}`;

    return this.emailService.sendMail({
      to: user.email,
      subject: 'Email confirmation',
      text,
    });
  }

  public async resendConfirmationLink(id: string) {
    const user = await this.authService.findById(id);
    if (user.isEmailConfirmed) {
      throw new BadRequestException('Email already confirmed');
    }
    await this.sendVerificationLink(user.email);
  }
}
