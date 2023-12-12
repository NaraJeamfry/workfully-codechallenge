import { defineConfig } from "../defineConfig";
import Process from "process";

export function createProdConfig() {
    return defineConfig({
        serverPort: Number(Process.env.PORT),
        dailyDepositLimit: 5000.0,
        overdraftLimit: 200.0,
        environment: "prod",
    });
}