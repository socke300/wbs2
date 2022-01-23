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
    SetMetadata,
    UseGuards
} from '@nestjs/common';
import {MongoService} from "../service/mongo.service";
import {User} from "../model/user";
import {Rights} from "../model/rights";
import {RolesGuard} from "../service/rolesGuard.service";

@Controller('user')
@UseGuards(RolesGuard)
export class UserController {
    constructor(private sqlService: MongoService) {
    }

    @Get()
    @SetMetadata('role', [Rights.User])
    async getUser() {
        try {
            const result = await this.sqlService.getUserList();
            const userList: User[] = [];

            for (const row of result) {
                userList.push(new User(
                    row._id.toString(),
                    row.username,
                    row.firstName,
                    row.lastName,
                    new Date(row.creationTime),
                    row.rights
                ));
            }
            return userList;

        } catch (err) {
            throw new HttpException({message: "Database request failed: " + err}, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Post()
    @SetMetadata('role', [Rights.Admin])
    async postUser(@Body() user: User) {
        if (user.firstName && user.lastName && user.password) {
            try {
                const result = await this.sqlService.addUser(user);

                if (result === null) throw new Error("result is null");

                return {message: 'Successfully created new user',};

            } catch (err) {
                throw new HttpException({message: "An error occured while creating the new user: " + err}, HttpStatus.BAD_REQUEST);
            }
        } else {
            throw new HttpException({message: "Not all mandatory fields are filled in."}, HttpStatus.BAD_REQUEST);
        }
    }

    @Put(":id")
    @SetMetadata('role', [Rights.Admin])
    async putUser(@Body() user: User, @Param("id") id: string) {
        if (user.firstName && user.lastName) {
            try {
                const result = await this.sqlService.changeUser(user, id);

                if (result.modifiedCount != 1) throw new Error("400");

                return {
                    message: `Successfully updated user ${user.firstName} ${user.lastName}`,
                };
            } catch (err) {
                throw new HttpException({message: "The user to update could not be found"}, 400);
            }
        } else {
            throw new HttpException({message: "Not all mandatory fields are filled in"}, 400);
        }
    }

    @Delete(":id")
    @SetMetadata('role', [Rights.Admin])
    async deleteUser(@Param("id") id: string) {
        try {
            const result = await this.sqlService.deleteUser(id);
            if (result.deletedCount === 1) {
                return {
                    message: `Successfully deleted user `,
                };
            } else {
                throw new HttpException({message: "The user to be deleted could not be found"}, 400);
            }
        } catch (err) {
            throw new HttpException({message: 'Database request failed: ' + err}, 500);
        }
    }

}
