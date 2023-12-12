import { AccountsApi } from "../api/AccountsApi";
import { AccountsService } from "../business/usecases/AccountsService";
import { injected } from "brandi";
import { TOKENS } from "./container.types";

export class AccountsApplication {
    constructor(
        private accountsApi: AccountsApi,
        private accountsService: AccountsService,
    ) { }

    init() {
        console.log(`Application: Initializing application APIs...`)
        this.accountsApi.initializeAccountStatus(
            // Functions sent as reference need to be "arrowed" to keep a correct `this` context
            (accountId) => this.accountsService.getAccountStatus(accountId)
        );
        console.log(`Application: Initialized successfully.`)
    }
}

injected(AccountsApplication, TOKENS.accountsApi, TOKENS.accountsService)