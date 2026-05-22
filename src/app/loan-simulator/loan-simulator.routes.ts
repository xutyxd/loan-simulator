import { Routes } from '@angular/router';

import { LoanSimulatorLayoutComponent } from './components/loan-simulator-layout/loan-simulator-layout.component';
import { LoanSimulatorConfigurationComponent } from './components/loan-simulator-configuration/loan-simulator-configuration.component';
import { LoanSimulatorSimulateComponent } from './components/loan-simulator-simulate/loan-simulator-simulate.component';

export const LOAN_SIMULATOR_ROUTES: Routes = [
    {
        path: '',
        component: LoanSimulatorLayoutComponent,
        children: [
            {
                path: '',
                loadComponent: () => LoanSimulatorConfigurationComponent,
            },
            {
                path: 'simulate',
                loadComponent: () => LoanSimulatorSimulateComponent,
            },
            { path: '**', redirectTo: '' }
        ],
    }
];