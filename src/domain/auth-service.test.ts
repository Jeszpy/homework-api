import {AuthService} from "./auth-service";
import {UsersRepository} from "../repositories/mongo-db-with-mongoose/users-repository";
import {EmailsModel, UsersModel} from "../repositories/mongo-db-with-mongoose/models";
import {ioc} from "../IoCContainer";
import {TYPES} from "../types/ioc";
import {UsersService} from "./users-service";
import {MongoMemoryServer} from "mongodb-memory-server";

describe('integration tests for AuthService', () => {



    describe('createUser', () => {

        let mongoServer: MongoMemoryServer

        beforeAll(async () => {
            mongoServer = await MongoMemoryServer.create()
        })

        // const m

        const authService = ioc.get<AuthService>(TYPES.IAuthService)
        const usersService = ioc.get<UsersService>(TYPES.IUsersService)

        const login = 'validLogin'
        const email = 'hleb.lukashonak@yandex.ru'
        const password = 'validPassword'

        it('should return', async () => {

            const newUser = await usersService.createUser(login, email, password)

            expect(newUser!.login).toBe(login)
        })

    })
})

