import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FarmCallComponent } from './farm-call.component';

describe('FarmCallComponent', () => {
  let component: FarmCallComponent;
  let fixture: ComponentFixture<FarmCallComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FarmCallComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FarmCallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
