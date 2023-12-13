import { AccountStatus } from "../entities/Account"
import { Deposit } from "../entities/Deposit"
import { Withdraw } from "../entities/Withdraw"
import { Transfer } from "../entities/Transfer"


export interface AccountsApi {

    initializeAccountStatus(accountStatus: (accountId: string) => Promise<AccountStatus>): void

    initializeDepositAccount(depositAccount: (accountId: string, amount: number) => Promise<Deposit>): void

    initializeWithdrawAccount(withdrawAccount: (accountId: string, amount: number) => Promise<Withdraw>): void

    initializeTransferAccount(transferAccount: (fromAccount: string, toAccount: string, amount: number) => Promise<Transfer>): void

    shutdown(): void
}
