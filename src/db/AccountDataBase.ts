import { AccountRepository } from "../business/interfaces/AccountRepository";
import { AccountLimits, AccountStatus } from "../business/entities/Account";
import { appConfig } from "../config";
import { randomUUID } from "node:crypto";

export class AccountDataBase implements AccountRepository {
    constructor() {
        console.log(`Repository: Initializing the Account DB Repository...`)

        console.log(`Repository: Connected successfully to DB, ready to send queries.`)
    }

    getAccount(accountId: string): Promise<AccountStatus> {
        const account = new AccountStatus();
        account.accountId = randomUUID();
        account.balance = 1000.0;
        account.depositedToday = 0;
        account.limits = new AccountLimits();
        account.limits.dailyDeposit = appConfig.dailyDepositLimit;
        account.limits.overdraft = appConfig.overdraftLimit;
        return Promise.resolve(account);
    }

}