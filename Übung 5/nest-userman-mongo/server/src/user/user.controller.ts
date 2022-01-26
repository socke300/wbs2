import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get, HttpException, HttpStatus,
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
import {MongoService} from "../mongo/mongo.service";

@Controller('user')
@UseGuards(RoleGuard)
export class UserController {
    constructor(private mongoService: MongoService) {
    }

    @Get()
    @SetMetadata('role', Rights.User)
    getUsers(@Session() session: ISession){
        return this.mongoService.getAllUsers();
    }

    @Post()
    @SetMetadata('role', Rights.Admin)
    addUser(@Body() user: User){
        if (!user.username) {
            return new HttpException({message: 'Please enter username.'}, HttpStatus.BAD_REQUEST);
        }
        if (!user.password) {
            return new HttpException({message: 'Please enter password.'}, HttpStatus.BAD_REQUEST);
        }
        if (!user.firstName) {
            return new HttpException({message: 'Please enter first name.'}, HttpStatus.BAD_REQUEST);
        }
        if (!user.lastName) {
            return new HttpException({message: 'Please enter last name.'}, HttpStatus.BAD_REQUEST);
        }
        return this.mongoService.addUser(user)
    }

    @Delete(':id')
    @SetMetadata('role', Rights.Admin)
    deleteUser(@Param('id') userId: string){
        return this.mongoService.deleteUser(userId);
    }

    @Put(':id')
    @SetMetadata('role', Rights.Admin)
    updateUser(@Param('id') userId: string, @Body() user: User){
        if (!user.username) {
            return new HttpException({message: 'Please enter username.'}, HttpStatus.BAD_REQUEST);
        }
        if (!user.password) {
            return new HttpException({message: 'Please enter password.'}, HttpStatus.BAD_REQUEST);
        }
        if (!user.firstName) {
            return new HttpException({message: 'Please enter first name.'}, HttpStatus.BAD_REQUEST);
        }
        if (!user.lastName) {
            return new HttpException({message: 'Please enter last name.'}, HttpStatus.BAD_REQUEST);
        }
        return this.mongoService.updateUser(user);
    }
}
