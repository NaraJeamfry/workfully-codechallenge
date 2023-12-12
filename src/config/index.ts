import { createProdConfig } from "./envs/prod";
import { createTestConfig } from "./envs/testing";
import { createLocalConfig } from "./envs/local";

export const appConfig = getConfig();

function getConfig() {
    switch (process.env.APP_ENV) {
        case "production":
            return createProdConfig();
        case "test":
            return createTestConfig();
        case "local":
            return createLocalConfig();
        default:
            throw new Error(`APP_ENV is not valid: "${process.env.APP_ENV}"`);
    }
}