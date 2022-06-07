import {Request, Response} from "express";
import {CommentsWithoutPostIdType} from "../types/comments";
import {UserType} from "../types/user";
import {PaginationResultType} from "../application/pagination";
import {inject, injectable} from "inversify";
import {TYPES} from "../types/ioc";

@injectable()
export class CommentsController {
    constructor(@inject(TYPES.ICommentsService) private commentsService: ICommentsService) {
    }

    async getCommentById(req: Request, res: Response) {
        const commentId = req.params.commentId
        const comment = await this.commentsService.getOneCommentById(commentId)
        return comment ? res.send(comment) : res.sendStatus(404)
    }

    async updateCommentById(req: Request, res: Response) {
        const user = req.user!
        const commentId = req.params.commentId
        const comment = await this.commentsService.getOneCommentById(commentId)
        if (!comment) {
            return res.sendStatus(404)
        } else {
            const commentUserId = comment.userId
            if (commentUserId !== user.id) {
                return res.sendStatus(403)
            }
        }
        const content = req.body.content
        const commentUpdate = await this.commentsService.updateCommentById(user, commentId, content)
        return commentUpdate ? res.sendStatus(204) : res.sendStatus(404)
    }

    async deleteCommentById(req: Request, res: Response) {
        const user = req.user!
        const commentId = req.params.commentId
        const comment = await this.commentsService.getOneCommentById(commentId)
        if (!comment) {
            return res.sendStatus(404)
        } else {
            const commentUserId = comment.userId
            if (commentUserId !== user.id) {
                return res.sendStatus(403)
            }
        }
        const commentDelete = await this.commentsService.deleteOneCommentById(commentId)
        return commentDelete ? res.sendStatus(204) : res.sendStatus(404)
    }
}

export interface ICommentsService {
    getOneCommentById(commentId: string): Promise<CommentsWithoutPostIdType | null>,

    updateCommentById(user: UserType, commentId: string, content: string): Promise<boolean>,

    deleteOneCommentById(commentId: string): Promise<boolean>,

    createCommentForPost(user: UserType, postId: string, content: string): Promise<CommentsWithoutPostIdType>,

    getCommentsForSpecificPost(postId: string, pageNumber: any, pageSize: any): Promise<PaginationResultType>
}