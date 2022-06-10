import {inject, injectable} from "inversify";
import {IAuthService} from "../presentation/AuthController";
import {TYPES} from "../types/ioc";
import {UserAccountDBType} from "../types/user";
import {IUsersRepository} from "./users-service";


@injectable()
export class AuthService implements IAuthService {
    constructor(@inject(TYPES.IUsersRepository) private usersRepository: IAuthRepository) {
    }

    async confirmEmail(code: string): Promise<boolean | null> {
        const confirmationDate = new Date()
        const user = await this.usersRepository.getUserByConfirmationCode(code)
        if (!user) {
            return null
        }
        const expirationDate = new Date(user.emailConfirmation.expirationDate)
        if (+confirmationDate > +expirationDate) {
            return null
        }
        return await this.usersRepository.confirmEmailRegistration(user)
    }

    async findOneUserByEmail(email: string): Promise<boolean> {
        return await this.usersRepository.findOneUserByEmail(email)
    }

    async findOneUserByLogin(login: string): Promise<boolean> {
        return await this.usersRepository.findOneUserByLogin(login)
    }

    // TODO: !
    async registrationEmailResending(email: string): Promise<boolean> {
        return true
    }


}


export interface IAuthRepository {
    getUserByConfirmationCode(code: string): Promise<UserAccountDBType | null>

    confirmEmailRegistration(user: UserAccountDBType): Promise<boolean>

    findOneUserByEmail(email: string): Promise<boolean>

    findOneUserByLogin(login: string): Promise<boolean>
}
