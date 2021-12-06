export class ToDoEntry {
  public date: Date = new Date();
  public done: boolean = false;
  public index: number = 0;

  constructor(public title: string, date ?: Date) {
    if (date) this.date = date;
  }
}
