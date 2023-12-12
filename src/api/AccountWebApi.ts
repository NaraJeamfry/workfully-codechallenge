import express, { Express, Request, response, Response } from "express";
import { Server, IncomingMessage, ServerResponse } from "http";
import { appConfig } from "../config";
import { AccountsApi } from "./AccountsApi";
import { AccountStatus } from "../business/entities/Account";


export class AccountWebApi implements AccountsApi {
    public readonly express: Express = express();
    private readonly port: Number;
    private server: Server | undefined;

    constructor() {
        this.port = appConfig.serverPort;

        this.server = this.express.listen(this.port)
        console.log(`WebApi: Listening to port ${this.port}...`)
    }

    stop(): void {
        console.log(`WebApi: Closing server...`)
        this.server?.close();
    }

    initializeAccountStatus(accountStatus: (accountId: string) => Promise<AccountStatus>): void {
        this.express.get('/account/:accountId', async (request: Request, response: Response) => {
            const accountId = request.params.accountId
            const accountStatusObject = await accountStatus(accountId)
            response.json(accountStatusObject)
        })
    }
}
