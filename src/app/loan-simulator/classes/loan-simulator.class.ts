
export class LoanSimulator {

    private amount: number;
    private rate: number;
    private years: number;

    constructor(amount: number, rate: number, years: number) {
        this.amount = amount;
        this.rate = rate / 100;
        this.years = years;
    }

    public payment(): number {
        const payments = this.years * 12;
        const rate = this.rate / 12;
        return (this.amount * rate * Math.pow(1 + rate, payments)) / (Math.pow(1 + rate, payments) - 1);
    }

    public simulate(amortizations: { when: number, amount: number }[] = []) {
        let remaining = this.amount;
        let months = 0;

        const pays: { remaining: number, interest: number }[] = [];
        const rate = this.rate / 12;
        const payment = this.payment();
        // Loop while there is still principal to pay
        while (remaining > 0) {
            // Increment month counter
            months += 1;
            // Calculate interest and principal portion of the payment
            const interest = remaining * rate;
            // Calculate principal portion of the payment
            const principal = payment - interest;
            // Update remaining principal
            remaining -= principal;
            // Find if there is amortization to apply
            const amortization = amortizations.find(a => a.when === months);
            // If there is, apply it
            if (amortization) {
                remaining -= amortization.amount;
            }
            // Generate a new payment
            const pay = {
                remaining,
                interest,
                amortized: amortization ? amortization.amount : 0,
            };

            pays.push(pay);
            // Safety checks to avoid infinite loops
            const timeEnded = months > this.years * 12;
            const paidAll = remaining <= 0;
            
            if (timeEnded || paidAll) {
                break;
            }
        }

        return pays;
    }

}