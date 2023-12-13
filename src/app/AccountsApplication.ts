import { AccountsApi } from "../business/interfaces/AccountsApi"
import { AccountsService } from "../business/interfaces/AccountsService"
import { injected } from "brandi"
import { TOKENS } from "./container.types"

export class AccountsApplication {
    constructor(
        private accountsApi: AccountsApi,
        private accountsService: AccountsService,
    ) {
    }

    init() {
        console.log(`Application: Initializing application APIs...`)
        this.accountsApi.initializeAccountStatus(
            // Functions sent as reference need to be "arrowed" to keep a correct `this` context
            (accountId) =>
                this.accountsService.accountStatus(accountId)
        )
        this.accountsApi.initializeDepositAccount(
            (accountId, amount) =>
                this.accountsService.depositAccount(accountId, amount)
        )
        this.accountsApi.initializeWithdrawAccount(
            (accountId, amount) =>
                this.accountsService.withdrawAccount(accountId, amount)
        )
        this.accountsApi.initializeTransferAccount(
            (fromAccount, toAccount, amount) =>
                this.accountsService.transferAccount(fromAccount, toAccount, amount)
        )
        console.log(`Application: Initialized successfully.`)
    }

    shutdown() {
        this.accountsApi.shutdown()
        console.log(`Closing application...`)
    }
}

injected(AccountsApplication, TOKENS.accountsApi, TOKENS.accountsService)