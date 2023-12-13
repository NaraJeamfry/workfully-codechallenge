import { AccountRepository } from "../business/interfaces/AccountRepository"
import sqlite3 from "sqlite3"
import { Database, open as sqliteOpen, Statement } from "sqlite"
import { Account } from "../business/entities/Account"
import { AccountNotFoundError } from "../business/errors"
import { appConfig } from "../config"

interface DbAccount {
    id: string,
    balance: number,
    depositedToday: number,
    lastDepositToday: string
}

export class AccountSQLiteRepository implements AccountRepository {
    private db: Database

    constructor() {
        console.log(`SQLiteRepository: Initializing the SQLite Database`)

        sqliteOpen({
            filename: appConfig.databaseUrl,
            driver: sqlite3.Database
        }).then((db) => {
            console.log(`SQLiteRepository: Successfully initialized the DB!`)
            this.db = db
        }).then(async () => {
            console.log(`SQLiteRepository: Applying migrations...`)
            await this.db.migrate()
        }).then(() => {
            console.log(`SQLiteRepository: Successfully applied migrations.`)
        })

    }

    async getAccount(accountId: string): Promise<Account | null> {
        return this.db.get<DbAccount>(
            `SELECT id, balance, depositedToday, lastDepositToday
             FROM Account
             WHERE id = ?`,
            accountId
        ).then(
            (result) => {
                if (result === undefined)
                    return null

                return new Account(result.id, {
                    balance: result.balance,
                    depositedToday: result.depositedToday,
                    lastDepositDay: new Date(result.lastDepositToday)
                })
            }
        )
    }

    async saveAccount(account: Account): Promise<boolean> {
        const result = await this.db.get<DbAccount>(
            `SELECT id, balance, depositedToday, lastDepositToday
             FROM Account
             WHERE id = ?`,
            account.accountId
        )

        if (result === undefined) {
            throw new AccountNotFoundError()
        }

        return this.db.run(
            'UPDATE Account SET balance = ?, depositedToday = ?, lastDepositToday = ? WHERE id = ?',
            account.balance, account.depositedToday, account.lastDepositDay?.toUTCString() ?? null, result.id
        ).then(
            (result) => (result.changes !== undefined && result.changes > 0)
        )
    }

}