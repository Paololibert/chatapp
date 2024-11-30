import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthController } from './controllers/auth.controller';
import { LocalStrategy } from './strategies/local.strategy';
import { UserModule } from 'src/user/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UserService } from 'src/user/services/user.service';

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET_KEY, 
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [AuthService, UserService, PrismaService, LocalStrategy,JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
