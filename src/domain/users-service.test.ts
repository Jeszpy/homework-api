import {MongoMemoryServer} from "mongodb-memory-server";
import {ioc} from "../IoCContainer";
import {TYPES} from "../types/ioc";
import mongoose from "mongoose";
import {UsersService} from "./users-service";

describe('integration tests for UsersService', () => {

    let mongoServer: MongoMemoryServer

    const usersService = ioc.get<UsersService>(TYPES.IUsersService)

    const login = 'login'
    const email = 'email@google.com'
    const password = 'password'
    const newLogin = 'newLogin'
    const newEmail = 'newEmail@google.com'
    const newPassword = 'newPassword'

    let userId: string

    beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create()
        const mongoUri = mongoServer.getUri()
        await mongoose.connect(mongoUri)

        const newUser = await usersService.createUser(login, email, password)
        expect(newUser).not.toBeNull()
        userId = newUser!.id
        expect.setState({newUser: newUser})
    })


    afterAll(async () => {
        await mongoose.disconnect()
        await mongoServer.stop()
    })

    describe('getAllUsers', () => {
        it('should return null because user login not unique', async () => {
            await usersService.createUser(login, newEmail, newPassword)
            const users = await usersService.getAllUsers(1, 10)
            expect(users.items.length).toStrictEqual(1)
        });

        it('should return null because user email not unique', async () => {
            await usersService.createUser(newLogin, email, newPassword)
            const users = await usersService.getAllUsers(1, 10)
            expect(users.items.length).toStrictEqual(1)
        });

        it('should return all users count', async () => {
            for (let i = 0; i < 9; i++){
                await usersService.createUser(`login${i}`,`email${i}`, password)
            }
            const users = await usersService.getAllUsers(1, 10)
            expect(users.items.length).toStrictEqual(10)
        });
        it('should return all users count with pagination', async () => {
            const users = await usersService.getAllUsers(1, 3)
            expect(users.items.length).toStrictEqual(3)
        });
    })

    describe('getOneUserById', () => {
        it('should return one user by id', async () => {
            const user = await usersService.getOneUserById(userId)
            expect(user).not.toBeNull()
            expect(user!.login).toStrictEqual(login)
        });
        it('should return null for invalid id', async () => {
            const user = await usersService.getOneUserById('userId')
            expect(user).toBeNull()
        });
    })

    describe('deleteUserById', () => {
        it('should return users count after delete', async () => {
            for (let i = 0; i < 9; i++){
                await usersService.createUser(`login${i}`,`email${i}`, password)
            }
            const users = await usersService.getAllUsers(1, 15)
            expect(users.items.length).toStrictEqual(10)
            for (let i = 0; i < users.items.length; i++){
                await usersService.deleteUserById(users.items[i].id)
            }
            const usersAfterDelete = await usersService.getAllUsers(1, 15)
            expect(usersAfterDelete.items.length).toStrictEqual(0)
        });
    })

})