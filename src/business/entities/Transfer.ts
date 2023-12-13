
export class Transfer {
    constructor (obj: {
        fromAccount: string,
        toAccount: string,
        amount: number,
        balance: number
    }) {
        this.fromAccount = obj.fromAccount
        this.toAccount = obj.toAccount
        this.amount = obj.amount
        this.balance = obj.balance
    }

    fromAccount: string
    toAccount: string
    amount: number

    // New balance after the transfer for the fromAccount
    balance: number
}