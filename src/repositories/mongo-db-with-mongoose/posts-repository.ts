import {inject, injectable} from "inversify";
import {IPostsRepository} from "../../domain/posts-service";
import {PostType} from "../../types/posts";
import {FilterQuery} from "mongoose";
import * as mongoose from "mongoose";
import {TYPES} from "../../types/ioc";

@injectable()
export class PostsRepository implements IPostsRepository {
    constructor(@inject(TYPES.PostsModel) private postsCollection: mongoose.Model<PostType>) {
    }

    async getAllPosts(searchNameTerm: FilterQuery<PostType>, pageNumber: number, pageSize: number): Promise<PostType[]> {
        const posts = await this.postsCollection.find(searchNameTerm, {
            _id: false,
            __v: false
        }).skip((pageNumber - 1) * pageSize).limit(pageSize)
        return posts
    }

    async createNewPost(newPost: PostType): Promise<PostType> {
        await this.postsCollection.create({...newPost})
        return newPost
    }

    async getOnePostById(id: string): Promise<PostType | null> {
        return this.postsCollection.findOne({id}, {_id: false, __v: false})
    }

    async updateOnePost(id: string, updatePostData: PostType): Promise<boolean> {
        try {
            await this.postsCollection.updateOne({id}, {$set: updatePostData})
            return true
        } catch (e) {
            return false
        }
    }

    async updatePostsWhenBloggerChangeName(oldBloggerName: string, newBloggerName: string): Promise<boolean> {
        try {
            await this.postsCollection.updateMany(
                {bloggerName: oldBloggerName},
                {$set: {bloggerName: newBloggerName}}
            )
            return true
        } catch (e) {
            return false
        }
    }

    async deleteOnePost(id: string): Promise<boolean> {
        try {
            await this.postsCollection.deleteOne({id})
            return true
        } catch (e) {
            return false
        }
    }

    async getTotalCount(filter: FilterQuery<PostType>): Promise<number> {
        return this.postsCollection.countDocuments(filter)
    }
}
