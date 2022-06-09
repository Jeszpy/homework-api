import {NextFunction, Request, Response} from "express";
import {validationResult} from "express-validator";


export const inputValidatorMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req)
    if (errors.isEmpty()) {
        next()
    } else {
        const errorsOccurred = errors.array({onlyFirstError: true}).map(e => {
            return {
                message: e.msg,
                field: e.param
            }
        })
        return res.status(400).json(
            {
                "errorsMessages": errorsOccurred
            }
        )
    }
}
