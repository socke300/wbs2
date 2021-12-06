import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewTodoButtonComponent } from './new-todo-button.component';

describe('NewTodoButtonComponent', () => {
  let component: NewTodoButtonComponent;
  let fixture: ComponentFixture<NewTodoButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewTodoButtonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewTodoButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
