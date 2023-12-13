import { defineConfig } from "../defineConfig"

export function createTestConfig() {
    return defineConfig({
        serverPort: 0, // run in a random unused port
        databaseUrl: "./database.db",
        dailyDepositLimit: 5000.0,
        overdraftLimit: 200.0,
        environment: "test",
    })
}