import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { PrismaService } from 'src/prisma/prisma.service';
import { ChatController } from './controllers/chat.controller';
import { ChatService } from './services/chat.service';

@Module({
  controllers: [ChatController],
  providers: [ChatService, ChatGateway, PrismaService],
})
export class ChatModule {}
