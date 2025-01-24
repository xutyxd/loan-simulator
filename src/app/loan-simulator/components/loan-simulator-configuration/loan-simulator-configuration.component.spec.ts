import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanSimulatorConfigurationComponent } from './loan-simulator-configuration.component';

describe('LoanSimulatorConfigurationComponent', () => {
  let component: LoanSimulatorConfigurationComponent;
  let fixture: ComponentFixture<LoanSimulatorConfigurationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoanSimulatorConfigurationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoanSimulatorConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
