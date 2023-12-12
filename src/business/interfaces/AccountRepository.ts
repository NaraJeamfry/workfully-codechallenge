import { Account, AccountStatus } from "../entities/Account"


export interface AccountRepository {
    getAccount(accountId: string): Promise<Account | null>
    saveAccount(account: Account): Promise<boolean>
}