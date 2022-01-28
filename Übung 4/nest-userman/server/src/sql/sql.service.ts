import {Injectable} from '@nestjs/common';
import {User} from "../models/user";
import cryptoJS = require('crypto-js');

@Injectable()
export class SqlService {
    private database = require('mysql');
    connection;
    constructor() {
        this.connection = this.database.createConnection({
            user: "root",
            password: "",
            database: "userman"
        });
        this.connection.connect((error: any) => {
            if (error) {console.log(error)}
        });
    }

    private query(query: string, data?: unknown[]): Promise<any>{
        return new Promise<unknown>(((resolve, reject) => {
            this.connection.query(query, data, (err: any, rows: any) => {
                if (err != null) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            })
        }))
    }
    async getUserByUsernameAndPassword(username: string, password: string): Promise<User> {
        const sql: string = 'SELECT * FROM userlist WHERE username=? AND password=?;';
        let userQuery = await this.query(sql, [username, cryptoJS.SHA512(password).toString()])
        if (userQuery.length === 1){
            return userQuery[0] as User;
        }
    }
    async getAllUsers(){
        const sql: string = 'SELECT * FROM userlist;';
        return await this.query(sql, []);
    }
    async deleteUser(userId: number){
        const sql: string = 'DELETE FROM userlist WHERE id =?;';
        let userQuery = await this.query(sql, [userId]);
        if (userQuery.affectedRows === 1){
            return {message: "Successfully deleted user."};
        }
    }
    async updateUser(user: User){
        const sql: string = 'UPDATE userlist SET username=?, firstName=?, lastName=?, password=? WHERE id=?;';
        let userQuery = await this.query(sql, [user.username, user.firstName, user.lastName,cryptoJS.SHA512(user.password).toString(), user.id]);
        if (userQuery.affectedRows === 1){
            return {message: "Successfully updated user."};
        }
    }
    async addUser(user: User){
        const sql: string = 'INSERT INTO userlist (username, firstName, lastName, password, rights, creationTime) VALUES (?, ?, ?, ?, ?, ?);';
        let userQuery = await this.query(sql, [user.username, user.firstName, user.lastName, cryptoJS.SHA512(user.password).toString(), 0, user.creationTime ? user.creationTime : new Date()]);
        console.log(userQuery);
        if (userQuery.affectedRows === 1){
            return {message: "Successfully added user."};
        }
    }
}
