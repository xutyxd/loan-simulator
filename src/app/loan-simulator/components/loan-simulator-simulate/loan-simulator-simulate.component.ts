import { AfterViewInit, Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

import * as echarts from 'echarts';

import { LoanSimulator } from '../../classes/loan-simulator.class';

import { MatDialog } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';

import { LoanSimulatorAmortizationComponent } from "../loan-simulator-amortization/loan-simulator-amortization.component";
import { IAmortization } from '../../interfaces/amortization.interface';
import { ISimulation } from '../../interfaces/simulation.interface';
import { fromEvent } from 'rxjs';

@Component({
  selector: 'app-loan-simulator-simulate',
  imports: [
    MatCardModule,
    MatListModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    DecimalPipe,
],
  templateUrl: './loan-simulator-simulate.component.html',
  styleUrl: './loan-simulator-simulate.component.scss'
})
export class LoanSimulatorSimulateComponent implements OnInit, AfterViewInit {

    private readonly route = inject(ActivatedRoute);
    private readonly matDialog = inject(MatDialog);

    @ViewChild('graph') graph?: ElementRef<HTMLDivElement>;

    private chart?: echarts.ECharts;
    private loan?: LoanSimulator;
    public amortizations: IAmortization[] = [];

    public configuration = {
        amount: 0,
        rate: 0,
        term: 0,
    }

    public information = {
        total: 0,
        interest: 0,
        monthly: 0,
    };

    public amortization = {
        amount: {
            value: 0,
            percent: 0
        },
        interest: {
            value: 0,
            percent: 0
        },
        term: {
            value: 0,
            percent: 0
        }
    }

    public ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.configure();
        });

        fromEvent(window, 'resize').subscribe(() => {
            if (this.chart) {
                this.chart.resize();
            }
        });
    }

    public configure() {
        const params = this.route.snapshot.queryParams;

        const { amount, rate, term } = params;

        if (!amount || !rate || !term) {
            return;
        }
        // Load configuration from route
        this.configuration = { amount, rate, term };

        this.loan = new LoanSimulator(parseFloat(amount), parseFloat(rate.replace(/,/g, '.')), parseFloat(term));
        const simulation = this.loan.simulate();
        const interest = simulation.map(s => s.interest.current).reduce((a, b) => a + b, 0);
        // Set basic information about the loan configured
        this.information.total = simulation.map(pay => pay.payment).reduce((a, b) => a + b, 0);
        this.information.interest = interest;
        this.information.monthly = this.loan.payment();
    }

    ngAfterViewInit(): void {
        if (!this.graph || !this.loan) {
            return;
        }
        // Create the graph
        const graph = this.graph.nativeElement;
        const chart = this.chart = echarts.init(graph);
        this.display(chart, this.loan);
    }

    private getSeries(simulations: ISimulation[]) {
        // Create series with remaining and interest for each simulation
        return simulations.map((simulation) => {
            const { title, data, color } = simulation;

            const remaining = data.map(s => s.remaining);
            const interest = data.map(s => s.interest.accumulated);

            return [
                {
                    name: `${title} remaining`,
                    type: 'line',
                    data: remaining,
                    smooth: true,
                    lineStyle: {
                        color: color[0]
                    },
                    itemStyle: {
                        color: color[0]
                    }
                },
                {
                    name: `${title} interest`,
                    type: 'line',
                    data: interest,
                    smooth: true,
                    lineStyle: {
                        color: color[1]
                    },
                    itemStyle: {
                        color: color[1]
                    }
                }
            ];
        }).flat(1);
    }

    private percent(value: number, total: number) {
        return 100 - (value / total) * 100;
    }

    public display(chart: echarts.ECharts, loan: LoanSimulator): void {
        const simulation = loan.simulate();
        const series = this.getSeries([{ title: 'Base', data: simulation, color: ['blue', 'orange'] }]);

        chart.setOption({
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross'
                }
            },
            legend: {
                data: series.map(s => s.name)
            },
            toolbox: {
                feature: {
                    saveAsImage: {}
                }
            },
            grid: {
                left: '15px',   // Space from the left edge
                right: '15px',  // Space from the right edge
                top: '15px',   // Space from the top edge (adjust if you have a title or legend)
                bottom: '15px', // Space from the bottom edge
                containLabel: true
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: new Array(simulation.length).fill(0).map((_, i) => i)
            },
            yAxis: {
                type: 'value'
            },
            series
        });
    }

    public addAmortization() {
        const dialogRef = this.matDialog.open(LoanSimulatorAmortizationComponent, {
            // width: '500px',
            // data: this.amortization
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (!result) {
                return;
            }
            const amortization = result as IAmortization;
            this.amortize(amortization);
        });
    }

    public removeAmortization(amortization: IAmortization) {
        // Remove amortization
        this.amortizations = this.amortizations.filter(a => a !== amortization);
        // Simulate again
        this.amortize();
    }

    public amortize(amortization?: IAmortization) {
        if (!this.loan) {
            return;
        }
        // Get base simulation
        const base = this.loan.simulate();
        // Check if amortization is defined
        if (amortization) {
            // Add amortization
            this.amortizations.push(amortization);
        }
        // Mix all amortizations
        const amortizations = new Array(base.length).fill(0).map((_, i) => {
            // Find amortizations that apply for that moment
            const apply = this.amortizations.filter((amortization) => {
                const { when, recursive } = amortization;
                return recursive ? i % when === 0 : when === i;
            });
            // Return mixed amortization
            const amount = apply.reduce((a, b) => a + b.amount, 0);
            return { when: i, amount };
        });
        // Generate simulation with mixed amortizations
        const simulation = this.loan.simulate(amortizations);
        // Update amortization information
        // Get total amount paid
        this.amortization.amount.value = simulation.reduce((a, b) => a + b.payment + b.amortized, 0);
        this.amortization.amount.percent = this.percent(this.amortization.amount.value, this.information.total);
        // Get total interest paid
        this.amortization.interest.value = simulation.reduce((a, b) => a + b.interest.current, 0);
        this.amortization.interest.percent = this.percent(this.amortization.interest.value, this.information.interest);
        // Get loan term
        this.amortization.term.value = simulation.length;
        this.amortization.term.percent = this.percent(this.amortization.term.value, this.configuration.term);

        if (!this.chart) {
            return;
        }

        const series = this.getSeries([
            { title: 'Base', data: base, color: ['blue', 'orange'] },
            { title: 'Amortization', data: simulation, color: ['green', 'red'] }
        ]);

        const labels = series.map(s => s.name);

        this.chart.setOption({
            legend: {
                data: labels
            },
            series
        });
    }
}
