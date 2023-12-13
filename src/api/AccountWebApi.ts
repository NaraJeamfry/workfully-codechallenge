import express, {
    Express,
    NextFunction,
    Request,
    Response,
    Router
} from "express"
import { Server } from "http"
import { appConfig } from "../config"
import { AccountsApi } from "./AccountsApi"
import { AccountStatus } from "../business/entities/Account"
import { AccountNotFoundError } from "../business/errors"
import { AccountNotFoundApiError } from "./errors/accounts"
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
        // Body parser for JSON
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

                response.json(accountStatusObject)
            } catch (e) {
                if (e instanceof AccountNotFoundError) {
                    next(new AccountNotFoundApiError())
                }
            }
        })
    }
}
