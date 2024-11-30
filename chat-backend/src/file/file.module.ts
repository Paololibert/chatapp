import { Module } from '@nestjs/common';
import { FileController } from './controllers/file.controller';
import { FileService } from './services/file.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [FileController],
  providers: [FileService, PrismaService],
})
export class FileModule {}
