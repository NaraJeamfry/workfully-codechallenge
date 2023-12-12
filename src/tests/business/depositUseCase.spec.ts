import { AccountRepositoryMock } from "../mocks/AccountRepositoryMock"
import { AccountsUseCases } from "../../business/usecases/AccountsUseCases"
import {
    AccountNotFoundError,
    DepositLimitExceededError
} from "../../business/errors"

const db = new AccountRepositoryMock()
const service = new AccountsUseCases(db)

describe('Deposit on existing account', () => {
    beforeEach(async () => {
        await db.addAccount("629c7c78-37c3-4031-974e-4b2af3ca2950", 1000.0,
            0.0)
    })
    it('should return', async () => {
        const deposit = await service.depositAccount(
            "629c7c78-37c3-4031-974e-4b2af3ca2950", 100.0)
        expect(deposit).toBeDefined()
    })
    it('should return the correct account ID', async () => {
        const deposit = await service.depositAccount(
            "629c7c78-37c3-4031-974e-4b2af3ca2950", 100.0)
        expect(deposit.accountId).toBe("629c7c78-37c3-4031-974e-4b2af3ca2950")
    })
    it('should return valid deposit data', async () => {
        const deposit = await service.depositAccount(
            "629c7c78-37c3-4031-974e-4b2af3ca2950", 100.0)
        expect(deposit.balance).toBe(1100.0)
        expect(deposit.amount).toBe(100.0)
    })
    afterEach(async () => {
        db.removeAccount("629c7c78-37c3-4031-974e-4b2af3ca2950")
    })
})

describe('Deposit on non-existing account', () => {
    it('should throw an error', async () => {
        await expect(async () => { await service.depositAccount(
            "629c7c78-37c3-4031-974e-4b2af3ca2950", 100.0) })
            .rejects
            .toThrow(AccountNotFoundError)
    })
})

describe('Deposit exceeds limit', () => {
    beforeEach(async () => {
        await db.addAccount("629c7c78-37c3-4031-974e-4b2af3ca2950", 1000.0,
            5000.0)
    })
    it('should throw an error', async () => {
        await expect(async () => { await service.depositAccount(
            "629c7c78-37c3-4031-974e-4b2af3ca2950", 100.0) })
            .rejects
            .toThrow(DepositLimitExceededError)
    })
    afterEach(async () => {
        db.removeAccount("629c7c78-37c3-4031-974e-4b2af3ca2950")
    })
})