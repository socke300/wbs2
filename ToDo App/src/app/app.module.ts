import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppComponent} from './app.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {ListComponent} from './Components/list/list.component';
import {AddTodoComponent} from './Components/add-todo/add-todo.component';
import {FormsModule} from "@angular/forms";
import {TodoCardComponent} from './Components/todo-card/todo-card.component';
import {AddButtonComponent} from './Components/add-button/add-button.component';
import {DateFormatterPipe} from './Formatter/date-formatter.pipe';
import {RouterModule, Routes} from "@angular/router";
import {DoneListComponent} from './Sides/done-list/done-list.component';
import {TodoListComponent} from './Sides/todo-list/todo-list.component';
import {HttpClientModule} from "@angular/common/http";
import { TestComponent } from './Sides/test/test.component';

const appRoutes: Routes = [
  {path: 'doneList', component: DoneListComponent},
  {path: 'add', component: TodoListComponent},
  {path: 'test', component: TestComponent},
  {path: '', component: TodoListComponent}
];

@NgModule({
  declarations: [
    AppComponent,
    ListComponent,
    AddTodoComponent,
    TodoCardComponent,
    AddButtonComponent,
    DateFormatterPipe,
    DoneListComponent,
    TodoListComponent,
    TestComponent
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
export class AppModule {
}
