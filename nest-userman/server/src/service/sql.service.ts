import {Injectable} from '@nestjs/common';
import {Connection, createConnection, MysqlError} from "mysql";
import {User} from "../model/user";

@Injectable()
export class SqlService {
    private database: Connection;

    constructor() {
        this.database = createConnection({
            user: "root",
            password: "",
            host: "localhost",
            port: 3306,
            database: "userman_nest"
        });

        this.database.connect((error: MysqlError | null) => {
            if (error) {
                console.error(error)
            } else console.log("Database connected!");
        });
    }

    private send(query: string, data: any[]): Promise<any> {
        return new Promise((resolve, reject) => {
            this.database.query(query, data, (err: MysqlError, result: any) => {
                if (err) {
                    return reject(err)
                } else return resolve(result);
            })
        });
    }

    public async checkUserExist(username: string, password: string): Promise<any> {
        const query: string = 'SELECT * FROM userlist WHERE username = ? AND password = ?;';
        return await this.send(query, [username, password]);
    }

    public async getUserList(): Promise<any> {
        const query: string = 'SELECT * FROM userlist;';
        return await this.send(query, null);
    }

    public async addUser(user: User): Promise<any> {
        const query: string = 'INSERT INTO userlist (creationTime, username, password, firstName, lastName, rights) VALUES (?, ?, ?, ?, ?, ?);';
        return await this.send(query, [(new Date()).toDateString(), user.username, user.password, user.firstName, user.lastName, 0]);
    }

    public async changeUser(user: User, id: number): Promise<any> {
        const query: string = 'UPDATE userlist SET firstName = ?, lastName = ?, password = ? WHERE id = ?;';
        return await this.send(query, [user.firstName, user.lastName, user.password, id]);
    }

    public async deleteUser(id: number): Promise<any> {
        const query: string = 'DELETE FROM userlist WHERE id = ?;';
        return await this.send(query, [id]);
    }
}
