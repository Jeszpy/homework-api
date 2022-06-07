import {v4 as uuidv4} from "uuid";
import {Filter, ObjectId} from "mongodb";
import {CommentsType, CommentsWithoutPostIdType} from "../types/comments";
import {pagination, PaginationResultType} from "../application/pagination";
import {UserType} from "../types/user";
import {ICommentsService} from "../presentation/CommentsController";
import {inject, injectable} from "inversify";
import {TYPES} from "../IoCContainer";

@injectable()
export class CommentsService implements ICommentsService{
    constructor(@inject(TYPES.ICommentsRepository) private commentsRepository: ICommentsRepository) {
    }

    async getOneCommentById(commentId: string): Promise<CommentsWithoutPostIdType | null> {
        return await this.commentsRepository.getOneCommentById(commentId)
    }

    async getCommentsForSpecificPost(postId: string, pageNumber: number, pageSize: number): Promise<PaginationResultType> {
        const comments: CommentsWithoutPostIdType[] = await this.commentsRepository.getCommentsForSpecificPost(postId, pageNumber, pageSize)
        const totalCount = await this.commentsRepository.getTotalCount({postId})
        return pagination(pageNumber, pageSize, totalCount, comments)
    }

    async createCommentForPost(user: UserType, postId: string, content: string) {
        let newComment: CommentsType = {
            _id: new ObjectId(),
            postId,
            id: uuidv4(),
            content,
            userId: user.id,
            userLogin: user.login,
            addedAt: new Date
        }
        return await this.commentsRepository.createComment(newComment)
    }

    async updateCommentById(user: UserType, commentId: string, content: string): Promise<boolean> {
        return await this.commentsRepository.updateCommentById(commentId, content)
    }

    async deleteOneCommentById(commentId: string): Promise<boolean> {
        return await this.commentsRepository.deleteOneCommentById(commentId)
    }
}

export interface ICommentsRepository {
    getOneCommentById(commentId: string): Promise<CommentsWithoutPostIdType | null>,

    getCommentsForSpecificPost(postId: string, pageNumber: number, pageSize: number): Promise<CommentsWithoutPostIdType[]>,

    createComment(newComment: CommentsType): Promise<CommentsWithoutPostIdType>,

    updateCommentById(commentId: string, content: string): Promise<boolean>,

    deleteOneCommentById(commentId: string): Promise<boolean>,

    getTotalCount(filter: Filter<CommentsType>): Promise<number>
}