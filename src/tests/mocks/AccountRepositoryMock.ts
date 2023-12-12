import {
    Account,
    AccountLimits,
    AccountStatus
} from "../../business/entities/Account"
import { AccountRepository } from "../../business/interfaces/AccountRepository"


export class AccountRepositoryMock implements AccountRepository {
    accounts: Map<string, AccountStatus> = new Map()

    addAccount(accountId: string, balance: number = 1000.0,
               depositedToday: number = 0.0) {
        const account = new AccountStatus()
        account.accountId = accountId
        account.balance = balance
        account.depositedToday = depositedToday
        account.limits = new AccountLimits()
        account.limits.dailyDeposit = 5000.0
        account.limits.overdraft = 200.0
        this.accounts.set(account.accountId, account)
    }

    removeAccount(accountId: string) {
        this.accounts.delete(accountId)
    }

    getAccount(accountId: string): Promise<AccountStatus> {
        if(this.accounts.has(accountId)) {
            return Promise.resolve(this.accounts.get(accountId)!)
        } else {
            throw new Error("The account was not found")
        }
    }
}