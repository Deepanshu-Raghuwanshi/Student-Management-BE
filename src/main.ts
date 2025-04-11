import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/filter/global-exception-handler';
import { TransformInterceptor } from './common/interceptor/transform-interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  console.log('🚀 Initializing Student Management API...');

  app.setGlobalPrefix('api'); // Ensures all routes are prefixed with /api

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.useGlobalFilters(new GlobalExceptionFilter());
  app.useGlobalInterceptors(new TransformInterceptor());

  const config = new DocumentBuilder()
    .setTitle('Student Management API')
    .setDescription('REST API for managing students and courses')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    customCssUrl:
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.css',
    customJs: [
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.js',
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.js',
    ],
    swaggerOptions: {
      url: '/api-json',
    },
  });

  const PORT = process.env.PORT || 3000;
  await app.listen(PORT);
  console.log(`✅ Server is running on: http://localhost:${PORT}/api`);
}
bootstrap();
