import { Request, Response, NextFunction } from "express"
import { ApiError } from "../errors/generic"


export function handleApiError(err: any, req: Request, res: Response, next: NextFunction) {
    // If response is already sent, OR
    // If the error is NOT a valid ApiError
    if (res.headersSent || !(err instanceof ApiError)) {
        // Send to default error handler
        return next(err)
    }

    res.status(err.statusCode)
    res.json(err.getErrorSchema())
}