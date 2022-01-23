import {Injectable, OnInit} from '@angular/core';
import {ToDoEntry} from "../Model/ToDoEntry";
import {AddTodoComponent} from "../Components/add-todo/add-todo.component";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {HttpClient} from "@angular/common/http";
import {Location} from "@angular/common";

@Injectable({
  providedIn: 'root'
})
export class DataService {

  public modalPath: string = "/add";

  public todoList: ToDoEntry[] = [];

  public doneList: ToDoEntry[] = [];

  constructor(private modalService: NgbModal, private location: Location, private http: HttpClient) {
    if (location.path() === this.modalPath) this.addToDoButtonClicked();
    this.getList();
  }

  async getList(): Promise<void> {
    const res: any = await this.http.get('http://localhost:8080/todolist').toPromise();
    this.doneList = [];
    this.todoList = [];

    res.todoList.forEach((item: ToDoEntry, index: number) => {
      item.index = index;
      if (!item.done) this.todoList.push(item);
      else this.doneList.push(item)
    });
  }

  async done(index: number): Promise<void> {
    const res: any = await this.http.put('http://localhost:8080/done/' + this.todoList[index].index, []).toPromise();
    this.getList();
  }

  async delete(index: number): Promise<void> {
    const res: any = await this.http.delete('http://localhost:8080/entry/' + this.doneList[index].index).toPromise();
    this.getList();
  }

  async undone(index: number): Promise<void> {
    const res: any = await this.http.put('http://localhost:8080/undone/' + this.doneList[index].index, []).toPromise();
    this.getList();
  }

  async add(title: string): Promise<void> {
    const res: any = await this.http.post('http://localhost:8080/entry', {title: title}).toPromise();
    this.getList();
  }

  async addToDoButtonClicked(): Promise<void> {
    this.location.go(this.modalPath);
    const modalReference = this.modalService.open(AddTodoComponent);
    try {
      const result: string = await modalReference.result;
      this.add(result);
    } catch (e) {
      console.log(e);
      this.location.go("");
    }
  }
}
