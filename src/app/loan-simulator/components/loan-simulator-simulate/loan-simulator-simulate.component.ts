import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoanSimulator } from '../../classes/loan-simulator.class';

@Component({
  selector: 'app-loan-simulator-simulate',
  imports: [],
  templateUrl: './loan-simulator-simulate.component.html',
  styleUrl: './loan-simulator-simulate.component.scss'
})
export class LoanSimulatorSimulateComponent implements OnInit {

    private readonly route = inject(ActivatedRoute);

    public loan?: LoanSimulator;

    public ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.configure();
        });
    }

    public configure() {
        const params = this.route.snapshot.queryParams;
        console.log(params);
        const { amount, rate, term } = params;

        if (!amount || !rate || !term) {
            return;
        }

        this.loan = new LoanSimulator(parseFloat(amount), parseFloat(rate.replace(/,/g, '.')), parseFloat(term));
        console.log(this.loan);
    }
}
