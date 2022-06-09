import {v4 as uuidv4} from 'uuid';
import {pagination, PaginationResultType} from "../application/pagination";
import * as argon2 from "argon2";
import {UserAccountDBType, UserAccountType, UserIdAndLoginType} from "../types/user";
import {Filter} from "mongodb";
import {IUsersService} from "../presentation/UsersController";
import {inject, injectable} from "inversify";
import {TYPES} from "../types/ioc";
import addMinutes from 'date-fns/addMinutes';

@injectable()
export class UsersService implements IUsersService {
    constructor(@inject(TYPES.IUsersRepository) private usersRepository: IUsersRepository, @inject(TYPES.IEmailsRepository) private emailsRepository: IEmailsRepository) {
    }

    async getAllUsers(pageNumber: any, pageSize: any): Promise<PaginationResultType> {
        const users: UserIdAndLoginType[] = await this.usersRepository.getAllUsers(pageNumber, pageSize)
        const totalCount = await this.usersRepository.getTotalCount({})
        return pagination(pageNumber, pageSize, totalCount, users)
    }

    async getOneUserById(id: string): Promise<UserIdAndLoginType | null> {
        return await this.usersRepository.getOneUserById(id)
    }

    async createUser(login: string, email: string, password: string): Promise<UserIdAndLoginType> {
        const hash = await argon2.hash(password);
        const newUser: UserAccountDBType = {
            accountData: {
                id: uuidv4(),
                login,
                password: hash,
                createdAt: new Date()
            },
            loginAttempts: [],
            emailConfirmation: {
                sentEmails: [],
                confirmationCode: uuidv4(),
                expirationDate: addMinutes(new Date(), 3),
                isConfirmed: false
            }

        }
        console.log(newUser.emailConfirmation.confirmationCode)
        const user = await this.usersRepository.createUser(newUser)
        await this.emailsRepository.insertEmailToQueue(email, 'registration', user.login, newUser.emailConfirmation.confirmationCode)
        return user

    }

    async deleteUserById(id: string): Promise<boolean> {
        return await this.usersRepository.deleteUserById(id)
    }
}

export interface IUsersRepository {
    getAllUsers(pageNumber: number, pageSize: number): Promise<UserIdAndLoginType[]>,

    getOneUserById(id: string): Promise<UserIdAndLoginType | null>,

    createUser(newUser: UserAccountDBType): Promise<UserIdAndLoginType>,

    deleteUserById(id: string): Promise<boolean>,

    getTotalCount(filter: Filter<UserAccountDBType>): Promise<number>,

    getOneUserForJWT(login: string): Promise<UserAccountType | null>
}

export interface IEmailsRepository {
    insertEmailToQueue(email: string, topic: string, userLogin: string, confirmationCode: string): Promise<boolean>
}