import {NextFunction, Request, Response} from "express";
import {injectable} from "inversify";

const basicAuthParser = require('basic-auth-parser');


@injectable()
export class BasicAuthMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        if (req.headers.authorization) {
            const {username, password} = (basicAuthParser(req.headers.authorization));
            if (username === 'admin' && password === 'qwerty') {
                return next()
            } else {
                return res.sendStatus(401)
            }
        } else {
            return res.sendStatus(401)
        }
    }
}