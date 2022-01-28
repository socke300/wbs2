export class Post {
  dId?: string;
  text: string;
  userId: string;
  email: string;
  time: string;

  constructor(text: string, userId: string, email: string, time: string) {
    this.text = text;
    this.userId = userId;
    this.time = time;
    this.email = email;
  }
}
