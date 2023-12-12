

export class AccountNotFoundError extends Error {
    constructor() {
        super("Account Not Found")

        Object.setPrototypeOf(this, AccountNotFoundError.prototype)
    }
}

export class InsufficientBalanceError extends Error {
    constructor() {
        super("Insufficient Balance")

        Object.setPrototypeOf(this, AccountNotFoundError.prototype)
    }
}

export class DepositLimitExceededError extends Error {
    constructor() {
        super("Deposit Limit Exceeded")

        Object.setPrototypeOf(this, AccountNotFoundError.prototype)
    }
}