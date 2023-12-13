import request from "supertest"
import { container } from "../../app/container"
import { TOKENS } from "../../app/container.types"
import { AccountWebApi } from "../../api/AccountWebApi"
import { AccountRepositoryMock } from "../mocks/AccountRepositoryMock"
import { DepositResponse } from "../../api/schema"

container.bind(TOKENS.accountRepository).toInstance(AccountRepositoryMock).inSingletonScope()
const api = container.get(TOKENS.accountsApi) as AccountWebApi
const db = container.get(TOKENS.accountRepository) as AccountRepositoryMock
container.get(TOKENS.accountsApplication).init()

describe('Successful deposit', () => {
    beforeEach(async () => {
        await db.addAccount("8d54f81a-f889-4a89-b64f-5f9a8abb84ed",
            1000.0, 3000.0)
    })
    it('should respond 201', async () => {
        const response = await request(api.express)
            .post("/deposit/8d54f81a-f889-4a89-b64f-5f9a8abb84ed")
            .send({amount: 200.0})
        expect(response.status).toBe(201)
    })
    it('should return a correct account ID', async () => {
        const response = await request(api.express)
            .post("/deposit/8d54f81a-f889-4a89-b64f-5f9a8abb84ed")
            .send({amount: 200.0})
        const deposit = response.body as DepositResponse
        expect(deposit.accountId).toBe("8d54f81a-f889-4a89-b64f-5f9a8abb84ed")
    })
    it('should return the correct amount', async () => {
        const response = await request(api.express)
            .post("/deposit/8d54f81a-f889-4a89-b64f-5f9a8abb84ed")
            .send({amount: 200.0})
        const deposit = response.body as DepositResponse
        expect(deposit.amount).toBe(200.0)
    })
    it('should return an updated balance', async () => {
        const response = await request(api.express)
            .post("/deposit/8d54f81a-f889-4a89-b64f-5f9a8abb84ed")
            .send({amount: 200.0})
        const deposit = response.body as DepositResponse
        expect(deposit.balance).toBe(1200.0)
    })
    afterEach(async () => {
        db.removeAccount("8d54f81a-f889-4a89-b64f-5f9a8abb84ed")
    })
})

describe('Deposits exceeding daily limits', () => {
    beforeEach(async () => {
        await db.addAccount("8d54f81a-f889-4a89-b64f-5f9a8abb84ed",
            1000.0, 5000.0)
    })
    it('should respond 400', async () => {
        const response = await request(api.express)
            .post("/deposit/8d54f81a-f889-4a89-b64f-5f9a8abb84ed")
            .send({amount: 200.0})
        expect(response.status).toBe(400)
    })
    it('should return a valid GenericError', async () => {
        const response = await request(api.express)
            .post("/deposit/8d54f81a-f889-4a89-b64f-5f9a8abb84ed")
            .send({amount: 200.0})
        expect(response.body).toEqual(expect.objectContaining({
            errorCode: expect.any(String),
            errorMessage: expect.any(String),
        }))
    })
    it('should return a depositLimitExceeded error', async () => {
        const response = await request(api.express)
            .post("/deposit/8d54f81a-f889-4a89-b64f-5f9a8abb84ed")
            .send({amount: 200.0})
        expect(response.body).toHaveProperty("errorCode")
        expect(response.body.errorCode).toBe("depositLimitExceeded")
    })
    afterEach(async () => {
        db.removeAccount("8d54f81a-f889-4a89-b64f-5f9a8abb84ed")
    })
})

describe('Deposits for non-existing accounts', () => {
    it('should respond 400', async () => {
        const response = await request(api.express)
            .post("/deposit/2bacbabe-03bf-4f31-a5cb-55aa7bf950a1")
            .send({amount: 200.0})
        expect(response.status).toBe(400)
    })
    it('should return a valid GenericError', async () => {
        const response = await request(api.express)
            .post("/deposit/2bacbabe-03bf-4f31-a5cb-55aa7bf950a1")
            .send({amount: 200.0})
        expect(response.body).toEqual(expect.objectContaining({
            errorCode: expect.any(String),
            errorMessage: expect.any(String),
        }))
    })
    it('should return an accountNotFound error', async () => {
        const response = await request(api.express)
            .post("/deposit/2bacbabe-03bf-4f31-a5cb-55aa7bf950a1")
            .send({amount: 200.0})
        expect(response.body).toHaveProperty("errorCode")
        expect(response.body.errorCode).toBe("accountNotFound")
    })
})

describe('GET Deposit', () => {
    it('should not be available', async () => {
        const response = await request(api.express)
            .get("/deposit/8d54f81a-f889-4a89-b64f-5f9a8abb84ed")
        expect(response.status).toBe(404)
    })
})

afterAll(done => {
    container.get(TOKENS.accountsApplication).shutdown()
    done()
})