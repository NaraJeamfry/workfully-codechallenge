import { token } from "brandi"
import { AccountRepository } from "../business/interfaces/AccountRepository"
import { AccountsService } from "../business/interfaces/AccountsService"
import { AccountsApi } from "../business/interfaces/AccountsApi"
import { AccountsApplication } from "./AccountsApplication"
import { AccountLockProvider } from "../business/interfaces/AccountLockProvider"

export const TOKENS = {
    accountRepository: token<AccountRepository>('accountRepository'),
    accountLockProvider: token<AccountLockProvider<any>>('accountLockProvider'),
    accountsService: token<AccountsService>('accountsUseCase'),
    accountsApi: token<AccountsApi>('accountsApi'),
    accountsApplication: token<AccountsApplication>('accountsApplication'),
}