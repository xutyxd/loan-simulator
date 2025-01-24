import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';


@Component({
  selector: 'app-loan-simulator-configuration',
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './loan-simulator-configuration.component.html',
  styleUrl: './loan-simulator-configuration.component.scss'
})
export class LoanSimulatorConfigurationComponent {

    public loanForm = new FormGroup({
        amount: new FormControl(undefined, [Validators.required, Validators.min(0)]),
        rate: new FormControl(undefined, [Validators.required, Validators.min(0)]),
        term: new FormControl(undefined,  [Validators.required, Validators.min(0)]),
    });

    constructor(private router: Router) { }

    public simulate() {
        const loan = this.loanForm.value;

        console.log(loan);

        if (!this.loanForm.valid) {
            return;
        }

        this.router.navigate(['/simulate'], { queryParams: loan });
    }
}
