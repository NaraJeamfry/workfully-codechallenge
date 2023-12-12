
export class Account {
    accountId: string
    balance: number
    lastDepositDay: Date
    depositedToday: number
}

export class AccountLimits {
    dailyDeposit: number
    overdraft: number
}

export class AccountStatus {
    accountId: string
    balance: number
    depositedToday: number
    limits: AccountLimits
}