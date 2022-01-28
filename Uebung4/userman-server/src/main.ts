import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(
      session({
          secret: 'wbs2',
          cookie: {
              maxAge: 500 * 6000 * 10000,
          },
          name: 'test',
          resave: false,
          rolling: false,
          saveUninitialized: false,

      }),
  );
  await app.listen(3000);
  console.log("Server started on http://localhost:3000 !");
}
bootstrap();
