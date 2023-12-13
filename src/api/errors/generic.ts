import { GenericError } from "../schema"


export class ApiError extends Error {
    statusCode: number
    errorCode: string

    constructor(m: string) {
        super(m)

        Object.setPrototypeOf(this, ApiError.prototype)
    }

    getErrorSchema() {
        return {
            errorCode: this.errorCode,
            errorMessage: this.message
        } as GenericError
    }
}