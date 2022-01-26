import {Injectable, NotFoundException} from '@nestjs/common';
import {Collection, MongoClient, ObjectId} from 'mongodb';
import {User} from "../models/user";

@Injectable()
export class MongoService {
    collection: Collection<User>;

    constructor() {
        const uri =
            "mongodb+srv://admin:admin@cluster0.vw0w9.mongodb.net/userman?retryWrites=true&w=majority";
        const client = new MongoClient(uri);
        client.connect(async err => {
            this.collection = client.db("userman").collection<User>("userlist");
            if (err) console.error(err);
            else console.log('Successfully connected to MongoDB');
        });
    }
    async getUserByUsernameAndPassword(username: string, password: string): Promise<User> {
        const query: Object = {username: username, password: password};
        const user: User = await this.collection.findOne(query);
        if (user !== null) {
            user.id = user._id;
            delete user._id;
            return user;
        } else {
            throw new NotFoundException();
        }
    }
    async getAllUsers(){
        const query = {};
        let users: User[] = await this.collection.find(query).toArray();
        for (let user of users){
            user.id = user._id;
            delete user._id;
        }
        return users;
    }
    async deleteUser(userId: string){
        const query: Object = {_id: new ObjectId(userId)};
        let userQuery = await this.collection.deleteOne(query);
        if (userQuery.deletedCount === 1){
            return {message: "Successfully deleted user."};
        }
    }
    async updateUser(user: User){
        console.log(user);
        const query: Object = {_id: new ObjectId(user.id)};
        let userQuery = await this.collection.replaceOne(query, user);
        if (userQuery.modifiedCount === 1){
            return {message: "Successfully updated user."};
        }
    }
    async addUser(user: User){
        let userQuery = await this.collection.insertOne(user);
        if (userQuery.insertedId){
            return {message: "Successfully added user."};
        }
    }
}
