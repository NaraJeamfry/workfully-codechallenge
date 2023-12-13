import express, {
    Express,
    NextFunction,
    Request,
    Response,
    Router
} from "express"
import { Server } from "http"

import {
    AccountStatusResponse,
    DepositResponse, TransferResponse,
    WithdrawResponse
} from "./schema"
import { appConfig } from "../config"

import { AccountsApi } from "../business/interfaces/AccountsApi"
import { AccountStatus } from "../business/entities/Account"
import { Deposit } from "../business/entities/Deposit"
import { Transfer } from "../business/entities/Transfer"
import { Withdraw } from "../business/entities/Withdraw"

import {
    AccountNotFoundError,
    DepositLimitExceededError, InsufficientBalanceError
} from "../business/errors"
import {
    AccountNotFoundApiError,
    DepositLimitExceededApiError, InsufficientBalanceApiError
} from "./errors/accounts"
import { handleApiError } from "./middleware/errorHandler"


export class AccountWebApi implements AccountsApi {
    public readonly express: Express = express()
    private readonly port: Number
    private server: Server | undefined
    private routes: Router

    constructor() {
        this.port = appConfig.serverPort

        this.routes = express.Router()
        this.loadMiddlewares()

        this.server = this.express.listen(this.port)
        console.log(`WebApi: Listening on port ${this.port}.`)
        console.log(`WebApi: Enabled JSON body parser.`)
    }

    loadMiddlewares() {
        // Body parsing and validation
        this.express.use(express.json())

        // Router for code
        this.express.use('/', this.routes)

        // Error handler for ApiError
        this.express.use(handleApiError)
    }

    shutdown(): void {
        console.log(`WebApi: Closing server...`)
        this.server?.close()
    }

    initializeAccountStatus(accountStatus: (accountId: string) => Promise<AccountStatus>): void {
        this.routes.get('/account/:accountId', async (request: Request, response: Response, next: NextFunction) => {
            const accountId = request.params.accountId
            try {
                const accountStatusObject = await accountStatus(accountId)

                response.json(accountStatusObject as AccountStatusResponse)
            } catch (e) {
                if (e instanceof AccountNotFoundError) {
                    next(new AccountNotFoundApiError())
                } else {
                    next(e)
                }
            }
        })
    }

    initializeDepositAccount(depositAccount: (accountId: string, amount: number) => Promise<Deposit>) {
        this.routes.post('/deposit/:accountId', async (req: Request, res: Response, next: NextFunction) => {
            const accountId = req.params.accountId
            const amount = req.body.amount

            if (amount === undefined) {
                res.status(400).json({errorCode: "badRequest", errorMessage: "Bad request."})
            }

            try {
                const deposit = await depositAccount(accountId, amount)

                res.status(201).json(deposit as DepositResponse)
            } catch (e) {
                if (e instanceof AccountNotFoundError) {
                    next(new AccountNotFoundApiError())
                } else if (e instanceof DepositLimitExceededError) {
                    next(new DepositLimitExceededApiError())
                } else {
                    next(e)
                }
            }
        })
    }

    initializeWithdrawAccount(withdrawAccount: (accountId: string, amount: number) => Promise<Withdraw>): void {
        this.routes.post('/withdraw/:accountId', async (req: Request, res: Response, next: NextFunction) => {
            const accountId = req.params.accountId
            const amount = req.body.amount

            if (amount === undefined) {
                res.status(400).json({errorCode: "badRequest", errorMessage: "Bad request."})
            }

            try {
                const withdraw = await withdrawAccount(accountId, amount)

                res.status(201).json(withdraw as WithdrawResponse)
            } catch (e) {
                if (e instanceof AccountNotFoundError) {
                    next(new AccountNotFoundApiError())
                } else if (e instanceof InsufficientBalanceError) {
                    next(new InsufficientBalanceApiError())
                } else {
                    next(e)
                }
            }
        })
    }

    initializeTransferAccount(transferAccount: (fromAccount: string, toAccount: string, amount: number) => Promise<Transfer>): void {
        this.routes.post('/transfer/:accountId', async (req: Request, res: Response, next: NextFunction) => {
            const accountId = req.params.accountId
            const toAccount = req.body.toAccount
            const amount = req.body.amount

            if (amount === undefined || toAccount === undefined) {
                res.status(400).json({errorCode: "badRequest", errorMessage: "Bad request."})
            }

            try {
                const transfer = await transferAccount(accountId, toAccount, amount)

                res.status(201).json(transfer as TransferResponse)
            } catch (e) {
                if (e instanceof AccountNotFoundError) {
                    next(new AccountNotFoundApiError())
                } else if (e instanceof InsufficientBalanceError) {
                    next(new InsufficientBalanceApiError())
                } else {
                    next(e)
                }
            }
        })
    }
}
