// src/controllers/file.controller.ts
import {
  Controller,
  Post,
  Get,
  Param,
  UploadedFile,
  UseInterceptors,
  Res,
  NotFoundException,
  Body,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { Express, Response } from 'express';
import { FileService } from '../services/file.service';

@Controller('chats/:chatId/files')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const filename = `${uuidv4()}-${file.originalname}`;
          cb(null, filename);
        },
      }),
    }),
  )

  async uploadFile(
    @Param('chatId') chatId: string,
    @UploadedFile() file: Express.Multer.File,
    @Body('content') content?: string
  ) {
    const chatIdNumber = parseInt(chatId, 10);
    return this.fileService.uploadFile(chatIdNumber, file, content);
  }

  @Get(':fileId')
  async downloadFile(@Param('fileId') fileId: string, @Res() res: Response) {
    const fileIdNumber = parseInt(fileId, 10);
    const file = await this.fileService.downloadFile(fileIdNumber);
    if (!file) {
      throw new NotFoundException('File not found');
    }
    res.sendFile(this.fileService.getFilePath(file));
  }
  
  @Get()
  async getFiles(@Param('chatId') chatId: string) {
    return await this.fileService.getFilesByChatId(parseInt(chatId, 10));
  }
}
