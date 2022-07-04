import {ioc} from "../IoCContainer";
import {EmailsRepository} from "../repositories/mongo-db-with-mongoose/emails-repository";
import {TYPES} from "../types/ioc";
import {EmailType} from "../types/emails";
import {MongoMemoryServer} from "mongodb-memory-server";
import mongoose from "mongoose";
import {UsersService} from "./users-service";


describe('integration tests for EmailService', () => {

    let mongoServer: MongoMemoryServer

    const emailRepository = ioc.get<EmailsRepository>(TYPES.IEmailsRepository)
    const usersService = ioc.get<UsersService>(TYPES.IUsersService)

    const login = 'validLogin'
    const email = 'gleb.luk.go@gmail.com'
    const password = 'validPassword'

        beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create()
        const mongoUri = mongoServer.getUri()
        await mongoose.connect(mongoUri)

        const newUser = await usersService.createUser(login, email, password)
        expect.setState({newUser})
    })

    afterAll(async () => {
        await mongoose.disconnect()
        await mongoServer.stop()
    })

    it('getEmailForQueue', async () => {

        const emailInQueue = await emailRepository.getEmailFromQueue() as EmailType

        expect(emailInQueue.email).toBe(email)
        expect(emailInQueue.userLogin).toBe(login)
        expect(emailInQueue.status).toBe('pending')
        expect(emailInQueue.subject).toBe('registration')
        expect(emailInQueue.confirmationCode).not.toBeNull()
    })

    it('send email', async () => {

    })

})