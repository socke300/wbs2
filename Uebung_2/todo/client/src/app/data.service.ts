import { Injectable } from '@angular/core';
import {ToDoEntry} from "./ToDoEntry";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {AddTodoComponent} from "./add-todo/add-todo.component";
import {HttpClient} from "@angular/common/http";
import {firstValueFrom} from "rxjs";
import {Location} from "@angular/common";

@Injectable({
  providedIn: 'root'
})
export class DataService {

  public todoList: ToDoEntry[] = [];
  public doneList: ToDoEntry[] = [];
  public undoneList: ToDoEntry[] = [];

  constructor(private modalService: NgbModal, private httpClient: HttpClient, private location: Location) {
    this.getItems();
  }

  async addToDoButtonClicked(){
    const modalReference = this.modalService.open(AddTodoComponent);
    modalReference.result.then((res: any) =>{
      firstValueFrom(this.httpClient.post('http://localhost:8080/entry', new ToDoEntry(res))).then((res)=> {
        this.getItems()
        this.location.go('');
      });
    }).catch((error) => {
      console.log('Window closed: ' + error);
      this.location.go('');
    })
  }

  getItems(){
    firstValueFrom(this.httpClient.get('http://localhost:8080/todolist')).then((res: any) => {
      this.todoList = res.todoList;
      this.doneList = this.todoList.filter((value) => value.done);
      this.undoneList = this.todoList.filter((value) => !value.done);
    })
  }

  done(item: ToDoEntry, index: number){
    if (!item.done) {
      firstValueFrom(this.httpClient.put('http://localhost:8080/done/' + index, item)).then((res)=> {
        this.getItems()
      });
    } else {
      firstValueFrom(this.httpClient.put('http://localhost:8080/undone/'+ index, item)).then((res)=> {
        this.getItems()
      });
    }
  }

  delete(item: ToDoEntry, index: number){
    if(confirm('Are you sure you want to delete ' + item.title + '?')) {
      firstValueFrom(this.httpClient.delete('http://localhost:8080/entry/' + index)).then((res)=> {
        this.getItems()
      });
    }
  }
}
