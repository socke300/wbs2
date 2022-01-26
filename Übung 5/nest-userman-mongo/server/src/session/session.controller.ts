import {
    BadRequestException,
    Body,
    Controller,
    Get,
    NotFoundException,
    Post,
    Session,
    UnauthorizedException
} from '@nestjs/common';
import {SqlService} from "../sql/sql.service";
import {ISession} from "../models/ISession";
import {MongoService} from "../mongo/mongo.service";

@Controller('session')
export class SessionController {


    constructor(private mongoService: MongoService) {}

    @Post("login")
    async login(
        @Body("username") username: string | null,
        @Body("password") password: string | null,
        @Session() session: ISession,
    ): Promise<{message: string}> {
        if (username == null || password == null) {
            throw new BadRequestException();
        }
        try {
            let user = await this.mongoService.getUserByUsernameAndPassword(username, password);
            if (user.username && user.rights && user.firstName && user.lastName){
                session.user = user;
            } else {
                throw new NotFoundException();
            }
        } catch {
            throw new UnauthorizedException();
        }
        return {
            message: "You are logged in",
        }
    }

    @Get("check")
    async check(@Session() session: ISession){
        if (session.user) return {message: "You are still logged in"}
        else throw new UnauthorizedException();
    }

    @Post("logout")
    async logout(@Session() session: ISession){
        delete session.user;
        return {message: "You've successfully logged out"}
    }
}
