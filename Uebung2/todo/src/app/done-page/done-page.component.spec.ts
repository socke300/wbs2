import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DonePageComponent } from './done-page.component';

describe('DonePageComponent', () => {
  let component: DonePageComponent;
  let fixture: ComponentFixture<DonePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DonePageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DonePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
