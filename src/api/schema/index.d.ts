import { components } from "./schema"

// Errors
type GenericError = components["schema"]["GenericError"]

// Requests

// Responses
type AccountStatusResponse = components["schemas"]["AccountStatus"]
type DepositResponse = components["schemas"]["Deposit"]
type TransferResponse = components["schemas"]["Transfer"]
type WithdrawResponse = components["schemas"]["Withdrawal"]