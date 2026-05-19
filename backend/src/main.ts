import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PrismaService } from '../prisma/prisma.service';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import cookieParser from "cookie-parser";

(async () => {

  try {

    console.log('🚀 Starting CompreFlow...\n');
    // BACKEND
    const app = await NestFactory.create(AppModule);

    app.use(cookieParser());

    app.enableCors({

      origin: [

        "http://localhost:3000",

        "http://localhost:3001",

        "http://localhost:5173",
      ],
      methods: 'GET,POST,PUT,DELETE,OPTIONS',


      credentials: true,
    });

    // GLOBAL VALIDATION
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
      }),
    );

    // ----------------------------
    // SWAGGER CONFIG
    // ----------------------------
    const config = new DocumentBuilder()
      .setTitle('CompreFlow API')
      .setDescription('API documentation for authentication, users and products')
      .setVersion('1.0')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document);

    console.log('📘 Swagger: http://localhost:3000/docs\n');

    // PRISMA
    const prisma = app.get(PrismaService);

    // DATABASE
    try {
      await prisma.$connect();
      console.log('✅ Database: CONNECTED');
    } catch (error) {
      console.log('❌ Database: FAILED');
      console.log('🗄️ Check PostgreSQL connection\n');
    }

    const port = process.env.PORT || 3000;

    await app.listen(port);

    console.log(`✅ Backend API: ONLINE`);
    console.log(`🌐 http://localhost:${port}\n`);

    // FRONTEND (just info log, not backend responsibility)
    console.log('💻 Frontend should run separately (e.g. http://localhost:5173)\n');

    console.log('🎉 Application started successfully');

  } catch (error) {
    console.error('\n❌ Failed to start application');
    console.error(error);
  }
})()