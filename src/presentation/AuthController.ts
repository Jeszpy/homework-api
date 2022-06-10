import {JWTService} from "../application/jwt-service";
import {Request, Response} from "express";
import {inject, injectable} from "inversify";
import {TYPES} from "../types/ioc";
import {IUsersService} from "./UsersController";

const returnErrorMessage = (field: string) => {
    return {
        "errorsMessages": [
            {
                "message": `this ${field} has already been created`,
                "field": field
            }
        ]
    }
}

const registrationCodeConfirmErrorMessage = () => {
    return {
        "errorsMessages": [
            {
                "message": 'this email has already been confirmed',
                "field": 'email'
            }
        ]
    }
}


@injectable()
export class AuthController {
    constructor(@inject(TYPES.JWTService) private jwtService: JWTService, @inject(TYPES.IUsersService) private usersService: IUsersService, @inject(TYPES.IAuthService) private authService: IAuthService) {
    }


    async registrationEmailResending(req: Request, res: Response){
        const {email} = req.body
        const emailInDB = await this.authService.findOneUserByEmail(email)
        if (emailInDB) {
            return res.status(400).send(returnErrorMessage('email'))
        }
        const isResend = await this.authService.registrationEmailResending(email)
        return isResend ? res.sendStatus(204) : res.status(400).send(registrationCodeConfirmErrorMessage)
    }




    async login(req: Request, res: Response) {
        const {login, password} = req.body
        const token = await this.jwtService.createJWT(login, password)
        return token ? res.send({token}) : res.sendStatus(401)
    }

    async registration(req: Request, res: Response) {
        const {login, email, password} = req.body
        const emailInDB = await this.authService.findOneUserByEmail(email)
        if (emailInDB) {
            return res.status(400).send(returnErrorMessage('email'))
        }
        const loginInDB = await this.authService.findOneUserByLogin(login)
        if (loginInDB) {
            return res.status(400).send(returnErrorMessage('login'))
        }
        const user = await this.usersService.createUser(login, email, password)
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

    findOneUserByLogin(login: string): Promise<boolean>

    findOneUserByEmail(email: string): Promise<boolean>

    registrationEmailResending(email: string): Promise<boolean>
}