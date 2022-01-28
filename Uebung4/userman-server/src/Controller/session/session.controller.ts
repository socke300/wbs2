import {
    BadRequestException,
    Body,
    Controller,
    Get, HttpException, HttpStatus,
    Post,
    Session,
    UnauthorizedException
} from '@nestjs/common';
import {ISession} from "../../Model/ISession";
import {SqlHandlerService} from "../../Services/sql-handler/sql-handler.service";
import {User} from "../../Model/user";

@Controller('session')
export class SessionController {

    constructor(private sqlService: SqlHandlerService) {
    }

    @Post("login")
    async login(@Body("username") username: string, @Body("password") password: string, @Session() session: ISession): Promise<{ message: string }> {

        if (username == null || password == null) throw new BadRequestException();

        try {
            const result = await this.sqlService.getUserByUsernameAndPassword(username, password);
            if (result.length === 1) {
                session.user = new User(result[0].id, result[0].username, result[0].firstName, result[0].lastName, result[0].password, new Date(result[0].time), result[0].rights);
                return {message: 'Successfully logged in'};
            } else {
                throw new HttpException("Wrong Username or Password", HttpStatus.UNAUTHORIZED);
            }
        } catch (err) {
            throw new HttpException("Database request failed: " + err, HttpStatus.BAD_REQUEST);
        }
    }

    @Get("check")
    async loginCheck(@Session() session: ISession): Promise<{message: string}>{
        if(session.user) {
            return {
                message: "User is still logged in!"
            };
        }else {
            throw new HttpException("Session expanded. Log in again!", HttpStatus.UNAUTHORIZED);
        }
    }

    @Post("logout")
    async logout(@Session() session: ISession): Promise<{message: string}>{
        delete session.user;
        return {
            message: "Logging out was successful!"
        }
    }
}
