import {JWTService} from "../application/jwt-service";
import {Request, Response} from "express";


export class AuthController {
    constructor(private jwtService: JWTService) {
    }

    async login(req: Request, res: Response) {
        const {login, password} = req.body
        const token = await this.jwtService.createJWT(login, password)
        return token ? res.send({token}) : res.sendStatus(401)
    }
}