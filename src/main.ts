import { NestFactory, Reflector } from "@nestjs/core";
import { AppModule } from './app.module';
import { ErrorsInterceptor } from "./common/interceptors";
import { ClassSerializerInterceptor, ValidationPipe } from "@nestjs/common";
import { useContainer } from "class-validator";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalInterceptors(new ErrorsInterceptor());
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.useGlobalPipes(new ValidationPipe());
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  await app.listen(3000);
}
bootstrap();
