import {UserType, UserWithoutPasswordType} from "../types/user";
import * as MongoClient from "mongodb";
import {IUsersRepository} from "../domain/users-service";
import {Filter} from "mongodb";
import {injectable} from "inversify";

@injectable()
export class UsersRepository implements IUsersRepository{
    constructor(private usersCollection: MongoClient.Collection<UserType>) {
    }

    async getOneUserForJWT(login: string): Promise<UserType | null> {
        return await this.usersCollection.findOne({login})
    }

    async getOneUserById(id: string): Promise<UserWithoutPasswordType | null> {
        return await this.usersCollection.findOne({id})
    }

    async getAllUsers(pageNumber: number, pageSize: number): Promise<UserWithoutPasswordType[]> {
        const allUsers = await this.usersCollection.find({}, {
            projection: {_id: false, password: false},
            skip: ((pageNumber - 1) * pageSize),
            limit: (pageSize)
        }).toArray()
        return allUsers
    }

    async createUser(newUser: UserType): Promise<UserWithoutPasswordType> {
            await this.usersCollection.insertOne({...newUser})
            return {
                id: newUser.id,
                login: newUser.login
            }
    }

    async deleteUserById(id: string): Promise<boolean> {
        const isUserDeleted = await this.usersCollection.deleteOne({id})
        return isUserDeleted.deletedCount === 1
    }

    async getTotalCount(filter: Filter<UserType>): Promise<number> {
        return this.usersCollection.countDocuments(filter)
    }
}