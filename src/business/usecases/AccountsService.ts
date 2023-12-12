import { AccountRepository } from "../interfaces/AccountRepository"
import { injected } from "brandi";
import { TOKENS } from "../../app/container.types";
import { AccountStatus } from "../entities/Account";

export class AccountsService {
    constructor(private accountRepository: AccountRepository) {
        this.accountRepository = accountRepository
    }

    async getAccountStatus(accountId: string): Promise<AccountStatus> {
        const accountStatus = await this.accountRepository.getAccount(accountId);
        return accountStatus;
    }
}

injected(AccountsService, TOKENS.accountRepository);