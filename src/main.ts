import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { mkdirSync } from 'fs';

async function bootstrap() {
  // Ensure uploads directory exists before the app handles any requests
  mkdirSync('./uploads', { recursive: true });

  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Project Nexus')
    .setDescription('Project Nexus API')
    .setVersion('1.0')
    .addTag('web-service')
    .addTag('restful')
    .addBearerAuth()
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
