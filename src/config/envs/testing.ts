import { defineConfig } from "../defineConfig";
import Process from "process";

export function createTestConfig() {
    return defineConfig({
        serverPort: 0, // run in a random unused port
        dailyDepositLimit: 5000.0,
        overdraftLimit: 200.0,
        environment: "test",
    });
}