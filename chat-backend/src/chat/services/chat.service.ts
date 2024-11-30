import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Chat } from '@prisma/client';
import { SendMessageDto } from '../dto/sendMessage.dto';
import { UpdateChatDto } from '../dto/update-chat.dto';
import { CreateChatDto } from '../dto/create-chat.dto';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  async create(createChatDto: CreateChatDto): Promise<Chat> {
    if (
      !createChatDto.participants ||
      !Array.isArray(createChatDto.participants)
    ) {
      throw new BadRequestException('Participants should be an array');
    }

    // Checking the existence of participants
    const participantsExist = await this.prisma.user.findMany({
      where: {
        id: { in: createChatDto.participants.map((id) => parseInt(id)) },
      },
    });
    if (participantsExist.length !== createChatDto.participants.length) {
      throw new NotFoundException('One or more participants do not exist.');
    }

    // Creating the cat
    const data = await this.prisma.chat.create({
      data: {
        participants: {
          connect: createChatDto.participants.map((participantId) => ({
            id: parseInt(participantId),
          })),
        },
      },
    });

    return data;
  }

  async getChats(userId: string): Promise<Chat[]> {
    try {
      const data = await this.prisma.chat.findMany({
        where: {
          participants: {
            some: {
              id: parseInt(userId),
            },
          },
        },
        include: {
          participants: {
            select: {
              id: true,
              username: true,
            },
          },
        },
      });
      return data;
    } catch (error) {
      throw new InternalServerErrorException('Error fetching chats');
    }
  }

  async getChatDetails(chatId: string): Promise<Chat> {
    const data = await this.prisma.chat.findUnique({
      where: { id: +chatId },
      include: {
        participants: {
          select: { id: true, username: true },
        },
        messages: {
          include: {
            sender: {
              select: { id: true, username: true },
            },
          },
        },
      },
    });
    return data;
  }

  async sendMessage(
    chatId: string,
    userId: string,
    sendMessageDto: SendMessageDto,
  ): Promise<Chat> {
    // Search chat by ID
    const chat = await this.prisma.chat.findUnique({
      where: { id: parseInt(chatId) },
      include: {
        messages: true,
        participants: true,
      },
    });
  
    if (!chat) {
      throw new NotFoundException('Chat not found');
    }
  
    // Create and add the message to the chat
    const message = await this.prisma.message.create({
      data: {
        senderId: parseInt(userId),
        content: sendMessageDto.content,
        chatId: chat.id,
      },
    });
  
    // Return chat updated with new message, ensuring messages are sorted by timestamp or id
    const newChat = await this.prisma.chat.findUnique({
      where: { id: chat.id },
      include: {
        messages: {
          include: {
            sender: true, // Include sender details
          },
          orderBy: {
            timestamp: 'asc', // Sort messages by timestamp (or by id as fallback)
          },
        },
        participants: true,
      },
    });
    
    return newChat;
  }
  

  update(id: number, updateChatDto: UpdateChatDto) {
    return `This action updates a #${id} chat`;
  }

  remove(id: number) {
    return `This action removes a #${id} chat`;
  }
}
