// import app from '../index'
// import request from 'supertest'
//
//
// describe('Run all tests for ROUTERS', () => {
//
//     const second = 1000
//     const minute = second * 60
//
//     jest.setTimeout(3 * minute)
//
//     const testingEndpoints = {
//         wipeAllDataEndpoint: '/ht_04/api/auth/registration'
//     }
//
//     const authEndpoints = {
//         registration: '/ht_04/api/auth/registration',
//         login: '/ht_04/api/auth/login'
//     }
//
//
//
//     describe('Deleting all data at the start of testing', () => {
//
//         it('should wipe all data and return 204', async () => {
//             const res = await request(app).delete(testingEndpoints.wipeAllDataEndpoint)
//
//             expect(res.statusCode).toEqual(204)
//         });
//     })
//
//
//     describe('AuthRouter', () => {
//
//
//
//             const connectionsLimit = 5
//             const connectionBlockedTime = 10 * second
//             const sleepTime = connectionBlockedTime + second
//
//             let currentConnectionsCount = 0
//
//             const connectionsPause = async (): Promise<void> => {
//                 if (currentConnectionsCount === connectionsLimit) {
//                     await new Promise<void>(res => setTimeout(() => {
//                         currentConnectionsCount = 0
//                         expect(true).toBe(true)
//                         res()
//                     }, sleepTime))
//                 } else {
//                     currentConnectionsCount += 1
//                 }
//             }
//
//             describe('/registration', () => {
//
//                 const login = 'validLogin' // min 3, max 10
//                 const email = 'gleb.luk.go@gmail.com'
//                 const password = 'passwordForTests' // min 6, max 20
//
//                 const newLogin = 'newLogin'
//                 const newEmail = 'hleb.lukashonak@gmail.com'
//
//                 const invalidLogin = 'invalidLogin'
//                 const invalidEmail = 'invalidEmailString'
//                 const invalidPassword = 'pass'
//
//                 it('should return 400 if the input login has incorrect values', async () => {
//                     await connectionsPause()
//
//                     const res = await request(app)
//                         .post(authEndpoints.registration)
//                         .send({login: invalidLogin, email, password})
//
//                     expect(res.statusCode).toEqual(400)
//                     // expect(res.body)
//                 });
//
//                 it('should return 400 if the input email has incorrect values', async () => {
//                     await connectionsPause()
//                     const res = await request(app)
//                         .post(authEndpoints.registration)
//                         .send({login, email: invalidEmail, password})
//
//                     expect(res.statusCode).toEqual(400)
//                     // expect(res.body)
//                 });
//
//                 it('should return 400 if the input password has incorrect values', async () => {
//                     await connectionsPause()
//
//                     const res = await request(app)
//                         .post(authEndpoints.registration)
//                         .send({login, email, password: invalidPassword})
//
//                     expect(res.statusCode).toEqual(400)
//                     // expect(res.body)
//                 });
//
//                 it('should return 204 if input data is accepted', async () => {
//                     await connectionsPause()
//
//                     const res = await request(app)
//                         .post(authEndpoints.registration)
//                         .send({login, email, password})
//
//                     expect(res.statusCode).toEqual(204)
//                 });
//
//                 it('should return 400 if the input login has been already created', async () => {
//                     await connectionsPause()
//
//                     const res = await request(app)
//                         .post(authEndpoints.registration)
//                         .send({login, email: newEmail, password})
//
//                     expect(res.statusCode).toEqual(400)
//                     // expect(res.body)
//                 });
//
//                 it('should return 429 because excess connections limit', async () => {
//                     const res = await request(app)
//                         .post(authEndpoints.registration)
//                         .send({login: newLogin, email, password})
//
//                     expect(res.statusCode).toEqual(429)
//                 })
//
//                 it('should return 400 if the input email has been already created', async () => {
//                     await connectionsPause()
//
//                     const res = await request(app)
//                         .post(authEndpoints.registration)
//                         .send({login: newLogin, email, password})
//
//                     expect(res.statusCode).toEqual(400)
//                     // expect(res.body)
//                 });
//             })
//
//
//         }
//     )
// })
//
