import { TOKENS } from "./container.types";
import { Container } from "brandi";
import { AccountsService } from "../business/usecases/AccountsService";
import { AccountDataBase } from "../db/AccountDataBase";
import { AccountsApplication } from "./AccountsApplication";
import { AccountWebApi } from "../api/AccountWebApi";

export const container = new Container();
// Bind APIs
container.bind(TOKENS.accountsApi).toInstance(AccountWebApi).inSingletonScope();

// Bind DBs
container.bind(TOKENS.accountRepository).toInstance(AccountDataBase).inTransientScope();

// Bind use-cases
container.bind(TOKENS.accountsService).toInstance(AccountsService).inTransientScope();

// Finally, bind the app
container.bind(TOKENS.accountsApplication).toInstance(AccountsApplication).inSingletonScope();