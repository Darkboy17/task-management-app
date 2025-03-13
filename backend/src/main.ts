import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS to allow frontend requests
  app.enableCors({
    origin: "*", // Allow frontend requests
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true, // Allow cookies if needed
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
