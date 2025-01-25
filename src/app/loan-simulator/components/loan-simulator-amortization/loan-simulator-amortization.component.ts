import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { IAmortization } from '../../interfaces/amortization.interface';
import { MatDialogRef } from '@angular/material/dialog';
@Component({
  selector: 'app-loan-simulator-amortization',
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatSlideToggleModule,
  ],
  templateUrl: './loan-simulator-amortization.component.html',
  styleUrl: './loan-simulator-amortization.component.scss'
})
export class LoanSimulatorAmortizationComponent {

    private readonly dialogRef = inject(MatDialogRef<LoanSimulatorAmortizationComponent>);

    @Output() amortization = new EventEmitter<IAmortization>();
    
    public recursive = false;

    public amortizationForm = new FormGroup({
        amount: new FormControl<number | null>(null, [ Validators.required, Validators.min(0) ]),
        when: new FormControl<number | null>(null, [ Validators.required, Validators.min(0) ]),
        recursive: new FormControl<boolean>(this.recursive, [ Validators.required ]),
    });

    constructor() {
        this.amortizationForm.valueChanges.subscribe(value => {
            const { recursive } = value;
            this.recursive = !!recursive;
        });
    }

    public add() {
        if (this.amortizationForm.invalid) {
            return;
        }

        const { amount, when, recursive } = this.amortizationForm.value;

        this.amortizationForm.reset();
        const amortization = { amount: Number(amount), when: Number(when) - (recursive ? 0 : 1), recursive: !!recursive };
        this.amortization.emit(amortization);
        this.dialogRef.close(amortization);
    }
}
