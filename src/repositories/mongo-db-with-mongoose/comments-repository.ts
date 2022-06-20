import {Filter} from "mongodb";
import {injectable} from "inversify";
import {ICommentsRepository} from "../../domain/comments-service";
import {CommentsType, CommentsWithoutPostIdType} from "../../types/comments";
import * as mongoose from "mongoose";
import {FilterQuery} from "mongoose";

@injectable()
export class CommentsRepository implements ICommentsRepository {
    constructor(private commentsCollection: mongoose.Model<CommentsType>) {
    }

    async getOneCommentById(commentId: string): Promise<CommentsWithoutPostIdType | null> {
        return this.commentsCollection.findOne({id: commentId}, {_id: false, __iv: false, postId: false})
    }

    async getCommentsForSpecificPost(postId: string, pageNumber: number, pageSize: number): Promise<CommentsWithoutPostIdType[]> {
        return this.commentsCollection.find({postId}, {
            _id: false,
            __v: false,
            postId: false
        }).skip((pageNumber - 1) * pageSize).limit(pageSize)
    }

    async createComment(newComment: CommentsType): Promise<CommentsWithoutPostIdType> {
        await this.commentsCollection.create({...newComment})
        const result: CommentsWithoutPostIdType = {
            id: newComment.id,
            content: newComment.content,
            userId: newComment.userId,
            userLogin: newComment.userLogin,
            addedAt: newComment.addedAt
        }
        return result
    }

    async updateCommentById(commentId: string, content: string): Promise<boolean> {
        try {
            await this.commentsCollection.updateOne({id: commentId}, {$set: {content}})
            return true
        } catch (e) {
            return false
        }
    }

    async deleteOneCommentById(commentId: string): Promise<boolean> {
        const result = await this.commentsCollection.deleteOne({id: commentId})
        return result.deletedCount === 1
    }

    async getTotalCount(filter: FilterQuery<CommentsType>): Promise<number> {
        return this.commentsCollection.countDocuments(filter)
    }
}