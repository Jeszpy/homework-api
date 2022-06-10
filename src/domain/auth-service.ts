import {inject, injectable} from "inversify";
import {IAuthService} from "../presentation/AuthController";
import {TYPES} from "../types/ioc";
import {UserAccountDBType} from "../types/user";
import {v4 as uuidv4} from 'uuid';
import addMinutes from "date-fns/addMinutes";
import {EmailType} from "../types/emails";
import {IEmailsRepository} from "./users-service";

@injectable()
export class AuthService implements IAuthService {
    constructor(@inject(TYPES.IUsersRepository) private usersRepository: IAuthRepository, @inject(TYPES.IEmailsRepository) private emailsRepository: IEmailsRepository) {
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


    async registrationEmailResending(email: string): Promise<boolean> {
        const user = await this.usersRepository.getOneUserByEmail(email)
        if (user!.emailConfirmation.isConfirmed){
            return false
        }
        const newUserInfo: UserAccountDBType = {
            accountData: user!.accountData,
            emailConfirmation: {
                isConfirmed: user!.emailConfirmation.isConfirmed,
                confirmationCode: uuidv4(),
                expirationDate: addMinutes(new Date(), 3),
                sentEmails: user!.emailConfirmation.sentEmails
            },
            loginAttempts: user!.loginAttempts

        }
        await this.usersRepository.updateOneUserByEmail(email, newUserInfo)
        const emailInfo: EmailType = {
            id: uuidv4(),
            email,
            subject: 'registration-email-resending',
            userLogin: user!.accountData.login,
            confirmationCode: newUserInfo.emailConfirmation.confirmationCode,
            status: 'pending',
            createdAt: user!.accountData.createdAt
        }
        await this.emailsRepository.insertEmailToQueue(emailInfo)
        return true
    }


}


export interface IAuthRepository {
    getUserByConfirmationCode(code: string): Promise<UserAccountDBType | null>

    confirmEmailRegistration(user: UserAccountDBType): Promise<boolean>

    findOneUserByEmail(email: string): Promise<boolean>

    findOneUserByLogin(login: string): Promise<boolean>

    getOneUserByEmail(email:string): Promise<UserAccountDBType | null>

    updateOneUserByEmail(email:string, updateData: UserAccountDBType): Promise<boolean>
}
