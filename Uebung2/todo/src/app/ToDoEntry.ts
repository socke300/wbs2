export class ToDoEntry {
  title: string;
  done: boolean;
  date: Date;
  index: number = 0;

  constructor(title: string) {
    this.title = title;
    this.date = new Date();
    this.done = false;
  }
}
