import isEqual from "date-fns/isEqual";
import {inject, injectable} from "inversify";
import {IAuthService} from "../presentation/AuthController";
import {TYPES} from "../types/ioc";
import {UserAccountDBType} from "../types/user";


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
}

export interface IAuthRepository {
    getUserByConfirmationCode(code: string): Promise<UserAccountDBType | null>

    confirmEmailRegistration(user: UserAccountDBType): Promise<boolean>
}
