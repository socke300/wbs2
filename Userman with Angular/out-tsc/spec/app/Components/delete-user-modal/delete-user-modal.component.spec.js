import {__awaiter} from "tslib";
import {TestBed} from '@angular/core/testing';
import {DeleteUserModalComponent} from './delete-user-modal.component';

describe('DeleteUserModalComponent', () => {
  let component;
  let fixture;
  beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
    yield TestBed.configureTestingModule({
      declarations: [DeleteUserModalComponent]
    })
      .compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteUserModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
//# sourceMappingURL=delete-user-modal.component.spec.js.map
