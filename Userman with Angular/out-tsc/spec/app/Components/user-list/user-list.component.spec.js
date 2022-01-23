import {__awaiter} from "tslib";
import {TestBed} from '@angular/core/testing';
import {UserListComponent} from './user-list.component';

describe('UserListComponent', () => {
  let component;
  let fixture;
  beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
    yield TestBed.configureTestingModule({
      declarations: [UserListComponent]
    })
      .compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(UserListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
//# sourceMappingURL=user-list.component.spec.js.map
