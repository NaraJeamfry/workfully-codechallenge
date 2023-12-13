import { ApiError } from "./generic"

export class AccountNotFoundApiError extends ApiError {
    constructor() {
        super("The given account ID was not found.")

        this.errorCode = "accountNotFound"
        this.statusCode = 400

        Object.setPrototypeOf(this, AccountNotFoundApiError.prototype)
    }
}

export class InsufficientBalanceApiError extends ApiError {
    constructor() {
        super("The account's balance is too low for the withdrawal.")

        this.errorCode = "insufficientBalance"
        this.statusCode = 400

        Object.setPrototypeOf(this, InsufficientBalanceApiError.prototype)
    }
}

export class DepositLimitExceededApiError extends ApiError {
    constructor() {
        super("You have exceeded the daily deposit limit.")

        this.errorCode = "depositLimitExceeded"
        this.statusCode = 400

        Object.setPrototypeOf(this, DepositLimitExceededApiError.prototype)
    }
}