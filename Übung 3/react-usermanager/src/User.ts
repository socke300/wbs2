export class User{
    static counter = 1;
    id: number;
    firstName: string;
    lastName: string;
    description: string;
    date: string;

    constructor(firstName: string, lastName: string, description: string) {
        this.id = User.counter++;
        this.firstName = firstName;
        this.lastName = lastName;
        this.description = description;
        this.date = new Date().toDateString();
    }


}