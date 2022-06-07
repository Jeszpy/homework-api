import {Request, Response} from "express";
import {PaginationResultType} from "../application/pagination";
import {UserWithoutPasswordType} from "../types/user";
import {inject, injectable} from "inversify";
import {TYPES} from "../IoCContainer";

@injectable()
export class UsersController {
    constructor(@inject(TYPES.IUsersService) private usersService: IUsersService) {
    }

    async getAllUsers(req: Request, res: Response) {
        const {pageNumber, pageSize} = req.query
        const users = await this.usersService.getAllUsers(pageNumber, pageSize)
        return res.send(users)
    }

    async createUser(req: Request, res: Response) {
        const {login, password} = req.body
        const newUser = await this.usersService.createUser(login, password)
        return res.status(201).send(newUser)
    }

    async deleteUserById(req: Request, res: Response) {
        const id = req.params.id
        const isUserDeleted = await this.usersService.deleteUserById(id)
        return isUserDeleted ? res.sendStatus(204) : res.sendStatus(404)
    }
}

export interface IUsersService {
    getAllUsers(pageNumber: any, pageSize: any): Promise<PaginationResultType>,

    createUser(login: string, password: string): Promise<UserWithoutPasswordType>,

    deleteUserById(id: string): Promise<boolean>,

    getOneUserById(userId: string): Promise<UserWithoutPasswordType | null>
}