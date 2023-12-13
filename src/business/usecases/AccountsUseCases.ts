import { injected } from "brandi"
import { TOKENS } from "../../app/container.types"
import { appConfig } from "../../config"
import { AccountLimits, AccountStatus } from "../entities/Account"
import { Deposit } from "../entities/Deposit"
import { Withdraw } from "../entities/Withdraw"
import { Transfer } from "../entities/Transfer"
import { AccountsService } from "../interfaces/AccountsService"
import { AccountRepository } from "../interfaces/AccountRepository"
import {
    AccountNotFoundError,
    DepositLimitExceededError,
    InsufficientBalanceError
} from "../errors"

export class AccountsUseCases implements AccountsService {
    constructor(private accountRepository: AccountRepository) {
        this.accountRepository = accountRepository
    }

    async accountStatus(accountId: string): Promise<AccountStatus> {
        const account = await this.accountRepository.getAccount(accountId)
        if (account === null) {
            throw new AccountNotFoundError()
        }

        const status = new AccountStatus(account)

        const limits = new AccountLimits()
        limits.dailyDeposit = appConfig.dailyDepositLimit
        limits.overdraft = appConfig.overdraftLimit
        status.limits = limits

        return status
    }

    async depositAccount(accountId: string, amount: number): Promise<Deposit> {
        const account = await this.accountRepository.getAccount(accountId)

        if (account === null) {
            throw new AccountNotFoundError()
        }

        const currentDepositLimit = account.getDepositedToday(new Date(new Date().setUTCHours(0, 0, 0, 0)))

        if (currentDepositLimit + amount > appConfig.dailyDepositLimit) {
            throw new DepositLimitExceededError()
        }

        account.depositMoney(amount)
        await this.accountRepository.saveAccount(account)

        return new Deposit({
            accountId: account.accountId,
            amount: amount,
            balance: account.balance
        })
    }

    async withdrawAccount(accountId: string, amount: number): Promise<Withdraw> {
        const account = await this.accountRepository.getAccount(accountId)

        if  (account === null) {
            throw new AccountNotFoundError()
        }

        if (account.balance + appConfig.overdraftLimit < amount) {
            throw new InsufficientBalanceError()
        }

        account.withdrawMoney(amount)
        await this.accountRepository.saveAccount(account)

        return new Withdraw({
            accountId: account.accountId,
            amount: amount,
            balance: account.balance
        })
    }

    async transferAccount(fromAccount: string, toAccount: string, amount: number): Promise<Transfer> {
        const from = await this.accountRepository.getAccount(fromAccount)
        const to = await this.accountRepository.getAccount(toAccount)

        if (from === null || to === null) {
            throw new AccountNotFoundError()
        }

        if (from.balance < amount) {
            throw new InsufficientBalanceError()
        }

        from.balance -= amount
        to.balance += amount

        await Promise.all([
            this.accountRepository.saveAccount(from),
            this.accountRepository.saveAccount(to)
        ])

        return new Transfer({
            fromAccount: from.accountId,
            toAccount: to.accountId,
            amount: amount,
            balance: from.balance
        })
    }

}

injected(AccountsUseCases, TOKENS.accountRepository)