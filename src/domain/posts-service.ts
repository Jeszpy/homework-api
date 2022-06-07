import {pagination, PaginationResultType} from "../application/pagination";
import {v4 as uuidv4} from 'uuid'
import {Filter} from "mongodb";
import {PostType} from "../types/posts";
import {IPostsService} from "../presentation/PostsController";
import {IBloggersRepository} from "./bloggers-service";
import {inject, injectable} from "inversify";
import {TYPES} from "../IoCContainer";

@injectable()
export class PostsService implements IPostsService{
    constructor(@inject(TYPES.IPostsRepository) private postsRepository: IPostsRepository, private bloggersRepository: IBloggersRepository) {
    }

    async getAllPosts(searchNameTerm: any, pageNumber: any, pageSize: any): Promise<PaginationResultType> {
        const posts: PostType[] = await this.postsRepository.getAllPosts(searchNameTerm, pageNumber, pageSize)
        const totalCount: number = await this.postsRepository.getTotalCount({})
        return pagination(pageNumber, pageSize, totalCount, posts)
    }

    async createNewPost(title: string, shortDescription: string, content: string, bloggerId: string): Promise<PostType | null> {
        const id = uuidv4()
        const blogger = await this.bloggersRepository.getOneBloggerById(bloggerId)
        if (blogger) {
            const bloggerName = blogger.name
            const newPost: PostType = {
                id,
                title,
                shortDescription,
                content,
                bloggerId,
                bloggerName,
            }
            return await this.postsRepository.createNewPost(newPost)
        } else {
            return null
        }
    }

    async getOnePostById(id: string): Promise<PostType | null> {
        return await this.postsRepository.getOnePostById(id)
    }

    async updateOnePostById(id: string, title: string, shortDescription: string, content: string, bloggerId: string): Promise<boolean> {
        const isBloggerCreated = await this.bloggersRepository.getOneBloggerById(bloggerId)
        if (isBloggerCreated) {
            const bloggerName = isBloggerCreated.name
            const updatePostData = {
                id,
                title,
                shortDescription,
                content,
                bloggerId,
                bloggerName,
            }
            return await this.postsRepository.updateOnePost(id, updatePostData)
        } else {
            return false
        }
    }

    async deleteOnePostById(id: string): Promise<boolean> {
        const postForDelete = await this.postsRepository.getOnePostById(id)
        if (postForDelete) {
            return await this.postsRepository.deleteOnePost(id)
        } else {
            return false
        }
    }
}

export interface IPostsRepository {
    getAllPosts(searchNameTerm: Filter<PostType>, pageNumber: number, pageSize: number): Promise<PostType[]>,

    createNewPost(newPost: PostType): Promise<PostType>,

    getOnePostById(id: string): Promise<PostType | null>,

    updateOnePost(id: string, updatePostData: PostType): Promise<boolean>,

    deleteOnePost(id: string): Promise<boolean>,

    getTotalCount(filter: Filter<PostType>): Promise<number>,

    updatePostsWhenBloggerChangeName(oldBloggerName: string, newBloggerName: string): Promise<boolean>
}
