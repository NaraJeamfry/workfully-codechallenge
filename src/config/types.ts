export type AppConfig = {
    serverPort: number
    databaseUrl: string
    dailyDepositLimit: number
    overdraftLimit: number
    environment: "prod" | "test" | "local"
}