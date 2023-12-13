import { container } from "../../app/container"
import { TOKENS } from "../../app/container.types"
import { AccountRepositoryMock } from "../mocks/AccountRepositoryMock"
import { AccountWebApi } from "../../api/AccountWebApi"
import request from "supertest"
import { TransferResponse } from "../../api/schema"

container.bind(TOKENS.accountRepository).toInstance(AccountRepositoryMock).inSingletonScope()
const api = container.get(TOKENS.accountsApi) as AccountWebApi
const db = container.get(TOKENS.accountRepository) as AccountRepositoryMock
container.get(TOKENS.accountsApplication).init()

describe('Successful transfer', () => {
    beforeEach(async () => {
        await db.addAccount("2ea5a7a1-338a-4963-8f16-aca7c60a6c61", 1000.0)
        await db.addAccount("3596ec98-3e61-4ed5-ae88-ee42bbd3cc45", 0.0)
    })
    it('should respond 201', async () => {
        const response = await request(api.express)
            .post("/transfer/2ea5a7a1-338a-4963-8f16-aca7c60a6c61")
            .send({
                amount: 200.0,
                toAccount: "3596ec98-3e61-4ed5-ae88-ee42bbd3cc45"
            })

        expect(response.status).toBe(201)
    })
    it('should return the correct account IDs', async () => {
        const response = await request(api.express)
            .post("/transfer/2ea5a7a1-338a-4963-8f16-aca7c60a6c61")
            .send({
                amount: 200.0,
                toAccount: "3596ec98-3e61-4ed5-ae88-ee42bbd3cc45"
            })

        const body = response.body as TransferResponse

        expect(body.fromAccount).toBe("2ea5a7a1-338a-4963-8f16-aca7c60a6c61")
        expect(body.toAccount).toBe("3596ec98-3e61-4ed5-ae88-ee42bbd3cc45")
    })
    it('should return the correct amount', async () => {
        const response = await request(api.express)
            .post("/transfer/2ea5a7a1-338a-4963-8f16-aca7c60a6c61")
            .send({
                amount: 200.0,
                toAccount: "3596ec98-3e61-4ed5-ae88-ee42bbd3cc45"
            })

        const body = response.body as TransferResponse

        expect(body.amount).toBe(200.0)
    })
    it('should return the updated balance for the from account', async () => {
        const response = await request(api.express)
            .post("/transfer/2ea5a7a1-338a-4963-8f16-aca7c60a6c61")
            .send({
                amount: 200.0,
                toAccount: "3596ec98-3e61-4ed5-ae88-ee42bbd3cc45"
            })

        const body = response.body as TransferResponse

        expect(body.balance).toBe(800.0)
    })
    it('should update the sender\'s balance', async () => {
        const response = await request(api.express)
            .post("/transfer/2ea5a7a1-338a-4963-8f16-aca7c60a6c61")
            .send({
                amount: 200.0,
                toAccount: "3596ec98-3e61-4ed5-ae88-ee42bbd3cc45"
            })

        const fromAccount = await db.getAccount("2ea5a7a1-338a-4963-8f16-aca7c60a6c61")

        expect(fromAccount).not.toBeNull()
        expect(fromAccount?.balance).toBe(800.0)
    })
    it('should update the receiver\'s balance', async () => {
        const response = await request(api.express)
            .post("/transfer/2ea5a7a1-338a-4963-8f16-aca7c60a6c61")
            .send({
                amount: 200.0,
                toAccount: "3596ec98-3e61-4ed5-ae88-ee42bbd3cc45"
            })

        const toAccount = await db.getAccount("3596ec98-3e61-4ed5-ae88-ee42bbd3cc45")

        expect(toAccount).not.toBeNull()
        expect(toAccount?.balance).toBe(200.0)
    })
    afterEach(async () => {
        db.removeAccount("2ea5a7a1-338a-4963-8f16-aca7c60a6c61")
        db.removeAccount("3596ec98-3e61-4ed5-ae88-ee42bbd3cc45")
    })
})

describe('Transfer from accounts without enough funds', () => {
    beforeEach(async () => {
        await db.addAccount("2ea5a7a1-338a-4963-8f16-aca7c60a6c61", 100.0)
        await db.addAccount("3596ec98-3e61-4ed5-ae88-ee42bbd3cc45", 0.0)
    })
    it('should respond 400 if exceed overdraft', async () => {
        const response = await request(api.express)
            .post("/transfer/2ea5a7a1-338a-4963-8f16-aca7c60a6c61")
            .send({
                amount: 1000.0,
                toAccount: "3596ec98-3e61-4ed5-ae88-ee42bbd3cc45"
            })

        expect(response.status).toBe(400)
    })
    it('should respond 400 even if within overdraft', async () => {
        const response = await request(api.express)
            .post("/transfer/2ea5a7a1-338a-4963-8f16-aca7c60a6c61")
            .send({
                amount: 200.0,
                toAccount: "3596ec98-3e61-4ed5-ae88-ee42bbd3cc45"
            })

        expect(response.status).toBe(400)
    })
    it('should return a valid GenericError', async () => {
        const response = await request(api.express)
            .post("/transfer/2ea5a7a1-338a-4963-8f16-aca7c60a6c61")
            .send({
                amount: 1000.0,
                toAccount: "3596ec98-3e61-4ed5-ae88-ee42bbd3cc45"
            })

        expect(response.body).toEqual(expect.objectContaining({
            errorCode: expect.any(String),
            errorMessage: expect.any(String),
        }))
    })
    it('should return an insufficientBalance error', async () => {
        const response = await request(api.express)
            .post("/transfer/2ea5a7a1-338a-4963-8f16-aca7c60a6c61")
            .send({
                amount: 1000.0,
                toAccount: "3596ec98-3e61-4ed5-ae88-ee42bbd3cc45"
            })

        expect(response.body).toHaveProperty("errorCode")
        expect(response.body.errorCode).toBe("insufficientBalance")
    })
    it('should not update the sender\'s balance', async () => {
        const response = await request(api.express)
            .post("/transfer/2ea5a7a1-338a-4963-8f16-aca7c60a6c61")
            .send({
                amount: 1000.0,
                toAccount: "3596ec98-3e61-4ed5-ae88-ee42bbd3cc45"
            })

        const fromAccount = await db.getAccount("2ea5a7a1-338a-4963-8f16-aca7c60a6c61")

        expect(fromAccount).not.toBeNull()
        expect(fromAccount?.balance).toBe(100.0)
    })
    it('should not update the receiver\'s balance', async () => {
        const response = await request(api.express)
            .post("/transfer/2ea5a7a1-338a-4963-8f16-aca7c60a6c61")
            .send({
                amount: 200.0,
                toAccount: "3596ec98-3e61-4ed5-ae88-ee42bbd3cc45"
            })

        const toAccount = await db.getAccount("3596ec98-3e61-4ed5-ae88-ee42bbd3cc45")

        expect(toAccount).not.toBeNull()
        expect(toAccount?.balance).toBe(0.0)
    })
    afterEach(async () => {
        db.removeAccount("2ea5a7a1-338a-4963-8f16-aca7c60a6c61")
        db.removeAccount("3596ec98-3e61-4ed5-ae88-ee42bbd3cc45")
    })
})

describe('Transfer from accounts in overdraft', () => {
    beforeEach(async () => {
        await db.addAccount("2ea5a7a1-338a-4963-8f16-aca7c60a6c61", -100.0)
        await db.addAccount("3596ec98-3e61-4ed5-ae88-ee42bbd3cc45", 0.0)
    })
    it('should respond 400', async () => {
        const response = await request(api.express)
            .post("/transfer/2ea5a7a1-338a-4963-8f16-aca7c60a6c61")
            .send({
                amount: 10.0,
                toAccount: "3596ec98-3e61-4ed5-ae88-ee42bbd3cc45"
            })

        expect(response.status).toBe(400)
    })
    it('should return a valid GenericError', async () => {
        const response = await request(api.express)
            .post("/transfer/2ea5a7a1-338a-4963-8f16-aca7c60a6c61")
            .send({
                amount: 10.0,
                toAccount: "3596ec98-3e61-4ed5-ae88-ee42bbd3cc45"
            })

        expect(response.body).toEqual(expect.objectContaining({
            errorCode: expect.any(String),
            errorMessage: expect.any(String),
        }))
    })
    it('should return an insufficientBalance error', async () => {
        const response = await request(api.express)
            .post("/transfer/2ea5a7a1-338a-4963-8f16-aca7c60a6c61")
            .send({
                amount: 10.0,
                toAccount: "3596ec98-3e61-4ed5-ae88-ee42bbd3cc45"
            })

        expect(response.body).toHaveProperty("errorCode")
        expect(response.body.errorCode).toBe("insufficientBalance")
    })
    it('should not update the sender\'s balance', async () => {
        const response = await request(api.express)
            .post("/transfer/2ea5a7a1-338a-4963-8f16-aca7c60a6c61")
            .send({
                amount: 10.0,
                toAccount: "3596ec98-3e61-4ed5-ae88-ee42bbd3cc45"
            })

        const fromAccount = await db.getAccount("2ea5a7a1-338a-4963-8f16-aca7c60a6c61")

        expect(fromAccount).not.toBeNull()
        expect(fromAccount?.balance).toBe(-100.0)
    })
    it('should not update the receiver\'s balance', async () => {
        const response = await request(api.express)
            .post("/transfer/2ea5a7a1-338a-4963-8f16-aca7c60a6c61")
            .send({
                amount: 10.0,
                toAccount: "3596ec98-3e61-4ed5-ae88-ee42bbd3cc45"
            })

        const toAccount = await db.getAccount("3596ec98-3e61-4ed5-ae88-ee42bbd3cc45")

        expect(toAccount).not.toBeNull()
        expect(toAccount?.balance).toBe(0.0)
    })
    afterEach(async () => {
        db.removeAccount("2ea5a7a1-338a-4963-8f16-aca7c60a6c61")
        db.removeAccount("3596ec98-3e61-4ed5-ae88-ee42bbd3cc45")
    })
})

describe('Transfer where toAccount does not exist', () => {
    beforeEach(async () => {
        await db.addAccount("2ea5a7a1-338a-4963-8f16-aca7c60a6c61", 1000.0)
    })
    it('should respond 400', async () => {
        const response = await request(api.express)
            .post("/transfer/2ea5a7a1-338a-4963-8f16-aca7c60a6c61")
            .send({
                amount: 200.0,
                toAccount: "3596ec98-3e61-4ed5-ae88-ee42bbd3cc45"
            })

        expect(response.status).toBe(400)
    })
    it('should return a valid GenericError', async () => {
        const response = await request(api.express)
            .post("/transfer/2ea5a7a1-338a-4963-8f16-aca7c60a6c61")
            .send({
                amount: 200.0,
                toAccount: "3596ec98-3e61-4ed5-ae88-ee42bbd3cc45"
            })

        expect(response.body).toEqual(expect.objectContaining({
            errorCode: expect.any(String),
            errorMessage: expect.any(String),
        }))
    })
    it('should return an insufficientBalance error', async () => {
        const response = await request(api.express)
            .post("/transfer/2ea5a7a1-338a-4963-8f16-aca7c60a6c61")
            .send({
                amount: 200.0,
                toAccount: "3596ec98-3e61-4ed5-ae88-ee42bbd3cc45"
            })

        expect(response.body).toHaveProperty("errorCode")
        expect(response.body.errorCode).toBe("accountNotFound")
    })
    it('should not update the sender\'s balance', async () => {
        const response = await request(api.express)
            .post("/transfer/2ea5a7a1-338a-4963-8f16-aca7c60a6c61")
            .send({
                amount: 200.0,
                toAccount: "3596ec98-3e61-4ed5-ae88-ee42bbd3cc45"
            })

        const fromAccount = await db.getAccount("2ea5a7a1-338a-4963-8f16-aca7c60a6c61")

        expect(fromAccount).not.toBeNull()
        expect(fromAccount?.balance).toBe(1000.0)
    })
    afterEach(async () => {
        db.removeAccount("2ea5a7a1-338a-4963-8f16-aca7c60a6c61")
    })
})

describe('Transfer where fromAccount does not exist', () => {
    beforeEach(async () => {
        await db.addAccount("3596ec98-3e61-4ed5-ae88-ee42bbd3cc45", 1000.0)
    })
    it('should respond 400', async () => {
        const response = await request(api.express)
            .post("/transfer/2ea5a7a1-338a-4963-8f16-aca7c60a6c61")
            .send({
                amount: 200.0,
                toAccount: "3596ec98-3e61-4ed5-ae88-ee42bbd3cc45"
            })

        expect(response.status).toBe(400)
    })
    it('should return a valid GenericError', async () => {
        const response = await request(api.express)
            .post("/transfer/2ea5a7a1-338a-4963-8f16-aca7c60a6c61")
            .send({
                amount: 200.0,
                toAccount: "3596ec98-3e61-4ed5-ae88-ee42bbd3cc45"
            })

        expect(response.body).toEqual(expect.objectContaining({
            errorCode: expect.any(String),
            errorMessage: expect.any(String),
        }))
    })
    it('should return an insufficientBalance error', async () => {
        const response = await request(api.express)
            .post("/transfer/2ea5a7a1-338a-4963-8f16-aca7c60a6c61")
            .send({
                amount: 200.0,
                toAccount: "3596ec98-3e61-4ed5-ae88-ee42bbd3cc45"
            })

        expect(response.body).toHaveProperty("errorCode")
        expect(response.body.errorCode).toBe("accountNotFound")
    })
    it('should not update the receiver\'s balance', async () => {
        const response = await request(api.express)
            .post("/transfer/2ea5a7a1-338a-4963-8f16-aca7c60a6c61")
            .send({
                amount: 200.0,
                toAccount: "3596ec98-3e61-4ed5-ae88-ee42bbd3cc45"
            })

        const toAccount = await db.getAccount("3596ec98-3e61-4ed5-ae88-ee42bbd3cc45")

        expect(toAccount).not.toBeNull()
        expect(toAccount?.balance).toBe(1000.0)
    })
    afterEach(async () => {
        db.removeAccount("3596ec98-3e61-4ed5-ae88-ee42bbd3cc45")
    })
})

describe('GET Transfer', () => {
    it('should not be available', async () => {
        const response = await request(api.express)
            .get("/transfer/2ea5a7a1-338a-4963-8f16-aca7c60a6c61")

        expect(response.status).toBe(404)
    })
})

afterAll(done => {
    container.get(TOKENS.accountsApplication).shutdown()
    done()
})