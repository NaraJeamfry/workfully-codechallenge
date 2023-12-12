import { token } from "brandi"
import { AccountRepository } from "../business/interfaces/AccountRepository"
import { AccountsService } from "../business/interfaces/AccountsService"
import { AccountsApi } from "../api/AccountsApi"
import { AccountsApplication } from "./AccountsApplication"

export const TOKENS = {
    accountRepository: token<AccountRepository>('accountRepository'),
    accountsService: token<AccountsService>('accountsUseCase'),
    accountsApi: token<AccountsApi>('accountsApi'),
    accountsApplication: token<AccountsApplication>('accountsApplication'),
}