import { Account } from "../../business/entities/Account"
import { AccountRepository } from "../../business/interfaces/AccountRepository"
import { AccountNotFoundError } from "../../business/errors"


export class AccountRepositoryMock implements AccountRepository {
    accounts: Map<string, Account> = new Map()

    async addAccount(accountId: string, balance: number = 1000.0,
                     depositedToday: number = 0.0, lastDepositDay: Date | null = null) {
        const account = new Account(accountId, {
            balance,
            depositedToday,
            lastDepositDay: lastDepositDay ?? new Date()
        })
        await this.saveAccount(account)
    }

    removeAccount(accountId: string) {
        this.accounts.delete(accountId)
    }

    async getAccount(accountId: string): Promise<Account | null> {
        if (this.accounts.has(accountId)) {
            return Promise.resolve(this.accounts.get(accountId)!)
        } else {
            return null
        }
    }

    async saveAccount(account: Account): Promise<boolean> {
        this.accounts.set(account.accountId, account)
        return Promise.resolve(true)
    }
}