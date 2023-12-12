import { container } from "../../app/container"
import { TOKENS } from "../../app/container.types"
import { AccountRepositoryMock } from "../mocks/AccountRepositoryMock"
import { AccountWebApi } from "../../api/AccountWebApi"
import { components } from "../../api/schema"
import request from "supertest"

type WithdrawResponse = components["schemas"]["Withdrawal"]

container.bind(TOKENS.accountRepository).toInstance(AccountRepositoryMock).inSingletonScope()
const api = container.get(TOKENS.accountsApi) as AccountWebApi
const db = container.get(TOKENS.accountRepository) as AccountRepositoryMock
container.get(TOKENS.accountsApplication).init()

describe('Successful withdrawal', () => {
    beforeEach(async () => {
        db.addAccount("f71c8140-95dd-4077-a7fc-2326383a512a", 1000.0)
    })
    it('should respond 200', async () => {
        const response = await request(api.express)
            .post("/withdraw/f71c8140-95dd-4077-a7fc-2326383a512a")
            .send({ amount: 200.0 })
        expect(response.status).toBe(200)
    })
    it('should return the correct account ID', async () => {
        const response = await request(api.express)
            .post("/withdraw/f71c8140-95dd-4077-a7fc-2326383a512a")
            .send({ amount: 200.0 })
        const body = response.body as WithdrawResponse
        expect(body.accountId).toBe("f71c8140-95dd-4077-a7fc-2326383a512a")
    })
    it('should return the correct amount', async () => {
        const response = await request(api.express)
            .post("/withdraw/f71c8140-95dd-4077-a7fc-2326383a512a")
            .send({ amount: 200.0 })
        const body = response.body as WithdrawResponse
        expect(body.amount).toBe(200.0)
    })
    it('should return an updated balance', async () => {
        const response = await request(api.express)
            .post("/withdraw/f71c8140-95dd-4077-a7fc-2326383a512a")
            .send({ amount: 200.0 })
        const body = response.body as WithdrawResponse
        expect(body.balance).toBe(800.0)
    })
    afterEach(async() => {
        db.removeAccount("f71c8140-95dd-4077-a7fc-2326383a512a")
    })
})

describe('Withdrawals for a non-existing account', () => {
    it('should respond 400', async () => {
        const response = await request(api.express)
            .post("/withdraw/f71c8140-95dd-4077-a7fc-2326383a512a")
            .send({ amount: 200.0 })
        expect(response.status).toBe(200)
    })
})

describe('Withdrawal that leave the account in valid overdraft', () => {
    beforeEach(async () => {
        db.addAccount("f71c8140-95dd-4077-a7fc-2326383a512a", 10.0)
    })
    it('should respond 200', async () => {
        const response = await request(api.express)
            .post("/withdraw/f71c8140-95dd-4077-a7fc-2326383a512a")
            .send({ amount: 200.0 })
        expect(response.status).toBe(200)
    })
    it('should return the updated, negative balance', async () => {
        const response = await request(api.express)
            .post("/withdraw/f71c8140-95dd-4077-a7fc-2326383a512a")
            .send({ amount: 200.0 })
        const body = response.body as WithdrawResponse
        expect(body.balance).toBe(-190.0)
    })
    afterEach(async() => {
        db.removeAccount("f71c8140-95dd-4077-a7fc-2326383a512a")
    })
})

describe('Withdrawal that exceed the overdraft limit', () => {
    beforeEach(async () => {
        db.addAccount("f71c8140-95dd-4077-a7fc-2326383a512a", 10.0)
    })
    it('should respond 400', async () => {
        const response = await request(api.express)
            .post("/withdraw/f71c8140-95dd-4077-a7fc-2326383a512a")
            .send({ amount: 300.0 })
        expect(response.status).toBe(400)
    })
    afterEach(async() => {
        db.removeAccount("f71c8140-95dd-4077-a7fc-2326383a512a")
    })
})

describe('GET Transfer', () => {
    it('should not be available', async() => {
        const response = await request(api.express)
            .get("/withdraw/f71c8140-95dd-4077-a7fc-2326383a512a")
        expect(response.status).toBe(404)
    })
})

afterAll(done => {
    container.get(TOKENS.accountsApplication).shutdown()
    done()
})