import {JWTService} from "../application/jwt-service";
import {Request, Response} from "express";
import {inject, injectable} from "inversify";
import {TYPES} from "../types/ioc";
import {IUsersService} from "./UsersController";
import {UserAccountDBType} from "../types/user";


@injectable()
export class AuthController {
    constructor(@inject(TYPES.JWTService) private jwtService: JWTService, @inject(TYPES.IUsersService) private usersService: IUsersService, @inject(TYPES.IAuthService) private authService: IAuthService) {
    }

    private registrationEmailResendingErrorMessage = () => {
        return {
            "errorsMessages": [
                {
                    "message": 'user with this email was not found',
                    "field": 'email'
                }
            ]
        }
    }

    private codeAlreadyConfirmedError = () => {
        return {
            "errorsMessages": [
                {
                    "message": 'this confirmation code has already been confirmed',
                    "field": 'code'
                }
            ]
        }
    }

    private invalidConfirmationCodeError = () => {
        return {
            "errorsMessages": [
                {
                    "message": 'this confirmation code invalid',
                    "field": 'code'
                }
            ]
        }
    }

    private returnErrorMessage = (field: string) => {
        return {
            "errorsMessages": [
                {
                    "message": `this ${field} has already been created`,
                    "field": field
                }
            ]
        }
    }

    private registrationCodeConfirmErrorMessage = () => {
        return {
            "errorsMessages": [
                {
                    "message": 'this email has already been confirmed',
                    "field": 'email'
                }
            ]
        }
    }

    async registrationEmailResending(req: Request, res: Response) {
        const {email} = req.body
        const emailInDB = await this.authService.findOneUserByEmail(email)
        if (!emailInDB) {
            return res.status(400).send(this.registrationEmailResendingErrorMessage())
        }
        const isResend = await this.authService.registrationEmailResending(email)
        return isResend ? res.sendStatus(204) : res.status(400).send(this.registrationCodeConfirmErrorMessage())
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
            return res.status(400).send(this.returnErrorMessage('email'))
        }
        const loginInDB = await this.authService.findOneUserByLogin(login)
        if (loginInDB) {
            return res.status(400).send(this.returnErrorMessage('login'))
        }
        const user = await this.usersService.createUser(login, email, password)
        return user ? res.sendStatus(204) : res.sendStatus(400)

    }

    async confirmEmail(req: Request, res: Response) {
        const {code} = req.body
        const codeInDB = await this.authService.findCodeInDB(code)
        if (!codeInDB) {
            return res.status(400).send(this.invalidConfirmationCodeError())
        }
        if (codeInDB.emailConfirmation.isConfirmed) {
            return res.status(400).send(this.codeAlreadyConfirmedError())
        }
        const confirm = await this.authService.confirmEmail(code)
        return confirm ? res.sendStatus(204) : res.sendStatus(400)
    }


    // TODO: make route and logic for refresh token
}

export interface IAuthService {
    confirmEmail(code: string): Promise<boolean | null>

    findOneUserByLogin(login: string): Promise<boolean>

    findOneUserByEmail(email: string): Promise<boolean>

    registrationEmailResending(email: string): Promise<boolean>

    isCodeConfirmed(code: string): Promise<boolean>

    findCodeInDB(code: string): Promise<UserAccountDBType | null>
}