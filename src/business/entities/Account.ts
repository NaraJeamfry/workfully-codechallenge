export class Account {
    constructor(accountId: string, obj: {
        balance?: number, lastDepositDay?: Date,
        depositedToday?: number
    } = {}) {
        this.accountId = accountId
        this.balance = obj.balance ?? 0
        this.depositedToday = obj.depositedToday ?? 0
        this.lastDepositDay = obj.lastDepositDay ?? null
    }

    accountId: string
    balance: number
    lastDepositDay: Date | null
    depositedToday: number

    getDepositedToday(specificDate: Date | null = null): number {
        if (specificDate === null) {
            specificDate = new Date()
        } else {
            specificDate = new Date(specificDate.getTime())
        }

        // Reset date to 00:00:00:00 to compare days
        specificDate.setUTCHours(0, 0, 0, 0)
        this.lastDepositDay?.setUTCHours(0, 0, 0, 0)

        if (this.lastDepositDay === null || this.lastDepositDay < specificDate) {
            return 0
        } else {
            return this.depositedToday
        }
    }

    depositMoney(amount: number): Account {
        this.balance += amount
        this.depositedToday += amount

        this.lastDepositDay = new Date(new Date().setUTCHours(0, 0, 0, 0))

        return this
    }

    withdrawMoney(amount: number): Account {
        this.balance -= amount

        return this
    }
}

export class AccountLimits {
    dailyDeposit: number
    overdraft: number
}

export class AccountStatus {
    constructor(account: Account) {
        this.accountId = account.accountId
        this.balance = account.balance

        if (account.lastDepositDay)
            this.depositedToday = account.depositedToday
    }

    accountId: string
    balance: number
    depositedToday: number
    limits: AccountLimits
}