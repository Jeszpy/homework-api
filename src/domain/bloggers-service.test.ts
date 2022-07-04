import {MongoMemoryServer} from "mongodb-memory-server";
import {ioc} from "../IoCContainer";
import {TYPES} from "../types/ioc";
import mongoose from "mongoose";
import {BloggersService} from "./bloggers-service";


describe('integration tests for BloggersService', () => {

    let mongoServer: MongoMemoryServer

    const bloggersService = ioc.get<BloggersService>(TYPES.IBloggersService)

    const name = 'validName'
    const youtubeUrl = 'https://www.youtube.com/channel/UCA_6eZ1c6ve94sUzqayFVSg'
    let bloggerId: string
    const newName = 'testUpdate'
    const newYoutubeUrl = 'testUpdateUrl'


    beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create()
        const mongoUri = mongoServer.getUri()
        await mongoose.connect(mongoUri)

        const newBlogger = await bloggersService.createNewBlogger(name, youtubeUrl)
        expect.setState({newBlogger: newBlogger})
    })


    afterAll(async () => {
        await mongoose.disconnect()
        await mongoServer.stop()
    })

    describe('getAllBloggers', () => {
        it('should return all bloggers', async () => {
            await bloggersService.createNewBlogger('name', 'youtubeUrl')
            const bloggers = await bloggersService.getAllBloggers('', 1, 10)
            bloggerId = bloggers.items[0].id
            expect(bloggers.items.length).toBe(2)
        });
        it('should return one blogger, filter by name', async () => {
            const bloggers = await bloggersService.getAllBloggers('na', 1, 10)
            expect(bloggers.items.length).toBe(1)
            expect(bloggers.items[0].id).not.toStrictEqual(bloggerId)
        });
    })

    describe('getOneBloggerById', () => {
        it('should return one blogger', async () => {

            const newBlogger = expect.getState().newBlogger
            expect(newBlogger).not.toBeUndefined()

            const blogger = await bloggersService.getOneBloggerById(newBlogger.id)
            expect(blogger!.name).toBe(name)
            expect(blogger!.youtubeUrl).toBe(youtubeUrl)
        });
    })

    describe('updateOneBlogger', () => {
        it('should return true', async () => {
            const newBlogger = expect.getState().newBlogger
            expect(newBlogger).not.toBeUndefined()

            const isBloggerUpdated = await bloggersService.updateOneBlogger(newBlogger.id, newName, newYoutubeUrl)
            expect(isBloggerUpdated).toBeTruthy()

        });

        it('match blogger after update', async () => {
            const newBlogger = expect.getState().newBlogger
            expect(newBlogger).not.toBeUndefined()

            const blogger = await bloggersService.getOneBloggerById(newBlogger.id)
            expect(blogger!.name).toStrictEqual(newName)
            expect(blogger!.youtubeUrl).toStrictEqual(newYoutubeUrl)
        });
    })


    describe('deleteOneBloggerById && getTotalCount', () => {
        it('should return bloggers count with pagination', async () => {
            for (let i = 0; i < 8; i++) {
                await bloggersService.createNewBlogger('name', 'youtubeUrl')
            }
            const bloggers = await bloggersService.getAllBloggers('', 1, 10)
            expect(bloggers.items.length).toBe(10)
            // expect(bloggers.items.length).toBe(9) // if test start solo

            const bloggersWithPagination = await bloggersService.getAllBloggers('', 1, 5)
            expect(bloggersWithPagination.items.length).toBe(5)
        });
        it('should delete all bloggers and return bloggers count', async () => {
            const newBlogger = expect.getState().newBlogger
            expect(newBlogger).not.toBeUndefined()

            const bloggers = await bloggersService.getAllBloggers('', 1, 10)
            for (let i = 0; i < bloggers.items.length; i++) {
                await bloggersService.deleteOneBloggerById(bloggers.items[i].id)
            }
            const bloggersAfterDelete = await bloggersService.getAllBloggers('', 1, 10)
            expect(bloggersAfterDelete.items.length).toStrictEqual(0)
        });
    })
})