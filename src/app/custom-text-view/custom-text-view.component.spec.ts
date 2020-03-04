import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomTextViewComponent } from './custom-text-view.component';

describe('CustomTextViewComponent', () => {
  let component: CustomTextViewComponent;
  let fixture: ComponentFixture<CustomTextViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomTextViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomTextViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
