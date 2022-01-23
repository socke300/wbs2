import {BadRequestException, Body, Controller, Get, HttpException, HttpStatus, Post, Session} from '@nestjs/common';
import {MongoService} from "../service/mongo.service";
import {User} from "../model/user";
import {ISession} from "../interface/ISession";

@Controller('session')
export class AuthController {
    constructor(private sqlService: MongoService) {
    }

    @Post("login")
    async login(@Body("username") username: string, @Body("password") password: string, @Session() session: ISession): Promise<{ message: string }> {

        if (username == null || password == null) throw new BadRequestException();

        try {
            const result = await this.sqlService.checkUserExist(username, password);
            console.log(result[0].firstname)
            if (result.length === 1) {
                session.user = new User(result[0].id, result[0].username, result[0].firstName, result[0].lastName, new Date(result[0].time), result[0].rights);
                return {message: 'Successfully logged in'};
            } else {
                throw new HttpException({message: "Database request failed: " + result}, HttpStatus.INTERNAL_SERVER_ERROR);
            }
        } catch (err) {
            throw new HttpException({message: "Wrong Username or Password: " + err}, HttpStatus.UNAUTHORIZED);
        }
    }

    @Get("check")
    check(@Session() session: ISession) {
        if (session.user) return {message: "User still logged in."};
        throw new HttpException({message: "Session expired, please log in again."}, HttpStatus.UNAUTHORIZED);
    }

    @Post("logout")
    logout(@Session() session: ISession) {
        delete session.user;
        return {message: 'Successfully logged out'};
    }
}
