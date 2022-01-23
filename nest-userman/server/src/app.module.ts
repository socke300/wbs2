import { Module } from '@nestjs/common';
import {AuthController} from "./controller/auth.controller";
import {SqlService} from "./service/sql.service";
import { UserController} from "./controller/user.controller";
import {ServeStaticModule} from "@nestjs/serve-static";

@Module({
  imports: [ServeStaticModule.forRoot({
    rootPath: `${__dirname}/../../client/dist/client`,
  })],
  controllers: [AuthController, UserController],
  providers: [SqlService],
})
export class AppModule {}
