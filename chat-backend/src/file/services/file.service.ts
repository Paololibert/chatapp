// src/services/file.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { Request } from 'express';
import { Multer } from 'multer';
import { join } from 'path';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FileService {
  constructor(private readonly prisma: PrismaService) {}

  async uploadFile(chatId: number, file: Express.Multer.File, content?: string) {
    const chat = await this.prisma.chat.findUnique({
      where: { id: chatId },
    });
    if (!chat) {
      throw new NotFoundException('Chat not found');
    }
  
    // Crée un nouveau message
    const newMessage = await this.prisma.message.create({
      data: {
        content,  // Utilise le contenu fourni ou un message par défaut pour le fichier
        chatId,
        senderId: 1, // Remplace par l'ID du user connecté
      },
    });
  
    // Associe le fichier au message
    const newFile = await this.prisma.files.create({
      data: {
        filename: file.filename,
        path: file.path,
        mimetype: file.mimetype,
        chatId,
        messageId: newMessage.id,  // Lien entre le fichier et le message
      },
    });
  
    return { newMessage, newFile };
  }
  
  
  

  async downloadFile(fileId: number) {
    const file = await this.prisma.files.findUnique({
      where: { id: fileId },
    });
    if (!file) {
      throw new NotFoundException('File not found');
    }
    return file;
  }

  getFilePath(file: { path: string }) {
    return join(__dirname, '..', '..', file.path);
  }

  async getFilesByChatId(chatId: number) {
    return await this.prisma.files.findMany({
      where: { chatId },
    });
  }
  async getMessagesWithFiles(chatId: number) {
    return await this.prisma.message.findMany({
      where: { chatId },
      include: {
        files: true,  
      },
    });
  }
}
