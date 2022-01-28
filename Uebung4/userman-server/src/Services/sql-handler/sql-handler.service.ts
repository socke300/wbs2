import { Injectable } from '@nestjs/common';
import {Connection, createConnection, MysqlError} from "mysql";
import {User} from "../../Model/user";
import {Rights} from "../../Model/Rights";

@Injectable()
export class SqlHandlerService {

    private database: Connection;
    constructor() {
        this.database = createConnection({
            database: 'userman', // Database name, e.g. 'userman'
            host: 'localhost', // Database host address, e.g. 'localhost'
            password: '', // Database user's password, e.g. for XAMPP default is ''
            user: 'root', // Database user, e.g. for XAMPP default is 'root'

        });
        this.database.connect((error: MysqlError | null) => {
            if (error) { console.error(error) }
            else { console.log("Database connected!")}
        });
    }

    private async query(query: string, data?: unknown[]): Promise<unknown> {
        return new Promise<unknown>((resolve, reject) => {
            this.database.query(query, data, (err: MysqlError | null, rows: unknown) => {
                if (err != null) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        })
    }

    async getAllUser() {
        let query = "SELECT * FROM userlist;";

        let rows: unknown = await this.query(query, []);
        const userList: User[] = [];
        if(rows instanceof Array){
            for (const row of rows) {
                userList.push(new User(
                    row.id,
                    row.username,
                    row.firstName,
                    row.lastName,
                    row.password,
                    new Date(row.creationTime),
                    row.rights
                ));
            }
            return userList;
        }
    }

    async getUserByUsernameAndPassword(username: string, password: string): Promise<any>{
        const data: [string, string] = [username, password/*cryptoJS.SHA512(password).toString()*/];
        const query: string = 'SELECT * FROM userlist WHERE username = ? AND password = ?;';
        try{
            let rows: any = await this.query(query, data);
            if (rows.length === 1) {
                // Login data is correct, user is logged in
                return rows;
            }
        }catch (e){
            console.log("Query failed for User with Password and Username:" + e);
            return null;
        }
    }

    async addUser(user: User){
        const data: [string, string, string, string, string, Rights] = [
            new Date().toLocaleString(),
            user.username,
            user.password,
            user.firstName,
            user.lastName,
            Rights.User];
        const query: string = 'INSERT INTO userlist (creationTime, username, password, firstName, lastName, rights) VALUES (?, ?, ?, ?, ?, ?);';
        return await this.query(query, data);
    }

    async updateUser(id: number, user: User){
        const data: [string, string, string, number] = [
            user.firstName,
            user.lastName,
            user.password,
            id,
        ];
        let query: string = 'UPDATE userlist SET firstName = ?, lastName = ?, password = ? WHERE id = ?;'
        return await this.query(query, data);
    }

    async deleteUser(id: number): Promise<any>{
        let query: string = 'DELETE FROM userlist WHERE id = ?;';
        return await this.query(query, [id]);
}

}
