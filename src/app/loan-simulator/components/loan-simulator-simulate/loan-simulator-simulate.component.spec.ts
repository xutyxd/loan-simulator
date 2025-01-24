import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanSimulatorSimulateComponent } from './loan-simulator-simulate.component';

describe('LoanSimulatorSimulateComponent', () => {
  let component: LoanSimulatorSimulateComponent;
  let fixture: ComponentFixture<LoanSimulatorSimulateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoanSimulatorSimulateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoanSimulatorSimulateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
