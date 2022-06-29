import {AuthService} from "./auth-service";
import {ioc} from "../IoCContainer";
import {TYPES} from "../types/ioc";
import {UsersService} from "./users-service";
import {MongoMemoryServer} from "mongodb-memory-server";
import mongoose from "mongoose";
import {EmailsRepository} from "../repositories/mongo-db-with-mongoose/emails-repository";

describe('integration tests for AuthService', () => {



    describe('createUser && getUserInfoById && getEmailForQueue for sending ', () => {

        let mongoServer: MongoMemoryServer

        beforeAll(async () => {
            mongoServer = await MongoMemoryServer.create()
            const mongoUri = mongoServer.getUri()
            await mongoose.connect(mongoUri)
        })

        const authService = ioc.get<AuthService>(TYPES.IAuthService)
        const usersService = ioc.get<UsersService>(TYPES.IUsersService)
        const emailRepository = ioc.get<EmailsRepository>(TYPES.IEmailsRepository)

        const login = 'validLogin'
        const email = 'hleb.lukashonak@yandex.ru'
        const password = 'validPassword'

        it('createUser and getUserInfoById', async () => {

            // create new user | returns 'id', 'login'
            const newUser = await usersService.createUser(login, email, password)
            if (!newUser) throw Error
            // get new user from db by ID | returns 'UserIdAndLoginType'
            const userId = newUser.id
            const createdUser = await usersService.getUserInfoById(userId)
            if (!createdUser) throw Error

            expect(createdUser.login).toBe(login)
            expect(createdUser.email).toBe(email)

        })

        it('getEmailForQueue', async () => {

            const emailInQueue = await emailRepository.getEmailFromQueue()
            if (!emailInQueue) throw Error

            expect(emailInQueue.email).toBe(email)
            expect(emailInQueue.userLogin).toBe(login)
            expect(emailInQueue.status).toBe('pending')
            expect(emailInQueue.subject).toBe('registration')
            expect(emailInQueue.confirmationCode).not.toBeNull()
        })
    })
})

