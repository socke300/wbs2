export class User {
    public id: number;
    public firstName: string;
    public lastName: string;
    public description: string;
    public creationTime: Date;

    constructor(id: number, firstName: string, lastName: string, description: string, creationTime: Date) {
        this.id= id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.description = description;
        this.creationTime = creationTime;
    }
}