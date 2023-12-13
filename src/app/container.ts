import { TOKENS } from "./container.types"
import { Container } from "brandi"
import { AccountsUseCases } from "../business/usecases/AccountsUseCases"
import { AccountSQLiteRepository } from "../db/AccountSQLiteRepository"
import { AccountsApplication } from "./AccountsApplication"
import { AccountWebApi } from "../api/AccountWebApi"
import { AccountInMemoryLockProvider } from "../db/AccountInMemoryLockProvider"

export const container = new Container()
// Bind APIs
container.bind(TOKENS.accountsApi).toInstance(AccountWebApi).inSingletonScope()

// Bind DBs
container.bind(TOKENS.accountRepository).toInstance(AccountSQLiteRepository).inTransientScope()
container.bind(TOKENS.accountLockProvider).toInstance(AccountInMemoryLockProvider).inSingletonScope()

// Bind use-cases
container.bind(TOKENS.accountsService).toInstance(AccountsUseCases).inTransientScope()

// Finally, bind the app
container.bind(TOKENS.accountsApplication).toInstance(AccountsApplication).inSingletonScope()