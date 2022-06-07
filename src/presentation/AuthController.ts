import {JWTService} from "../application/jwt-service";
import {Request, Response} from "express";
import {inject, injectable} from "inversify";
import {TYPES} from "../types/ioc";

@injectable()
export class AuthController {
    constructor(@inject(TYPES.JWTService)private jwtService: JWTService) {
    }

    async login(req: Request, res: Response) {
        const {login, password} = req.body
        const token = await this.jwtService.createJWT(login, password)
        return token ? res.send({token}) : res.sendStatus(401)
    }
}