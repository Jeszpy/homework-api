import {pagination, PaginationResultType} from "../application/pagination";
import {v4 as uuidv4} from "uuid";
import {BloggerType, BloggerWithDateType} from "../types/bloggers";
import {Filter} from "mongodb";
import {IPostsRepository} from "./posts-service";
import {IBloggersService} from "../presentation/BloggersController";
import {inject, injectable} from "inversify";
import {TYPES} from "../IoCContainer";

@injectable()
export class BloggersService implements IBloggersService{
    constructor(@inject(TYPES.IBloggersRepository) private bloggersRepository: IBloggersRepository, @inject(TYPES.IPostsRepository)private postsRepository: IPostsRepository) {
    }

    async getAllBloggers(filter: any, pageNumber: any, pageSize: any): Promise<PaginationResultType> {
        const bloggers: BloggerType[] = await this.bloggersRepository.getAllBloggers(filter, pageNumber, pageSize)
        const totalCount = await this.bloggersRepository.getTotalCount(filter)
        return pagination(pageNumber, pageSize, totalCount, bloggers)
    }
    async createNewBlogger(name: string, youtubeUrl: string) {
        let newBlogger: BloggerType = {
            id: uuidv4(),
            name,
            youtubeUrl
        }
        return await this.bloggersRepository.createNewBlogger(newBlogger)
    }
    async getOneBloggerById(id: string): Promise<BloggerType | null> {
        return await this.bloggersRepository.getOneBloggerById(id)
    }
    async updateOneBlogger(id: string, name: string, youtubeUrl: string): Promise<boolean> {
        const isBloggerExist = await this.bloggersRepository.getOneBloggerById(id)
        if (isBloggerExist) {
            if (name !== isBloggerExist.name) {
                await this.postsRepository.updatePostsWhenBloggerChangeName(isBloggerExist.name, name)
            }
            return await this.bloggersRepository.updateOneBlogger(id, name, youtubeUrl)
        } else {
            return false
        }

    }
    async deleteOneBloggerById(id: string): Promise<boolean> {
        const blogger = await this.bloggersRepository.getOneBloggerById(id)
        if (blogger) {
            try {
                let bloggerForDelete: BloggerWithDateType = {...blogger, deletedAt: new Date()}
                await this.bloggersRepository.insertIntoDeletedBloggers(bloggerForDelete)
                await this.bloggersRepository.deleteOneBloggerById(id)
                return true
            } catch (e) {
                return false
            }
        } else {
            return false
        }
    }

    async getPostsForSpecificBlogger(pageNumber: any, pageSize: any, bloggerId: string): Promise<PaginationResultType | null> {
        const blogger = await this.bloggersRepository.getOneBloggerById(bloggerId)
        if (!blogger) {
            return null
        }
        const postsForSpecificBlogger = await this.postsRepository.getAllPosts({bloggerId}, pageNumber, pageSize)
        const totalCount = await this.postsRepository.getTotalCount({bloggerId: bloggerId})
        return pagination(pageNumber, pageSize, totalCount, postsForSpecificBlogger)
    }
}

export interface IBloggersRepository {
    getAllBloggers(filter: Filter<BloggerType>, pageNumber:number, pageSize:number): Promise<BloggerType[]>,
    createNewBlogger(newBlogger: BloggerType): Promise<BloggerType>,
    getOneBloggerById(id: string): Promise<BloggerType | null>,
    updateOneBlogger(id: string, name: string, youtubeUrl: string): Promise<boolean>
    deleteOneBloggerById(id: string): Promise<boolean>,
    insertIntoDeletedBloggers(bloggerForDelete: BloggerWithDateType): Promise<boolean>,
    getTotalCount(filter: Filter<BloggerType>): Promise<number>
}