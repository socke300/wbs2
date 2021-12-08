export class User{
    static counter = 1;
    id;
    firstName;
    lastName;
    description;

    constructor(firstName, lastName, description) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.description = description;
        this.id = User.counter++;
    }

}