import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {FormsModule} from "@angular/forms";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ListComponent } from './list/list.component';
import { AddTodoComponent } from './add-todo/add-todo.component';
import { TodoItemComponent } from './todo-item/todo-item.component';
import {HttpClientModule} from "@angular/common/http";
import { DoneListComponent } from './done-list/done-list.component';

@NgModule({
  declarations: [
    AppComponent,
    ListComponent,
    AddTodoComponent,
    TodoItemComponent,
    DoneListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    NgbModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
