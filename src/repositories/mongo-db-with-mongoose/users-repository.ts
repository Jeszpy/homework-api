import {inject, injectable} from "inversify";
import {IUsersRepository} from "../../domain/users-service";
import {IAuthRepository} from "../../domain/auth-service";
import {UserAccountDBType, UserAccountType, UserIdAndLoginType, UserInfoType} from "../../types/user";
import * as mongoose from "mongoose";
import {FilterQuery} from "mongoose";
import {TYPES} from "../../types/ioc";

@injectable()
export class UsersRepository implements IUsersRepository, IAuthRepository {
    constructor(@inject(TYPES.UsersModel) private usersCollection: mongoose.Model<UserAccountDBType>) {
    }

    async getOneUserForJWT(login: string): Promise<UserAccountType | null> {
        const user = await this.usersCollection.findOne({"accountData.login": login})
        if (!user) {
            return null
        }
        return user.accountData
    }

    async getOneUserById(id: string): Promise<UserIdAndLoginType | null> {
        const user = await this.usersCollection.findOne({'accountData.id': id})
        if (!user) {
            return null
        }
        return {
            id: user.accountData.id,
            login: user.accountData.login
        }
    }

    async getAllUsers(pageNumber: number, pageSize: number): Promise<UserIdAndLoginType[]> {
        const allUsers = await this.usersCollection.find({},).skip((pageNumber - 1) * pageSize).limit(pageSize)
        return allUsers.map(u => ({id: u.accountData.id, login: u.accountData.login}))
    }

    async createUser(newUser: UserAccountDBType): Promise<UserIdAndLoginType> {
        await this.usersCollection.create({...newUser})
        return {
            id: newUser.accountData.id,
            login: newUser.accountData.login
        }
    }

    async deleteUserById(id: string): Promise<boolean> {
        const isUserDeleted = await this.usersCollection.deleteOne({accountData: id})
        return isUserDeleted.deletedCount === 1
    }

    async getTotalCount(filter: FilterQuery<UserAccountDBType>): Promise<number> {
        return this.usersCollection.countDocuments(filter)
    }


    async getUserByConfirmationCode(code: string): Promise<UserAccountDBType | null> {
        return this.usersCollection.findOne({"emailConfirmation.confirmationCode": code})
    }

    async confirmEmailRegistration(user: UserAccountDBType): Promise<boolean> {
        const result = await this.usersCollection.updateOne({"emailConfirmation.confirmationCode": user.emailConfirmation.confirmationCode}, {
            $set: {"emailConfirmation.isConfirmed": true}
        })
        return result.modifiedCount === 1
    }

    async findOneUserByEmail(email: string): Promise<boolean> {
        const user = await this.usersCollection.findOne({"accountData.email": email})
        return !!user
    }

    async findOneUserByLogin(login: string,): Promise<boolean> {
        const user = await this.usersCollection.findOne({"accountData.login": login})
        return !!user
    }

    async getOneUserByEmail(email: string): Promise<UserAccountDBType | null> {
        return this.usersCollection.findOne({"accountData.email": email})
    }

    async updateOneUserByEmail(email: string, updateData: UserAccountDBType): Promise<boolean> {
        const result = await this.usersCollection.updateOne({"accountData.email": email}, {$set: {...updateData}})
        return result.modifiedCount === 1
    }

    async findCodeInDB(code: string): Promise<UserAccountDBType | null> {
        const res = await this.usersCollection.findOne({'emailConfirmation.confirmationCode': code})
        return res ? res : null
    }

    async getUserInfoById(userId: string): Promise<UserAccountDBType | null> {
        return this.usersCollection.findOne({"accountData.id": userId})
    }
}