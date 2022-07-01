import {AuthService} from "./auth-service";
import {ioc} from "../IoCContainer";
import {TYPES} from "../types/ioc";
import {UsersService} from "./users-service";
import {MongoMemoryServer} from "mongodb-memory-server";
import mongoose from "mongoose";
import {EmailsRepository} from "../repositories/mongo-db-with-mongoose/emails-repository";
import {JWTService} from "../application/jwt-service";

describe('integration tests for AuthService', () => {

    let mongoServer: MongoMemoryServer

    const authService = ioc.get<AuthService>(TYPES.IAuthService)
    const usersService = ioc.get<UsersService>(TYPES.IUsersService)
    const emailRepository = ioc.get<EmailsRepository>(TYPES.IEmailsRepository)
    const jwtService = ioc.get<JWTService>(TYPES.JWTService)

    beforeAll(async () => {
        // TODO: добавить тестовые данные
        mongoServer = await MongoMemoryServer.create()
        const mongoUri = mongoServer.getUri()
        await mongoose.connect(mongoUri)
    })

    const login = 'validLogin'
    const email = 'gleb.luk.go@gmail.com'
    const password = 'validPassword'

    let accessToken: string
    let refreshToken: string
    let oldRefreshToken: string

    const createUser = async () => {
        const newUser = await usersService.createUser(login, email, password)
        if (!newUser) throw Error
        return newUser
    }


    describe('createUser && getUserInfoById && getEmailForQueue for sending ', () => {

        it('createUser and getUserInfoById', async () => {

            // create new user | returns 'id', 'login'
            const newUser = await createUser()
            // get new user from db by ID | returns 'UserIdAndLoginType'
            const userId = newUser.id
            const createdUser = await usersService.getUserInfoById(userId)
            if (!createdUser) throw Error

            expect(createdUser.login).toBe(login)
            expect(createdUser.email).toBe(email)

        })


        // TODO: дописать инсэрт емэйла
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


    describe('login', () => {


        it('should return access and refresh tokens', async () => {
            await createUser()
            const tokens = await jwtService.createJWT(login, password)
            if (!tokens) throw Error
            accessToken = tokens.accessToken
            refreshToken = tokens.refreshToken

            expect(tokens).not.toBeNull()

        });

        it('should return unique tokens', async () => {

            await createUser()
            const tokens = await jwtService.createJWT(login, password)

            const oldTokens = await jwtService.getNewRefreshToken(tokens!.refreshToken)
            const newTokens = await jwtService.getNewRefreshToken(oldTokens!.refreshToken)


            expect(oldTokens).not.toBeNull()
            expect(newTokens).not.toBeNull()
            expect(newTokens!.accessToken).not.toStrictEqual(oldTokens!.accessToken)
            expect(newTokens!.refreshToken).not.toStrictEqual(oldTokens!.refreshToken)

        });

    })

    describe('getNewRefreshToken', () => {

    })

    // describe('refresh-token endpoint', () => {
    //
    //     const jwtService = ioc.get<JWTService>(TYPES.JWTService)
    //
    //     let accessToken
    //     let refreshToken
    //
    //     it('should return new access and refresh tokens', async () => {
    //         const tokens = await jwtService.createJWT(login, password)
    //
    //
    //         expect(tokens).not.toBeNull()
    //
    //     })
    // })


    // afterAll(async () => {
    //     await mongoose.disconnect()
    // })
})

