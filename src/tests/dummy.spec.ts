import request from "supertest";
import { container } from "../app/container";
import { TOKENS } from "../app/container.types";
import { AccountWebApi } from "../api/AccountWebApi";

const api = container.get(TOKENS.accountsApi) as AccountWebApi

describe('Dummy Test', () => {
    it('should be OK', () => {
        expect(true).toBe(true);
    });
    it('should respond 200', async () => {
        const response = await request(api.express).get("/dummy");
        expect(response.status).toBe(200);
    });
});

afterAll(done => {
    api.stop();
    done();
})