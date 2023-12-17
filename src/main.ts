import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  const swagger = new DocumentBuilder()
    .setTitle('Budget Master API')
    .setDescription('Super cool API for Budget Management')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
    })
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, swagger);
  SwaggerModule.setup('docs', app, document);

  await app.listen(3000);
}
bootstrap();
