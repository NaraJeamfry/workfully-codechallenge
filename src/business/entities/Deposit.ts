
export class Deposit {
    constructor (obj: {
        accountId: string,
        amount: number,
        balance: number
    }) {
        this.accountId = obj.accountId
        this.amount = obj.amount
        this.balance = obj.balance
    }

    accountId: string
    amount: number
    // Balance of the account after the deposit
    balance: number
}
