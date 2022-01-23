import {__awaiter} from "tslib";
import {TestBed} from '@angular/core/testing';
import {NotificationComponent} from './notification.component';

describe('NotificationComponent', () => {
  let component;
  let fixture;
  beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
    yield TestBed.configureTestingModule({
      declarations: [NotificationComponent]
    })
      .compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
//# sourceMappingURL=notification.component.spec.js.map
