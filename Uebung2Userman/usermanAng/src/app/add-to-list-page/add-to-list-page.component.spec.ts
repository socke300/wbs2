import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddToListPageComponent } from './add-to-list-page.component';

describe('AddToListPageComponent', () => {
  let component: AddToListPageComponent;
  let fixture: ComponentFixture<AddToListPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddToListPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddToListPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
