import { Module } from '@nestjs/common';
import { UserController } from './user/user.controller';
import { SqlService } from './sql/sql.service';
import { SessionController } from './session/session.controller';
import {ServeStaticModule} from "@nestjs/serve-static";
import { MongoService } from './mongo/mongo.service';

@Module({
  imports: [
      ServeStaticModule.forRoot({
        rootPath: `${__dirname}/../../client/dist/client`,
      }),
  ],
  controllers: [UserController, SessionController],
  providers: [SqlService, MongoService],
})
export class AppModule {}
