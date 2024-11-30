import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/strategies/guard/jwt-auth.guard';
import { ChatService } from '../services/chat.service';
import { CreateChatDto } from '../dto/create-chat.dto';
import { SendMessageDto } from '../dto/sendMessage.dto';
import { UpdateChatDto } from '../dto/update-chat.dto';
import { Chat } from '@prisma/client';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createChatDto: CreateChatDto) {
    return this.chatService.create(createChatDto);
  }

  
  @UseGuards(JwtAuthGuard)
  @Get()
  async getChats(@Request() req): Promise<Chat[]> {
    return this.chatService.getChats(req.user.userId);
  }

  
  @UseGuards(JwtAuthGuard)
  @Get(':chatId')
  async getChatDetails(@Param('chatId') chatId: string): Promise<Chat> {
    return this.chatService.getChatDetails(chatId);
  }
  

  @UseGuards(JwtAuthGuard)
  @Post(':chatId/messages')
  async sendMessage(@Param('chatId') chatId: string, @Request() req, @Body() sendMessageDto: SendMessageDto): Promise<Chat> {
    return this.chatService.sendMessage(chatId, req.user.userId, sendMessageDto);
  }


  @Patch(':id')
  update(@Param('id') id: string, @Body() updateChatDto: UpdateChatDto) {
    return this.chatService.update(+id, updateChatDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.chatService.remove(+id);
  }
}
