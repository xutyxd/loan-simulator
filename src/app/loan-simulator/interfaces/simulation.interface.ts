import { LoanSimulator } from "../classes/loan-simulator.class";

export interface ISimulation {
    title: string;
    data: ReturnType<LoanSimulator['simulate']>;
    color: [string, string];
}