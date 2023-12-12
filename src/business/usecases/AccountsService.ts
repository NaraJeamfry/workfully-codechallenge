import { AccountRepository } from "../interfaces/AccountRepository"
import { injected } from "brandi";
import { TOKENS } from "../../app/container.types";
import { AccountLimits, AccountStatus } from "../entities/Account"
import { AccountNotFoundError } from "../errors"
import { appConfig } from "../../config"
import { Deposit } from "../entities/Deposit"
import { Withdraw } from "../entities/Withdraw"
import { Transfer } from "../entities/Transfer"

export class AccountsService {
    constructor(private accountRepository: AccountRepository) {
        this.accountRepository = accountRepository
    }

    /**
     * Retrieve the current status for an account.
     *
     * @param accountId the account to fetch the status from
     * @throws AccountNotFoundError if the account cannot be found
     */
    async getAccountStatus(accountId: string): Promise<AccountStatus> {
        const account = await this.accountRepository.getAccount(accountId)
        if (account === null) {
            throw new AccountNotFoundError()
        } else {
            // TODO: Transform Account into AccountStatus


            const limits = new AccountLimits();
            limits.dailyDeposit = appConfig.dailyDepositLimit;
            limits.overdraft = appConfig.overdraftLimit;

            return new AccountStatus()
        }
    }

    /**
     * Deposit money into an account.
     *
     * @param accountId Account to deposit the money into
     * @param amount Amount to deposit
     * @throws AccountNotFoundError if the account cannot be found
     * @throws DepositLimitExceededError if the deposit limit is exceeded
     */
    async depositAccount(accountId: string, amount: number): Promise<Deposit> {
        // TODO: Implement Deposit account
        return new Deposit()
    }

    /**
     * Withdraws money from a given account.
     *
     * @param accountId Account to withdraw money from
     * @param amount Amount to withdraw
     * @throws AccountNotFoundError if the account cannot be found
     * @throws InsufficientBalanceError if the account does not have enough money
     */
    async withdrawAccount(accountId: string, amount: number): Promise<Withdraw> {
        // TODO: Implement Withdraw account
        return new Withdraw()
    }

    /**
     * Transfers a given amount of money from an account to another.
     *
     * @param fromAccount The account that sends the money
     * @param toAccount The account that receives the money
     * @param amount The amount of money to send
     * @throws AccountNotFoundError if either accounts cannot be found
     * @throws InsufficientBalanceError if fromAccount's balance is too low
     */
    async transferAccount(fromAccount: string, toAccount: string, amount: number): Promise<Transfer> {
        // TODO: Implement Transfer account
        return new Transfer()
    }

}

injected(AccountsService, TOKENS.accountRepository);