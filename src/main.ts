import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cors from "cors";
import * as helmet from "helmet";




async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  var corsOptions = {
    allowedHeaders: ['Authorization', 'refresh', 'content-type'],
    exposedHeaders: ['set-refresh', 'set-authorization', 'set-expiry']
  }
  app.use(cors(corsOptions));
  app.use(helmet());
  await app.listen(3000);
}
bootstrap();
