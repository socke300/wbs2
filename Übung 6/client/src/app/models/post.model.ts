export class Post{
  public id?: string;
  public text: string;
  public user: any;
  public time?: Date;

  constructor(text: string, id?: string) {
    this.text = text;
    this.id = id;
  }
}
