import {Request, Response} from "express";
import {BloggerType} from "../types/bloggers";
import {IPostsService} from "./PostsController";
import {PaginationResultType} from "../application/pagination";
import {inject, injectable} from "inversify";
import {TYPES} from "../types/ioc";

@injectable()
export class BloggersController {
    constructor(@inject(TYPES.IBloggersService) private bloggersService: IBloggersService, @inject(TYPES.IPostsService) private postsService: IPostsService) {
    }

    async getAllBloggers(req: Request, res: Response) {
        console.log(req.ip)
        const {pageNumber, pageSize, searchNameTerm} = req.query
        const allBloggers = await this.bloggersService.getAllBloggers(searchNameTerm, pageNumber, pageSize)
        return res.send(allBloggers)
    }

    async createBlogger(req: Request, res: Response) {
        const {name, youtubeUrl} = req.body
        const createdBlogger: BloggerType = await this.bloggersService.createNewBlogger(name, youtubeUrl)
        return res.status(201).send(createdBlogger)
    }

    async getBloggerById(req: Request, res: Response) {
        const id = req.params.id
        const oneBlogger: BloggerType | null = await this.bloggersService.getOneBloggerById(id)
        return oneBlogger ? res.send(oneBlogger) : res.sendStatus(404)
    }

    async updateBloggerById(req: Request, res: Response) {
        const id = req.params.id
        const {name, youtubeUrl} = req.body
        const isBloggerUpdated = await this.bloggersService.updateOneBlogger(id, name, youtubeUrl)
        return isBloggerUpdated ? res.sendStatus(204) : res.sendStatus(404)
    }

    async deleteBloggerById(req: Request, res: Response) {
        const id = req.params.id
        const isBloggerDelete = await this.bloggersService.deleteOneBloggerById(id)
        return isBloggerDelete ? res.sendStatus(204) : res.sendStatus(404)
    }

    async getPostsForSpecificBlogger(req: Request, res: Response) {
        const bloggerId = req.params.bloggerId
        if (!bloggerId) {
            return res.sendStatus(404)
        }
        const {pageNumber, pageSize} = req.query
        const postsForSpecificBlogger = await this.bloggersService.getPostsForSpecificBlogger(pageNumber, pageSize, bloggerId)
        return postsForSpecificBlogger ? res.send(postsForSpecificBlogger) : res.sendStatus(404)
    }

    async createPostForSpecifiedBlogger(req: Request, res: Response) {
        const bloggerId = req.params.bloggerId
        if (!bloggerId) {
            return res.sendStatus(404)
        }
        const isBloggerExist = await this.bloggersService.getOneBloggerById(bloggerId)
        if (isBloggerExist) {
            const {title, shortDescription, content} = req.body
            const newPost = await this.postsService.createNewPost(title, shortDescription, content, bloggerId)
            return newPost ? res.status(201).send(newPost) : res.sendStatus(404)
        }
        return res.sendStatus(404)
    }
}

export interface IBloggersService {
    getAllBloggers(searchNameTerm: any, pageNumber: any, pageSize: any): Promise<PaginationResultType>,
    createNewBlogger(name:string, youtubeUrl:string): Promise<BloggerType>,
    getOneBloggerById(id: string): Promise<BloggerType | null>,
    updateOneBlogger(id:string, name:string, youtubeUrl:string): Promise<boolean>,
    deleteOneBloggerById(id: string): Promise<boolean>,
    getPostsForSpecificBlogger(pageNumber: any, pageSize: any, bloggerId: string): Promise<PaginationResultType | null>
}