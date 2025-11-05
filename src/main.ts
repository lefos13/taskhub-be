import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { initializeSentry } from './config/sentry.config';

async function bootstrap() {
  // Initialize Sentry error tracking before app creation
  initializeSentry();

  // Create the NestJS application instance
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Apply Helmet middleware for setting secure HTTP headers
  app.use(helmet());

  // Enable CORS with allowed origins from environment variable
  app.enableCors({
    origin: (configService.get<string>('CORS_ORIGIN') as string) || '*',
    credentials: true,
  });

  // Enable URI-based API versioning (e.g., /v1/)
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  // Apply global validation pipe for DTO validation and transformation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip properties not in DTO
      forbidNonWhitelisted: true, // Throw error on unknown properties
      transform: true, // Auto-transform payloads to DTO instances
      transformOptions: {
        enableImplicitConversion: true, // Allow implicit type conversion
      },
    }),
  );

  // Register global exception filter for consistent error responses
  app.useGlobalFilters(new AllExceptionsFilter());

  // Configure Swagger/OpenAPI documentation
  const swaggerConfig = new DocumentBuilder()
    .setTitle('NestJS API')
    .setDescription('API documentation for the NestJS application')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Enter your JWT token',
      },
      'JWT-auth',
    )
    .addTag('auth', 'Authentication endpoints')
    .addTag('protected', 'Protected endpoints')
    .addTag('health', 'Health check endpoints')
    .build();

  // Create and set up Swagger documentation endpoint
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api-docs', app, document, {
    customSiteTitle: 'NestJS API Docs',
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
  });

  // Start the application on the configured port
  const port = Number(configService.get<string>('PORT')) || 3000;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
  console.log(
    `API Documentation available at: http://localhost:${port}/api-docs`,
  );
}
// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();
