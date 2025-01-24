import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanSimulatorAmortizationComponent } from './loan-simulator-amortization.component';

describe('LoanSimulatorAmortizationComponent', () => {
  let component: LoanSimulatorAmortizationComponent;
  let fixture: ComponentFixture<LoanSimulatorAmortizationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoanSimulatorAmortizationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoanSimulatorAmortizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
