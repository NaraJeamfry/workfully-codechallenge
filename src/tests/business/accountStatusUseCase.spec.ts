import { AccountRepositoryMock } from "../mocks/AccountRepositoryMock"
import { AccountsUseCases } from "../../business/usecases/AccountsUseCases"
import { AccountNotFoundError } from "../../business/errors"
import {
    AccountInMemoryLockProvider
} from "../../db/AccountInMemoryLockProvider"

const db = new AccountRepositoryMock()
const lockProvider = new AccountInMemoryLockProvider()
const service = new AccountsUseCases(db, lockProvider)

describe('Get existing account status', () => {
    beforeEach(async () => {
        await db.addAccount("d447add1-b61d-4958-bcfe-3746b9307cdc", 1000.0,
            0.0)
    })
    it('should return', async () => {
        const status = await service.accountStatus("d447add1-b61d-4958-bcfe-3746b9307cdc")
        expect(status).toBeDefined()
    })
    it('should return the correct account ID', async () => {
        const status = await service.accountStatus("d447add1-b61d-4958-bcfe-3746b9307cdc")
        expect(status.accountId).toBe("d447add1-b61d-4958-bcfe-3746b9307cdc")
    })
    it('should return valid account data', async () => {
        const status = await service.accountStatus("d447add1-b61d-4958-bcfe-3746b9307cdc")
        expect(status.balance).toBe(1000.0)
        expect(status.depositedToday).toBe(0.0)
    })
    it('should return the account limits', async () => {
        const status = await service.accountStatus("d447add1-b61d-4958-bcfe-3746b9307cdc")
        expect(status.limits).toBeDefined()
        expect(status.limits.overdraft).toBe(200.0)
        expect(status.limits.dailyDeposit).toBe(5000.0)
    })
    afterEach(async () => {
        db.removeAccount("d447add1-b61d-4958-bcfe-3746b9307cdc")
    })
})

describe('Get non-existing account status', () => {
    it('should throw an error', async () => {
        await expect(async () => { await service.accountStatus("d447add1-b61d-4958-bcfe-3746b9307cdc") })
            .rejects
            .toThrow(AccountNotFoundError)
    })
})