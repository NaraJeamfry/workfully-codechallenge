import { defineConfig } from "../defineConfig"
import Process from "process"

export function createLocalConfig() {
    return defineConfig({
        serverPort: Number(Process.env.PORT),
        databaseUrl: "./db/database.db",
        dailyDepositLimit: 5000.0,
        overdraftLimit: 200.0,
        environment: "local",
    })
}