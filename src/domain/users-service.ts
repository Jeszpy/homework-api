import {v4 as uuidv4} from 'uuid';
import {pagination, PaginationResultType} from "../application/pagination";
import * as argon2 from "argon2";
import {UserType, UserWithoutPasswordType} from "../types/user";
import {Filter} from "mongodb";
import {IUsersService} from "../presentation/UsersController";
import {inject, injectable} from "inversify";
import {TYPES} from "../IoCContainer";

@injectable()
export class UsersService implements IUsersService {
    constructor(@inject(TYPES.IUsersRepository)  private usersRepository: IUsersRepository) {
    }

    async getAllUsers(pageNumber: any, pageSize: any): Promise<PaginationResultType> {
        const users: UserWithoutPasswordType[] = await this.usersRepository.getAllUsers(pageNumber, pageSize)
        const totalCount = await this.usersRepository.getTotalCount({})
        return pagination(pageNumber, pageSize, totalCount, users)
    }

    async getOneUserById(id: string): Promise<UserWithoutPasswordType | null> {
        return await this.usersRepository.getOneUserById(id)
    }

    async createUser(login: string, password: string): Promise<UserWithoutPasswordType> {
        const hash = await argon2.hash(password);
        const newUser = {
            id: uuidv4(),
            login,
            password: hash
        }
        const createdUser = await this.usersRepository.createUser(newUser)
        return createdUser
    }

    async deleteUserById(id: string): Promise<boolean> {
        return await this.usersRepository.deleteUserById(id)
    }
}

export interface IUsersRepository {
    getAllUsers(pageNumber: number, pageSize: number): Promise<UserWithoutPasswordType[]>,

    getOneUserById(id: string): Promise<UserWithoutPasswordType | null>,

    createUser(newUser: UserType): Promise<UserWithoutPasswordType>,

    deleteUserById(id: string): Promise<boolean>,

    getTotalCount(filter: Filter<UserType>): Promise<number>,

    getOneUserForJWT(login: string): Promise<UserType | null>
}