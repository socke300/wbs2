import {User} from "@/model/User";

export class DataService {

    userList: User[] = [];
    id: number = 0;

    constructor() {
        //this.userList.push(new User(-1, 'test', 'test', 'test', new Date(), 0, false));
    }

    getUserByID(id: number): User {
        return <User>this.userList.find(item => item.id === id);
    }

    editUser(firstName: string, lastName: string, id: number, description: string): void {
        const user: User | undefined = this.userList.find(item => item.id === id);
        if (user) {
            user.firstName = firstName;
            user.lastName = lastName;
            user.description = description;
        }
    }

    deleteUser(userID: number): void {
        this.userList = this.userList.filter(item => item.id !== userID);
    }

    addUser(user: User): void {
        user.id = this.id++;
        this.userList.push(Object.assign(user));
    }
}
