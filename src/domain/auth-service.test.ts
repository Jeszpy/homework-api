import {AuthService} from "./auth-service";
import {ioc} from "../IoCContainer";
import {TYPES} from "../types/ioc";
import {UsersService} from "./users-service";
import {MongoMemoryServer} from "mongodb-memory-server";
import mongoose from "mongoose";
import {EmailsRepository} from "../repositories/mongo-db-with-mongoose/emails-repository";
import {JWTService} from "../application/jwt-service";
import {EmailType} from "../types/emails";
import {UserInfoType} from "../types/user";

describe('integration tests for AuthService', () => {

    let mongoServer: MongoMemoryServer

    const usersService = ioc.get<UsersService>(TYPES.IUsersService)
    const jwtService = ioc.get<JWTService>(TYPES.JWTService)
    const authService = ioc.get<AuthService>(TYPES.IAuthService)
    const emailRepository = ioc.get<EmailsRepository>(TYPES.IEmailsRepository)

    const login = 'validLogin'
    const email = 'gleb.luk.go@gmail.com'
    const password = 'validPassword'
    const newLogin = 'validLogin1'
    const newEmail = 'hleb.lukashonak@gmail.com'
    let confirmationCode = ''

    beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create()
        const mongoUri = mongoServer.getUri()
        await mongoose.connect(mongoUri)

        const newUser = await usersService.createUser(login, email, password)
        expect.setState({newUser})
    })

    let accessToken: string
    let refreshToken: string

    describe('createUser && getUserInfoById', () => {

        it('createUser and getUserInfoById', async () => {

            const newUser = expect.getState().newUser
            expect(newUser).not.toBeUndefined()

            const userId = newUser.id
            const createdUser = await usersService.getUserInfoById(userId) as UserInfoType

            expect(createdUser.login).toBe(login)
            expect(createdUser.email).toBe(email)

        })

        it('should return error because user.login not unique', async () => {
            const newUser = await usersService.createUser(login, newEmail, password)
            expect(newUser).toBeNull()
        })

        it('should return error because user.email not unique', async () => {
            const newUser = await usersService.createUser(newLogin, email, password)
            expect(newUser).toBeNull()
        })
    })

    describe('login', () => {


        it('should return access and refresh tokens', async () => {

            const tokens = await jwtService.createJWT(login, password)
            if (!tokens) throw Error
            accessToken = tokens.accessToken
            refreshToken = tokens.refreshToken

            expect(tokens).not.toBeNull()

        });
    })

    describe('getNewRefreshToken', () => {

        it('should return unique tokens', async () => {


            const tokens = await jwtService.createJWT(login, password)

            const oldTokens = await jwtService.getNewRefreshToken(tokens!.refreshToken)
            const newTokens = await jwtService.getNewRefreshToken(oldTokens!.refreshToken)

            expect(oldTokens).not.toBeNull()
            expect(newTokens).not.toBeNull()
            expect(newTokens!.accessToken).not.toStrictEqual(oldTokens!.accessToken)
            expect(newTokens!.refreshToken).not.toStrictEqual(oldTokens!.refreshToken)

            const wrongJwtToken = await jwtService.getNewRefreshToken('wrongJwtToken')
            expect(wrongJwtToken).toBeNull()

            const blockedToken = await jwtService.getNewRefreshToken(oldTokens!.refreshToken)
            expect(blockedToken).toBeNull()


        });
    })

    describe('confirmEmail', () => {
        it('should return false for unconfirmed code', async () => {
            const email = await emailRepository.getEmailFromQueue() as EmailType
            confirmationCode = email.confirmationCode

            const isCodeConfirmed = await authService.isCodeConfirmed(confirmationCode)
            expect(isCodeConfirmed).toBeFalsy()
        });

        it('should return error for invalid confirmation code', async () => {
            const invalidConfirmationCode = 'badConfirmationCode'

            const invalidConfirmEmail = await authService.confirmEmail(invalidConfirmationCode)
            expect(invalidConfirmEmail).toBeNull()

        });

        it('confirmEmail', async () => {
            const confirmEmail = await authService.confirmEmail(confirmationCode)
            expect(confirmEmail).toBeTruthy()
        })

        it('should return true for confirmed code', async () => {
            const isCodeConfirmed = await authService.isCodeConfirmed(confirmationCode)
            expect(isCodeConfirmed).toBeTruthy()
        });
    })

    describe('registrationEmailResending', () => {
        it('should return error because email no in DB', async () => {
            const registrationEmailResending = await authService.registrationEmailResending(newEmail)
            expect(registrationEmailResending).toBeFalsy()
        })

        it('should return false because code already confirmed', async () => {
            const registrationEmailResending = await authService.registrationEmailResending(email)
            expect(registrationEmailResending).toBeFalsy()
        })
        it('should return true for new user/confirmationCode', async () => {
            const regEmail = 'newEmail@gmail.com'
            const newUser = await usersService.createUser('login', regEmail, 'password')
            expect(newUser).not.toBeNull()

            const email = await emailRepository.getEmailFromQueue() as EmailType
            const newConfirmationCode = email.confirmationCode
            expect(newConfirmationCode).not.toStrictEqual(confirmationCode)

            const registrationEmailResending = await authService.registrationEmailResending(regEmail)
            expect(registrationEmailResending).toBeTruthy()
        })


    })
    afterAll(async () => {
        await mongoose.disconnect()
        await mongoServer.stop()
    })
})

