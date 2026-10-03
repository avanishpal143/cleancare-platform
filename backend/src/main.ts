import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log'],
    rawBody: true,
  });

  const config = app.get(ConfigService);
  const port   = config.get<number>('PORT', 4000);
  const env    = config.get<string>('NODE_ENV', 'development');

  // ---- CORS ----
  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // ---- Global prefix (no versioning) ----
  // Routes: /api/auth/send-otp, /api/orders, etc.
  app.setGlobalPrefix('api');

  // ---- Global pipes / filters / interceptors ----
  app.useGlobalPipes(new ValidationPipe({
    whitelist:        true,
    transform:        true,
    transformOptions: { enableImplicitConversion: true },
  }));
  app.useGlobalFilters(new GlobalExceptionFilter());
  app.useGlobalInterceptors(
    new LoggingInterceptor(),
    new TransformInterceptor(),
  );

  // ---- Swagger ----
  if (env !== 'production') {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('CleanCare API')
      .setDescription('CleanCare Dry Cleaning & Laundry Platform API')
      .setVersion('1.0')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('api/docs', app, document);
  }

  await app.listen(port);
  console.log(`\n🚀 CleanCare API → http://localhost:${port}/api`);
  console.log(`📖 Swagger docs  → http://localhost:${port}/api/docs\n`);
}

bootstrap();
