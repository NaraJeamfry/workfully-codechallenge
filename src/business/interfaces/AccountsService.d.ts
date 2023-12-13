import { AccountStatus } from "../entities/Account"
import { Deposit } from "../entities/Deposit"
import { Withdraw } from "../entities/Withdraw"
import { Transfer } from "../entities/Transfer"


export interface AccountsService {

    /**
     * Retrieve the current status for an account.
     *
     * @param accountId the account to fetch the status from
     * @throws AccountNotFoundError if the account cannot be found
     */
    accountStatus(accountId: string): Promise<AccountStatus>

    /**
     * Deposit money into an account.
     *
     * @param accountId Account to deposit the money into
     * @param amount Amount to deposit
     * @throws AccountNotFoundError if the account cannot be found
     * @throws DepositLimitExceededError if the deposit limit is exceeded
     */
    depositAccount(accountId: string, amount: number): Promise<Deposit>

    /**
     * Withdraws money from a given account.
     *
     * @param accountId Account to withdraw money from
     * @param amount Amount to withdraw
     * @throws AccountNotFoundError if the account cannot be found
     * @throws InsufficientBalanceError if the account does not have enough money
     */
    withdrawAccount(accountId: string, amount: number): Promise<Withdraw>

    /**
     * Transfers a given amount of money from an account to another.
     *
     * @param fromAccount The account that sends the money
     * @param toAccount The account that receives the money
     * @param amount The amount of money to send
     * @throws AccountNotFoundError if either accounts cannot be found
     * @throws InsufficientBalanceError if fromAccount's balance is too low
     */
    transferAccount(fromAccount: string, toAccount: string, amount: number): Promise<Transfer>
}