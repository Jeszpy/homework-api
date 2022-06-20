import {CommentsType, CommentsWithoutPostIdType} from "../../types/comments";
import * as MongoClient from "mongodb";
import {ICommentsRepository} from "../../domain/comments-service";
import {Filter} from "mongodb";
import {injectable} from "inversify";

@injectable()
export class CommentsRepository implements ICommentsRepository {
    constructor(private commentsCollection: MongoClient.Collection<CommentsType>) {
    }

    async getOneCommentById(commentId: string): Promise<CommentsWithoutPostIdType | null> {
        return await this.commentsCollection.findOne({id: commentId}, {projection: {_id: false, postId: false}})
    }

    async getCommentsForSpecificPost(postId: string, pageNumber: number, pageSize: number): Promise<CommentsWithoutPostIdType[]> {
        return await this.commentsCollection
            .find({postId}, {
                projection: {_id: false, postId: false},
                skip: ((pageNumber - 1) * pageSize),
                limit: (pageSize)
            }).toArray()
    }

    async createComment(newComment: CommentsType): Promise<CommentsWithoutPostIdType> {
        await this.commentsCollection.insertOne({...newComment})
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

    async getTotalCount(filter: Filter<CommentsType>): Promise<number> {
        return this.commentsCollection.countDocuments(filter)
    }
}