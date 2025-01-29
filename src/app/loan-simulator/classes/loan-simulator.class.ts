
export class LoanSimulator {

    private amount: number;
    private rate: number;
    private months: number;

    constructor(amount: number, rate: number, months: number) {
        this.amount = amount;
        this.rate = rate / 100;
        this.months = months;
    }

    public payment(): number {
        const payments = this.months;
        const rate = this.rate / 12;
        return (this.amount * rate * Math.pow(1 + rate, payments)) / (Math.pow(1 + rate, payments) - 1);
    }

    public simulate(amortizations: { when: number, amount: number }[] = []) {
        let remaining = this.amount;
        let months = 0;
        let interestAccumulated = 0;

        const pays: { remaining: number, interest: { current: number, accumulated: number }, payment: number, amortized: number }[] = [];
        const rate = this.rate / 12;
        const payment = this.payment();
        // Loop while there is still principal to pay
        while (remaining > 0) {
            let payed = payment;
            // Calculate interest and principal portion of the payment
            const interest = remaining * rate;
            // Increment interest accumulated
            interestAccumulated += interest;
            // Calculate principal portion of the payment
            const principal = payment - interest;
            // Update remaining principal
            remaining -= principal;
            // If remaining is negative, discount from the payment
            if (remaining < 0) {
                payed -= Math.abs(remaining);
                remaining = 0;
            }
            let amortized = 0;
            // If there is still remaining, find if there is amortization to apply
            if (remaining > 0) {
                // Find if there is amortization to apply
                const amortization = amortizations.find(a => a.when === months);
                // If there is, apply it
                if (amortization) {
                    if (remaining < amortization.amount) {
                    }
                    remaining -= amortization.amount;
                }
                // Get amortization amount
                amortized = amortization ? amortization.amount : 0;
                // If remaining is negative, amortize the remaining amount
                if (remaining < 0) {
                    amortized -= Math.abs(remaining);
                    // Avoid negative remaining
                    remaining = 0;
                }
            }
            // Generate a new payment
            const pay = {
                remaining: Number(remaining),
                payment: Number(payed),
                interest: {
                    current:Number(interest),
                    accumulated: Number(interestAccumulated),
                },
                amortized: Number(amortized),
            };

            pays.push(pay);
            // Increment month counter
            months += 1;
            // Safety checks to avoid infinite loops
            const timeEnded = months > this.months;
            const paidAll = remaining <= 0;
            
            if (timeEnded || paidAll) {
                break;
            }
        }

        return pays;
    }

}