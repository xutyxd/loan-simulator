import { Routes } from '@angular/router';
import { LoanSimulatorLayoutComponent } from './components/loan-simulator-layout/loan-simulator-layout.component';
import { LoanSimulatorConfigurationComponent } from './components/loan-simulator-configuration/loan-simulator-configuration.component';
import { LoanSimulatorAmortizationComponent } from './components/loan-simulator-amortization/loan-simulator-amortization.component';
import { LoanSimulatorSimulateComponent } from './components/loan-simulator-simulate/loan-simulator-simulate.component';

export const LOAN_SIMULATOR_ROUTES: Routes = [
    {
        path: '',
        component: LoanSimulatorLayoutComponent,
        children: [
            { path: '', component: LoanSimulatorConfigurationComponent },
            { path: 'simulate', component: LoanSimulatorSimulateComponent },
            { path: '**', redirectTo: '' }
        ]
    }
];