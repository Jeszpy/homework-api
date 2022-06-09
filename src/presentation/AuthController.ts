import {JWTService} from "../application/jwt-service";
import {Request, Response} from "express";
import {inject, injectable} from "inversify";
import {TYPES} from "../types/ioc";
import {IUsersService} from "./UsersController";

@injectable()
export class AuthController {
    constructor(@inject(TYPES.JWTService) private jwtService: JWTService, @inject(TYPES.IUsersService) private usersService: IUsersService, @inject(TYPES.IAuthService) private authService: IAuthService) {
    }

    async login(req: Request, res: Response) {
        const {login, password} = req.body
        const token = await this.jwtService.createJWT(login, password)
        return token ? res.send({token}) : res.sendStatus(401)
    }

    async registration(req: Request, res: Response) {
        const {login, email, password} = req.body
        const user = await this.usersService.createUser(login, email, password)
        // 400 ?
        return user ? res.sendStatus(204) : res.sendStatus(400)

    }

    async confirmEmail(req: Request, res: Response) {
        const {code} = req.body
        const isConfirm = await this.authService.confirmEmail(code)
        return isConfirm ? res.sendStatus(204) : res.sendStatus(400)
    }
}

export interface IAuthService {
    confirmEmail(code: string): Promise<boolean | null>
}