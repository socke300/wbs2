import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ListComponent } from './list/list.component';
import { AddTodoComponent } from './add-todo/add-todo.component';
import {FormsModule} from "@angular/forms";
import { TodoItemComponent } from './todo-item/todo-item.component';
import { NewTodoButtonComponent } from './new-todo-button/new-todo-button.component';
import { ToDoPageComponent } from './to-do-page/to-do-page.component';
import {RouterModule, Routes} from "@angular/router";
import { DonePageComponent } from './done-page/done-page.component';
import {HttpClientModule} from "@angular/common/http";

const appRoutes: Routes = [
  {path: 'todo', component: ToDoPageComponent},
  {path: 'done', component: DonePageComponent},
  {path: 'addModal', component: ToDoPageComponent}
]

@NgModule({
  declarations: [
    AppComponent,
    ListComponent,
    AddTodoComponent,
    TodoItemComponent,
    NewTodoButtonComponent,
    ToDoPageComponent,
    DonePageComponent
  ],
    imports: [
        BrowserModule,
        NgbModule,
        FormsModule,
        HttpClientModule,
        RouterModule.forRoot(appRoutes)
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
