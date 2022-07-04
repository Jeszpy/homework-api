import {MongoMemoryServer} from "mongodb-memory-server";
import {ioc} from "../IoCContainer";
import {TYPES} from "../types/ioc";
import {PostsService} from "./posts-service";
import mongoose from "mongoose";
import {BloggersService} from "./bloggers-service";


describe('integration tests for PostsService', () => {

    let mongoServer: MongoMemoryServer

    const postsService = ioc.get<PostsService>(TYPES.IPostsService)
    const bloggersService = ioc.get<BloggersService>(TYPES.IBloggersService)

    const name = 'validName'
    const youtubeUrl = 'https://www.youtube.com/channel/UCA_6eZ1c6ve94sUzqayFVSg'
    let bloggerId: string

    const title = 'title'
    const shortDescription = 'shortDescription'
    const content = 'content'
    let postId: string

    const newTitle = 'newTitle'
    const newShortDescription = 'newShortDescription'
    const newContent = 'newContent'

    beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create()
        const mongoUri = mongoServer.getUri()
        await mongoose.connect(mongoUri)

        const blogger = await bloggersService.createNewBlogger(name, youtubeUrl)
        expect(blogger).not.toBeNull()
        bloggerId = blogger.id
        const newPost = await postsService.createNewPost(title, shortDescription, content, bloggerId)
        expect(newPost).not.toBeNull()
        postId = newPost!.id
        expect.setState({newPost: newPost})
    })

    afterAll(async () => {
        await mongoose.disconnect()
        await mongoServer.stop()
    })

    describe('getAllPosts', () => {
        it('should return error because bloggerId is invalid', async () => {
            await postsService.createNewPost(newTitle, shortDescription, content, 'bloggerId')
            const posts = await postsService.getAllPosts('', 1, 10)
            expect(posts.items.length).toStrictEqual(1)
        });

        it('should return all posts', async () => {
            await postsService.createNewPost(newTitle, shortDescription, content, bloggerId)
            const posts = await postsService.getAllPosts('', 1, 10)
            postId = posts.items[0].id
            expect(posts.items.length).toBe(2)
            expect(posts.items[0].id).toStrictEqual(postId)
        });

        it('should return one post, filter by title', async () => {
            const posts = await postsService.getAllPosts('new', 1, 10)
            expect(posts.items.length).toBe(1)
            expect(posts.items[0].id).not.toStrictEqual(postId)
        });
    })

    describe('getOnePostById', () => {
        it('should return one post', async () => {
            const post = await postsService.getOnePostById(postId)
            expect(post).not.toBeNull()
            expect(post).not.toBeUndefined()
            expect(post!.title).toStrictEqual(title)
            expect(post!.shortDescription).toStrictEqual(shortDescription)
            expect(post!.content).toStrictEqual(content)
            expect(post!.bloggerId).toStrictEqual(bloggerId)
        });
    })

    describe('updateOnePostById', () => {
        it('should return true if post created', async () => {
            const updatedPost = await postsService.updateOnePostById(postId, newTitle, newShortDescription, newContent, bloggerId)
            expect(updatedPost).not.toBeNull()
            expect(updatedPost).not.toBeUndefined()
            expect(updatedPost).not.toBeFalsy()
            expect(updatedPost).toBeTruthy()
        });
        it('should return false if post not created', async () => {
            const updatedPost = await postsService.updateOnePostById(postId, newTitle, newShortDescription, newContent, 'bloggerId')
            expect(updatedPost).toBeFalsy()
        });
    })

    describe('deleteOnePostById', () => {
        it('should return posts count after delete', async () => {
            const posts = await postsService.getAllPosts('', 1, 10)
            for (let i = 0; i < posts.items.length; i++) {
                await postsService.deleteOnePostById(posts.items[i].id)
            }
            const postsAfterDelete = await postsService.getAllPosts('', 1, 10)
            expect(postsAfterDelete.items.length).toStrictEqual(0)
        })
    })
})
