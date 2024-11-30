import { Module } from '@nestjs/common';
import { UserController } from './controllers/user.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from './services/user.service';

@Module({
  controllers: [UserController],
  providers: [UserService, PrismaService],
})
export class UserModule {}
