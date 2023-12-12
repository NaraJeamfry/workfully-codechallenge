import {
    Account,
    AccountLimits,
    AccountStatus
} from "../../business/entities/Account"
import { AccountRepository } from "../../business/interfaces/AccountRepository"


export class AccountRepositoryMock implements AccountRepository {
    accounts: Map<string, Account> = new Map()

    addAccount(accountId: string, balance: number = 1000.0,
               depositedToday: number = 0.0, lastDepositDay: Date | null = null) {
        const account = new Account()
        account.accountId = accountId
        account.balance = balance
        account.depositedToday = depositedToday
        account.lastDepositDay = lastDepositDay ?? new Date()
    }

    removeAccount(accountId: string) {
        this.accounts.delete(accountId)
    }

    getAccount(accountId: string): Promise<Account> {
        if(this.accounts.has(accountId)) {
            return Promise.resolve(this.accounts.get(accountId)!)
        } else {
            throw new Error("The account was not found")
        }
    }

    saveAccount(account: Account): Promise<boolean> {
        return Promise.resolve(false)
    }
}