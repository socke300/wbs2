import {
    Body,
    Controller,
    Delete,
    Get,
    HttpException,
    HttpStatus,
    Param,
    Post,
    Put,
    Session,
    SetMetadata,
    UseGuards
} from '@nestjs/common';
import {SqlService} from "../sql/sql.service";
import {ISession} from "../models/ISession";
import {User} from "../models/user";
import {RoleGuard} from "../guards/RoleGuard";
import {Rights} from "../models/Rights";

@Controller('user')
@UseGuards(RoleGuard)
export class UserController {
    constructor(private sqlService: SqlService) {
    }

    @Get()
    @SetMetadata('role', Rights.User)
    async getUsers(@Session() session: ISession) {
        try {
            const userlist = await this.sqlService.getAllUsers();

            for (const userlistElement of userlist) {
                delete userlistElement.password;
            }

            return userlist;
        } catch (e) {
            throw new HttpException({message: 'Database request failed.'}, HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    @Post()
    @SetMetadata('role', Rights.Admin)
    addUser(@Body() user: User) {
        if (!user.username) {
            throw new HttpException({message: 'Please enter username.'}, HttpStatus.BAD_REQUEST);
        }
        if (!user.password) {
            throw new HttpException({message: 'Please enter password.'}, HttpStatus.BAD_REQUEST);
        }
        if (!user.firstName) {
            throw new HttpException({message: 'Please enter first name.'}, HttpStatus.BAD_REQUEST);
        }
        if (!user.lastName) {
            throw new HttpException({message: 'Please enter last name.'}, HttpStatus.BAD_REQUEST);
        }
        try {

            return this.sqlService.addUser(user)
        } catch (e) {
            throw new HttpException({message: 'Database request failed.'}, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Delete(':id')
    @SetMetadata('role', Rights.Admin)
    deleteUser(@Param('id') userId: string) {
        try {
            return this.sqlService.deleteUser(Number(userId));
        } catch (e) {
            throw new HttpException({message: 'Database request failed.'}, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Put(':id')
    @SetMetadata('role', Rights.Admin)
    updateUser(@Param('id') userId: string, @Body() user: User) {
        if (!user.username) {
            throw new HttpException({message: 'Please enter username.'}, HttpStatus.BAD_REQUEST);
        }
        if (!user.password) {
            throw new HttpException({message: 'Please enter password.'}, HttpStatus.BAD_REQUEST);
        }
        if (!user.firstName) {
            throw new HttpException({message: 'Please enter first name.'}, HttpStatus.BAD_REQUEST);
        }
        if (!user.lastName) {
            throw new HttpException({message: 'Please enter last name.'}, HttpStatus.BAD_REQUEST);
        }
        try {
            return this.sqlService.updateUser(user);
        } catch (e) {
            throw new HttpException({message: 'Database request failed.'}, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
