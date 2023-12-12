import { AccountStatus } from "../business/entities/Account";


export interface AccountsApi {

    // initializeDepositMoney(depositMoney: () => Promise<>)
    initializeAccountStatus(accountStatus: (accountId: string) => Promise<AccountStatus>): void;

}
