import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';
import EmailService from '../email/email.service';
import VerificationTokenPayload from '../../common/interfaces/verificationTokenPayload.interface';
import { AuthService } from '../auth/auth.service';
import { jwtConstants } from 'src/config/constants';

@Injectable()
export class EmailConfirmationService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
    private readonly authService: AuthService,
  ) {}
  public async confirmEmail(email: string) {
    const user = await this.authService.findByEmail(email);
    if (user.isEmailConfirmed) {
      throw new BadRequestException('Email already confirmed');
    }
    console.log('Email should be confirmed');
    await this.authService.markEmailAsConfirmed(email);
  }

  public async decodeConfirmationToken(token: string) {
    try {
      const payload = await this.jwtService.verify(token, {
        secret: `${jwtConstants.secret}`,
      });

      if (typeof payload === 'object' && 'username' in payload) {
        return payload.email;
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
      `${process.env.JWT_TOKEN}`,
      {
        expiresIn: `${this.configService.get('JWT_EXPIRATION_TIME')}s`,
      },
    );

    const url = `${this.configService.get(
      'EMAIL_CONFIRMATION_URL',
    )}?token=${token}`;

    const text = `Welcome to the application. To confirm the email address, click here: ${url}`;

    return this.emailService.sendMail({
      to: email,
      subject: 'Email confirmation',
      text,
    });
  }
}
