import { injected } from "brandi"
import { TOKENS } from "../../app/container.types"
import { appConfig } from "../../config"
import { AccountLimits, AccountStatus } from "../entities/Account"
import { Deposit } from "../entities/Deposit"
import { Withdraw } from "../entities/Withdraw"
import { Transfer } from "../entities/Transfer"
import { AccountsService } from "../interfaces/AccountsService"
import { AccountRepository } from "../interfaces/AccountRepository"
import { AccountNotFoundError } from "../errors"

export class AccountsUseCases implements AccountsService {
    constructor(private accountRepository: AccountRepository) {
        this.accountRepository = accountRepository
    }

    async getAccountStatus(accountId: string): Promise<AccountStatus> {
        const account = await this.accountRepository.getAccount(accountId)
        if (account === null) {
            throw new AccountNotFoundError()
        } else {
            // TODO: Transform Account into AccountStatus

            const limits = new AccountLimits()
            limits.dailyDeposit = appConfig.dailyDepositLimit
            limits.overdraft = appConfig.overdraftLimit

            return new AccountStatus()
        }
    }

    async depositAccount(accountId: string, amount: number): Promise<Deposit> {
        // TODO: Implement Deposit account
        return new Deposit()
    }

    async withdrawAccount(accountId: string, amount: number): Promise<Withdraw> {
        // TODO: Implement Withdraw account
        return new Withdraw()
    }

    async transferAccount(fromAccount: string, toAccount: string, amount: number): Promise<Transfer> {
        // TODO: Implement Transfer account
        return new Transfer()
    }

}

injected(AccountsUseCases, TOKENS.accountRepository)