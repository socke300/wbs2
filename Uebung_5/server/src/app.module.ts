import { Module } from '@nestjs/common';
import {AuthController} from "./controller/auth.controller";
import {MongoService} from "./service/mongo.service";
import { UserController} from "./controller/user.controller";
import {ServeStaticModule} from "@nestjs/serve-static";

@Module({
  imports: [ServeStaticModule.forRoot({
    rootPath: `${__dirname}/../../client/dist/client`,
  })],
  controllers: [AuthController, UserController],
  providers: [MongoService],
})
export class AppModule {}
