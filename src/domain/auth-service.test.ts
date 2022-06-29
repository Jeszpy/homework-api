import {AuthService} from "./auth-service";
import {UsersRepository} from "../repositories/mongo-db-with-mongoose/users-repository";
import {EmailsModel, UsersModel} from "../repositories/mongo-db-with-mongoose/models";
import {ioc} from "../IoCContainer";
import {TYPES} from "../types/ioc";

describe('all tests for AuthService', () => {

    // describe('unit test', () => {
    //
    //     describe('isCodeConfirmed', () => {
    //
    //         it('should return false', async () => {
    //                 const usersRepository = {
    //                     getUserByConfirmationCode: () => null
    //                 }
    //                 const authService = new AuthService(usersRepository as any, {} as IEmailsRepository)
    //                 const response = await authService.isCodeConfirmed('stringWithCode')
    //                 expect(response).toBeFalsy()
    //             }
    //         )
    //
    //         it('should return true', async () => {
    //                 const usersRepository = {
    //                     getUserByConfirmationCode: () => ({emailConfirmation: {isConfirmed: true}})
    //                 }
    //                 const authService = new AuthService(usersRepository as any, {} as IEmailsRepository)
    //                 const response = await authService.isCodeConfirmed('stringWithCode')
    //                 expect(response).toBeTruthy()
    //             }
    //         )
    //
    //     })
    // })

    describe('integration test', () => {
        ioc.rebind(TYPES.UsersModel).toConstantValue(new UsersModel());
        const usersModel: any = ioc.get(TYPES.UsersModel)
        const usersRepository: any = new UsersRepository(usersModel)

        ioc.rebind(TYPES.EmailsModel).toConstantValue(new EmailsModel());
        const emailsModel: any = ioc.get(TYPES.EmailsModel)
        const emailsRepository: any = new UsersRepository(usersModel)
        const authService = new AuthService(usersRepository, emailsRepository)

        describe('createUser', () => {

            it('should return', async () => {

                expect(5).toBe(5)
            })
        })
    })
})

