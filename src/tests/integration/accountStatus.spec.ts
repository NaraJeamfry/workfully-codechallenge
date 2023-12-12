import { AccountWebApi } from "../../api/AccountWebApi"
import { container } from "../../app/container"
import { TOKENS } from "../../app/container.types"
import request from "supertest"
import { AccountRepositoryMock } from "../mocks/AccountRepositoryMock"
import { components } from "../../api/schema"

type AccountStatusResponse = components["schemas"]["AccountStatus"]

container.bind(TOKENS.accountRepository).toInstance(AccountRepositoryMock).inSingletonScope()
const api = container.get(TOKENS.accountsApi) as AccountWebApi
const db = container.get(TOKENS.accountRepository) as AccountRepositoryMock
container.get(TOKENS.accountsApplication).init()

describe('Successful account status', () => {
    beforeEach(async () => {
        // Initialize mocked account
        await db.addAccount("e2c9012e-9638-4b56-9863-76424d5200c4", 1500.0,
            200.0)
    })
    it('should respond 200', async () => {
        const response = await request(api.express)
            .get("/account/e2c9012e-9638-4b56-9863-76424d5200c4")
        expect(response.status).toBe(200)
    })
    it('should have the correct ID', async () => {
        const response = await request(api.express)
            .get("/account/e2c9012e-9638-4b56-9863-76424d5200c4")
        const account = response.body as AccountStatusResponse
        expect(account.accountId).toBe("e2c9012e-9638-4b56-9863-76424d5200c4")
    })
    it('should have the correct balance', async () => {
        const response = await request(api.express)
            .get("/account/e2c9012e-9638-4b56-9863-76424d5200c4")
        const account = response.body as AccountStatusResponse
        expect(account.balance).toBe(1500.0)
    })
    it('should have the correct deposited today', async () => {
        const response = await request(api.express)
            .get("/account/e2c9012e-9638-4b56-9863-76424d5200c4")
        const account = response.body as AccountStatusResponse
        expect(account.depositedToday).toBe(200.0)
    })
    it('should have the correct limits', async () => {
        const response = await request(api.express)
            .get("/account/e2c9012e-9638-4b56-9863-76424d5200c4")
        const account = response.body as AccountStatusResponse
        expect(account.limits).toStrictEqual({
            dailyDeposit: 5000.0,
            overdraft: 200.0
        })
    })
    afterEach(async () => {
        // Remove mocked account to prevent issues and wrong results
        db.removeAccount("e2c9012e-9638-4b56-9863-76424d5200c4")
    })
})

describe('Missing account', () => {
    it('should return error 400', async () => {
        const response = await request(api.express)
            .get("/account/e2c9012e-9638-4b56-9863-76424d5200c4")
        expect(response.status).toBe(400)
    })
})

describe('Account Status POST', () => {
    it('should not be available', async () => {
        const response = await request(api.express)
            .post("/account/e2c9012e-9638-4b56-9863-76424d5200c4")
        expect(response.status).toBe(404)
    })
})

afterAll((done) => {
    container.get(TOKENS.accountsApplication).shutdown()
    done()
})