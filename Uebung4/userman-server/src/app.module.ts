import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserController } from './Controller/user/user.controller';
import { SqlHandlerService } from './Services/sql-handler/sql-handler.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { SessionController } from './Controller/session/session.controller';
import { AuthController } from './Controller/auth/auth.controller';

@Module({
  imports: [
      ServeStaticModule.forRoot({
          rootPath: `${__dirname}/../../client/dist/client`,
      }),
  ],
  controllers: [AppController, UserController, SessionController, AuthController],
  providers: [AppService, SqlHandlerService],
})
export class AppModule {}
