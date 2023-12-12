import { AccountStatus } from "../entities/Account";


export interface AccountRepository {
    getAccount(accountId: string): Promise<AccountStatus>;
}