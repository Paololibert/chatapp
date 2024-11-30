import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  const config = new DocumentBuilder()
  .setTitle('Chat example')
  .setDescription('The Chat API description')
  .setVersion('1.0')
  .addTag('chat')
  .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);
  app.enableCors();
  app.setGlobalPrefix('api');
  app.enableCors({
    origin: 'http://localhost:3000', //frontend URL
    credentials: true,
  });
  
  await app.listen(3001);
}
bootstrap();
