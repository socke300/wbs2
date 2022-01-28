import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get, HttpException, HttpStatus,
    InternalServerErrorException,
    Param,
    Post,
    Put,
    SetMetadata,
    UseGuards
} from '@nestjs/common';
import {AppService} from "../../app.service";
import {SqlHandlerService} from "../../Services/sql-handler/sql-handler.service";
import {User} from "../../Model/user";
import {RolesGuard} from "../../RoleGuard";
import {Rights} from "../../Model/Rights";
import {LoggingGuard} from "../../loggingGuard";

@Controller('user')
@UseGuards(RolesGuard, LoggingGuard)
export class UserController {
    constructor(private sqlHandler: SqlHandlerService) {}

    @Get()
    @SetMetadata("rights", Rights.User)
    async getUser(): Promise<User[]> {
        try{
            console.log(await this.sqlHandler.getAllUser());
            return await this.sqlHandler.getAllUser();
        }catch (err) {
            throw new HttpException("Database for all User failed:" + err, 500);
        }
    }

    @Post()
    @SetMetadata("rights", Rights.Admin)
    async addUser(@Body() user: User): Promise<{message: string}>{
        if(user.firstName && user.lastName && user.password){
            try{
                const res = await this.sqlHandler.addUser(user);
                if(res === null){ throw new Error("result is null");}
                return {
                    message: "Added new User successfully! User: " + user.firstName + " " + user.lastName
                };
            }catch {
                throw new HttpException("Something bad happened while adding a User!", 400);
            }
        }else{
            throw new HttpException("Not all Field are filled in!", HttpStatus.BAD_REQUEST);
        }
    }

    @Put(":id")
    @SetMetadata("rights", Rights.Admin)
    async updateUser(@Param() id: number, @Body() user: User): Promise<{message: string}>{
        if(user.firstName.trim().length <= 0 || user.lastName.trim().length <= 0 || user.password.trim().length <= 0){
            return {
                message: "Please fill in all the required fields!"
            }
        }else {
            try{
                await this.sqlHandler.updateUser(id, user);
                return {
                    message: "Updated User successfully! User: " + user.firstName + " " + user.lastName
                }
            } catch {
                throw new InternalServerErrorException();
            }
        }
    }

    @Delete(":id")
    @SetMetadata("rights", Rights.Admin)
    async deleteUser(@Param() id: number): Promise<{message: string}> {
        if(isNaN(id)){
            throw new HttpException("Invalid ID!", 400);
        }else{
            try{
                const result = await this.sqlHandler.deleteUser(id);
                if(result.affectedRows){
                    return {
                        message: "Deleted User successfully!"
                    }
                }else {
                    throw new HttpException("The user to be deleted could not be found!", 400);
                }
            } catch (err){
                throw new HttpException("Database request failed!" + err, 500);
            }
        }
    }
}
