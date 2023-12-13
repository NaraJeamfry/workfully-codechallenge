import { AccountRepositoryMock } from "../mocks/AccountRepositoryMock"
import { AccountsUseCases } from "../../business/usecases/AccountsUseCases"
import {
    AccountNotFoundError,
    InsufficientBalanceError
} from "../../business/errors"
import { after } from "node:test"
import {
    AccountInMemoryLockProvider
} from "../../db/AccountInMemoryLockProvider"

const db = new AccountRepositoryMock()
const lockProvider = new AccountInMemoryLockProvider()
const service = new AccountsUseCases(db, lockProvider)

describe('Successful transfer', () => {
    beforeEach(async () => {
        await db.addAccount("9494719b-8266-4ae9-bf24-cdf33b68c750", 1000.0)
        await db.addAccount("f6766e5e-c0aa-4f4a-8e87-1e5d64389281", 0.0)
    })
    it('should return', async () => {
        const transfer = await service.transferAccount(
            "9494719b-8266-4ae9-bf24-cdf33b68c750",
            "f6766e5e-c0aa-4f4a-8e87-1e5d64389281",
            100.0)
        expect(transfer).toBeDefined()
    })
    it('should return the correct account IDs', async () => {
        const transfer = await service.transferAccount(
            "9494719b-8266-4ae9-bf24-cdf33b68c750",
            "f6766e5e-c0aa-4f4a-8e87-1e5d64389281",
            100.0)
        expect(transfer.fromAccount).toBe("9494719b-8266-4ae9-bf24-cdf33b68c750")
        expect(transfer.toAccount).toBe("f6766e5e-c0aa-4f4a-8e87-1e5d64389281")
    })
    it('should return valid transfer data', async () => {
        const transfer = await service.transferAccount(
            "9494719b-8266-4ae9-bf24-cdf33b68c750",
            "f6766e5e-c0aa-4f4a-8e87-1e5d64389281",
            100.0)
        expect(transfer.balance).toBe(900.0)
        expect(transfer.amount).toBe(100.0)
    })
    afterEach(async () => {
        db.removeAccount("9494719b-8266-4ae9-bf24-cdf33b68c750")
        db.removeAccount("f6766e5e-c0aa-4f4a-8e87-1e5d64389281")
    })
})

describe('Transfer from non-existing account', () => {
    beforeEach(async () => {
        await db.addAccount("f6766e5e-c0aa-4f4a-8e87-1e5d64389281", 0.0)
    })
    it('should throw an error', async () => {
        await expect(async () => { await service.transferAccount(
            "9494719b-8266-4ae9-bf24-cdf33b68c750",
            "f6766e5e-c0aa-4f4a-8e87-1e5d64389281",
            100.0)
        }).rejects.toThrow(AccountNotFoundError)
    })
    afterEach(async () => {
        db.removeAccount("f6766e5e-c0aa-4f4a-8e87-1e5d64389281")
    })
})

describe('Transfer to non-existing account', () => {
    beforeEach(async () => {
        await db.addAccount("9494719b-8266-4ae9-bf24-cdf33b68c750", 100.0)
    })
    it('should throw an error', async () => {
        await expect(async () => { await service.transferAccount(
            "9494719b-8266-4ae9-bf24-cdf33b68c750",
            "f6766e5e-c0aa-4f4a-8e87-1e5d64389281",
            100.0)
        }).rejects.toThrow(AccountNotFoundError)
    })
    afterEach(async () => {
        db.removeAccount("9494719b-8266-4ae9-bf24-cdf33b68c750")
    })
})

describe('Transfer between non-existing accounts', () => {
    it('should throw an error', async () => {
        await expect(async () => { await service.transferAccount(
            "9494719b-8266-4ae9-bf24-cdf33b68c750",
            "f6766e5e-c0aa-4f4a-8e87-1e5d64389281",
            100.0)
        }).rejects.toThrow(AccountNotFoundError)
    })
})

describe('Transfer with insufficient balance', () => {
    beforeEach(async () => {
        await db.addAccount("9494719b-8266-4ae9-bf24-cdf33b68c750", 50.0)
        await db.addAccount("f6766e5e-c0aa-4f4a-8e87-1e5d64389281", 0.0)
    })
    it('should throw an error', async () => {
        await expect(async () => { await service.transferAccount(
            "9494719b-8266-4ae9-bf24-cdf33b68c750",
            "f6766e5e-c0aa-4f4a-8e87-1e5d64389281",
            100.0)
        }).rejects.toThrow(InsufficientBalanceError)
    })
    afterEach(async () => {
        db.removeAccount("9494719b-8266-4ae9-bf24-cdf33b68c750")
        db.removeAccount("f6766e5e-c0aa-4f4a-8e87-1e5d64389281")
    })
})