import {__awaiter} from "tslib";
import {TestBed} from '@angular/core/testing';
import {EditUserModalComponent} from './edit-user-modal.component';

describe('EditUserModalComponent', () => {
  let component;
  let fixture;
  beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
    yield TestBed.configureTestingModule({
      declarations: [EditUserModalComponent]
    })
      .compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(EditUserModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
//# sourceMappingURL=edit-user-modal.component.spec.js.map
