import {Injectable, Input, OnChanges, OnInit} from '@angular/core';
import {ToDoEntry} from "./ToDoEntry";
import {AddTodoComponent} from "./add-todo/add-todo.component";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {HttpClient} from "@angular/common/http";
import {Location} from "@angular/common";

@Injectable({
  providedIn: 'root'
})
export class DataService {

  public modalPath = '/addModal';

  public doneList: ToDoEntry[] = [];

  public todoList: ToDoEntry[] = [];

  constructor(private modalService: NgbModal, private http: HttpClient, private location: Location) {
    if(this.location.path() === this.modalPath) this.add();
    this.getList();
  }

  async getList(): Promise<void> {
    const res: any = await this.http.get('http://localhost:8080/todolist').toPromise();
    this.doneList = [];
    this.todoList = [];
    res.todoList.forEach((item: ToDoEntry, index: number) => {
      item.index = index;
      if (!item.done) this.todoList.push(item);
      else this.doneList.push(item);
    });
  }

  public done(index: number): void {
    this.http.put('http://localhost:8080/done/' + this.todoList[index].index, {}).toPromise().then((res: any) => {
      console.log(res);
    });
    this.getList();
  }

  /*public done(index: number): void {
    this.todoList[index].done = true;
    this.doneList.push(this.todoList[index]);
    this.todoList.splice(index, 1);
  }*/

  public undone(index: number){
    this.http.put('http://localhost:8080/undone/' + this.doneList[index].index, {}).toPromise().then((res: any) => {
      console.log(res);
    });
    this.getList();
  }

  /*public undone(index: number): void {
    this.doneList[index].done = false;
    this.todoList.push(this.doneList[index]);
    this.doneList.splice(index, 1);
  }*/

  public delete(index: number): void{
    this.http.delete('http://localhost:8080/entry/' + this.doneList[index].index).toPromise()
      .then((res: any) => {
        console.log(res);
      });
    this.getList();
  }
  /*public delete(index: number):void {
    this.doneList.splice(index, 1);
  }*/

  async add(): Promise<void> {
    try {
      this.location.go(this.modalPath);
      const title = await this.modalService.open(AddTodoComponent).result;
      this.http.post('http://localhost:8080/entry', {
        title: title
      }).toPromise().then((res: any) => {
        console.log(res);
      });
      this.getList();
    } catch(error){
      console.log('Window closed' + error);
      this.location.go('todo');
    }
  }
  /*async add(): Promise<void> {
    try {
      const modal = this.modalService.open(AddTodoComponent);
      const title = await modal.result;
      this.todoList.push(new ToDoEntry(title));
    } catch(error){
      console.log('Window closed' + error);
    }
  }*/
}
