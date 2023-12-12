export type AppConfig = {
    serverPort: number;
    dailyDepositLimit: number;
    overdraftLimit: number;
    environment: "prod" | "test" | "local";
}