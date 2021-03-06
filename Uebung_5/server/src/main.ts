import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import session = require ('express-session');

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.use(
        session({
            cookie: {
                maxAge: 5 * 600000000000000000 * 100000000000, // 1000ms * 60 (sec) * 5 (min)
            },
            name: 'test', // The name of the cookie generated by the server, e.g. 'myCookie'
            resave: false, // save with new time stamp (for operating systems without 'touch' command)
            rolling: false, // re-generate the cookie on every request
            saveUninitialized: false, // save session even if it stores no data
            secret: 'kekw', // Encrypt session id using this modifier, e.g. 'Secret'
        }),
    );
    await app.listen(3000);
    console.log("Server started: http://localhost:3000");
}

bootstrap();
