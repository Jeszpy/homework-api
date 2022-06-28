import request from 'supertest'
import app from '../../index'

describe("AuthController", () => {
    jest.setTimeout(60000);

    it("Should return status code 200", async () => {
        const res = await request(app)
            .get('/ht_04/api/users/')

        expect(res.status).toBe(200)
        expect(res.body).toBe([])
    })
})