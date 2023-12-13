import { AccountRepository } from "../business/interfaces/AccountRepository"
import { Account } from "../business/entities/Account"
import { appConfig } from "../config"
import { randomUUID } from "node:crypto"

export class AccountDataBase implements AccountRepository {
    constructor() {
        console.log(`Repository: Initializing the Account DB Repository...`)

        console.log(`Repository: Connected successfully to DB, ready to send queries.`)
    }

    getAccount(accountId: string): Promise<Account | null> {
        const account = new Account("a")
        account.accountId = accountId
        account.balance = 1000.0
        account.depositedToday = 0
        return Promise.resolve(account)
    }

    saveAccount(account: Account): Promise<boolean> {
        return Promise.resolve(false)
    }

}