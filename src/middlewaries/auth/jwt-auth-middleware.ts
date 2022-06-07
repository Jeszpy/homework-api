import {NextFunction, Request, Response} from "express";
import {UsersService} from "../../domain/users-service";
import {JWTService} from "../../application/jwt-service";
import {inject, injectable} from "inversify";
import {TYPES} from "../../types/ioc";

@injectable()
export class JWTAuthMiddleware {
    constructor(@inject(TYPES.JWTService)private jwtService: JWTService, @inject(TYPES.IUsersService) private usersService: UsersService) {
    }

    async use(req: Request, res: Response, next: NextFunction) {
        if (!req.headers.authorization) {
            return res.sendStatus(401)
        }

        const token = req.headers.authorization.split(' ')[1]
        const userId = await this.jwtService.getUserIdByToken(token)
        if (userId) {
            req.user = await this.usersService.getOneUserById(userId)
            return next()
        }
        return res.sendStatus(401)
    }

}