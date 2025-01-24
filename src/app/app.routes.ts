import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: '', loadChildren: () => import('./loan-simulator/loan-simulator.routes').then(r => r.LOAN_SIMULATOR_ROUTES) }
];
