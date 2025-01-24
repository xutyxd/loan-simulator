import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanSimulatorLayoutComponent } from './loan-simulator-layout.component';

describe('LoanSimulatorLayoutComponent', () => {
  let component: LoanSimulatorLayoutComponent;
  let fixture: ComponentFixture<LoanSimulatorLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoanSimulatorLayoutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoanSimulatorLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
