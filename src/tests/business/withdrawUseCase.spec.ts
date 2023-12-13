import { AccountRepositoryMock } from "../mocks/AccountRepositoryMock"
import { AccountsUseCases } from "../../business/usecases/AccountsUseCases"
import {
    AccountNotFoundError,
    DepositLimitExceededError, InsufficientBalanceError
} from "../../business/errors"

const db = new AccountRepositoryMock()
const service = new AccountsUseCases(db)

describe('Withdraw on existing account', () => {
    beforeEach(async () => {
        await db.addAccount("629c7c78-37c3-4031-974e-4b2af3ca2950", 1000.0)
    })
    it('should return', async () => {
        const withdraw = await service.withdrawAccount(
            "629c7c78-37c3-4031-974e-4b2af3ca2950", 100.0)
        expect(withdraw).toBeDefined()
    })
    it('should return the correct account ID', async () => {
        const withdraw = await service.withdrawAccount(
            "629c7c78-37c3-4031-974e-4b2af3ca2950", 100.0)
        expect(withdraw.accountId).toBe("629c7c78-37c3-4031-974e-4b2af3ca2950")
    })
    it('should return valid withdraw data', async () => {
        const withdraw = await service.withdrawAccount(
            "629c7c78-37c3-4031-974e-4b2af3ca2950", 100.0)
        expect(withdraw.balance).toBe(900.0)
        expect(withdraw.amount).toBe(100.0)
    })
    afterEach(async () => {
        db.removeAccount("629c7c78-37c3-4031-974e-4b2af3ca2950")
    })
})

describe('Withdraw on non-existing account', () => {
    it('should throw an error', async () => {
        await expect(async () => { await service.withdrawAccount(
            "629c7c78-37c3-4031-974e-4b2af3ca2950", 100.0) })
            .rejects
            .toThrow(AccountNotFoundError)
    })
})

describe('Withdraw with overdraft', () => {
    beforeEach(async () => {
        await db.addAccount("629c7c78-37c3-4031-974e-4b2af3ca2950", 100.0)
    })
    it('should return', async () => {
        const withdraw = await service.withdrawAccount(
            "629c7c78-37c3-4031-974e-4b2af3ca2950", 200.0)
        expect(withdraw).toBeDefined()
    })
    it('should return negative balance', async () => {
        const withdraw = await service.withdrawAccount(
            "629c7c78-37c3-4031-974e-4b2af3ca2950", 200.0)
        expect(withdraw.balance).toBe(-100.0)
    })
    afterEach(async () => {
        db.removeAccount("629c7c78-37c3-4031-974e-4b2af3ca2950")
    })
})

describe('Withdraw with insufficient balance', () => {
    beforeEach(async () => {
        await db.addAccount("629c7c78-37c3-4031-974e-4b2af3ca2950", -200.0,
            0.0)
    })
    it('should throw an error', async () => {
        await expect(async () => { await service.withdrawAccount(
            "629c7c78-37c3-4031-974e-4b2af3ca2950", 100.0) })
            .rejects
            .toThrow(InsufficientBalanceError)
    })
    afterEach(async () => {
        db.removeAccount("629c7c78-37c3-4031-974e-4b2af3ca2950")
    })
})