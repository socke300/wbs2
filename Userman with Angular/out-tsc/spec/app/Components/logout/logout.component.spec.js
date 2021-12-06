import {__awaiter} from "tslib";
import {TestBed} from '@angular/core/testing';
import {LogoutComponent} from './logout.component';

describe('LogoutComponent', () => {
  let component;
  let fixture;
  beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
    yield TestBed.configureTestingModule({
      declarations: [LogoutComponent]
    })
      .compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(LogoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
//# sourceMappingURL=logout.component.spec.js.map
