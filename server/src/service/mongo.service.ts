import {Injectable} from '@nestjs/common';
import {Collection, MongoClient, ObjectId} from 'mongodb';
import {User} from "../model/user";

@Injectable()
export class MongoService {
    private collection: Collection<User>;

    constructor() {
        const uri = "mongodb+srv://admin:admin@cluster0.7anli.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

        const client = new MongoClient(uri);
        client.connect(async err => {
            this.collection = client.db("userman").collection<User>("users");
            if (err) console.error(err);
            else console.log('Successfully connected to MongoDB');
            //this.collection.insertOne(new User(1, "admin", "admin", "admin", new Date(), 2))
        });
    }

    public async checkUserExist(username: string, password: string): Promise<any> {
        let query: Object = {
            username: username,
            password: password
        };
        return await this.collection.find(query).toArray();
    }

    public async getUserList(): Promise<any> {
        return await this.collection.find({}).toArray();
    }

    public async addUser(user: User): Promise<any> {
        user.creationTime = new Date();
        user.rights = 0;
        return await this.collection.insertOne(user);
    }

    public async changeUser(user: User, id: ObjectId): Promise<any> {
        const query: Object = {
            "firstName": user.firstName,
            "lastName" : user.lastName,
            "password" : user.password
        }
        return await this.collection.updateOne({"_id": new ObjectId(id)}, query);
    }

    public async deleteUser(id: ObjectId): Promise<any> {
        const query: Object = {
            "_id" : new ObjectId(id)
        }
        return await this.collection.deleteOne(query);
    }
}
