import {Request, Response} from "express";
import {PaginationResultType} from "../application/pagination";
import {PostType} from "../types/posts";
import {ICommentsService} from "./CommentsController";
import {inject, injectable} from "inversify";
import {TYPES} from "../types/ioc";

@injectable()
export class PostsController {
    constructor(@inject(TYPES.IPostsService) private postsService: IPostsService, @inject(TYPES.ICommentsService) private commentsService: ICommentsService) {
    }

    async getAllPosts(req: Request, res: Response) {
        const {pageNumber, pageSize, searchNameTerm} = req.query
        const allPosts = await this.postsService.getAllPosts(searchNameTerm, pageNumber, pageSize)
        return res.send(allPosts)
    }

    async createNewPost(req: Request, res: Response) {
        const {title, shortDescription, content, bloggerId} = req.body
        const createdPost = await this.postsService.createNewPost(title, shortDescription, content, bloggerId)
        return createdPost ? res.status(201).send(createdPost) : res.status(400).send({
            errorsMessages: [
                {
                    message: `blogger with id ${bloggerId} not found`,
                    field: 'bloggerId',
                },
            ],
            resultCode: 1,
        })
    }

    async getOnePostById(req: Request, res: Response) {
        const id = req.params.id
        if (!id) {
            return res.sendStatus(404)
        }
        const onePost: PostType | null = await this.postsService.getOnePostById(id)
        return onePost ? res.send(onePost) : res.sendStatus(404)
    }

    async updateOnePostById(req: Request, res: Response) {
        const id = req.params.id
        const {title, shortDescription, content, bloggerId} = req.body
        const post = await this.postsService.getOnePostById(id)
        if (!post) {
            return res.sendStatus(404)
        }
        const isPostUpdated: boolean = await this.postsService.updateOnePostById(
            id,
            title,
            shortDescription,
            content,
            bloggerId
        )
        return isPostUpdated
            ? res.sendStatus(204)
            : res.status(400).send({
                errorsMessages: [
                    {
                        message: `blogger with id ${bloggerId} not found`,
                        field: 'bloggerId',
                    },
                ],
                resultCode: 1,
            })
    }

    async deleteOnePostById(req: Request, res: Response) {
        const id = req.params.id
        const isPostDelete: boolean = await this.postsService.deleteOnePostById(id)
        return isPostDelete ? res.sendStatus(204) : res.sendStatus(404)
    }

    async createCommentForPost(req: Request, res: Response) {
        const postId = req.params.postId
        const post = await this.postsService.getOnePostById(postId)
        if (!post) {
            return res.sendStatus(404)
        }
        const user = req.user!
        const content = req.body.content
        const newComment = await this.commentsService.createCommentForPost(user, postId, content)
        return newComment ? res.status(201).send(newComment) : res.sendStatus(404)
    }

    async getCommentsByPost(req: Request, res: Response) {
        const postId = req.params.postId
        const post = await this.postsService.getOnePostById(postId)
        if (!post) {
            return res.sendStatus(404)
        }
        const {pageNumber, pageSize} = req.query
        const commentsForPost = await this.commentsService.getCommentsForSpecificPost(postId, pageNumber, pageSize)
        return commentsForPost ? res.send(commentsForPost) : res.sendStatus(404)
    }
}

export interface IPostsService {
    getAllPosts(searchNameTerm: any, pageNumber: any, pageSize: any): Promise<PaginationResultType>,

    createNewPost(title: string, shortDescription: string, content: string, bloggerId: string): Promise<PostType | null>,

    getOnePostById(id: string): Promise<PostType | null>,

    updateOnePostById(id: string, title: string, shortDescription: string, content: string, bloggerId: string): Promise<boolean>,

    deleteOnePostById(id: string): Promise<boolean>,
}