import {PostType, PostWithDateType} from "../types/posts";
import * as MongoClient from "mongodb";
import {Filter} from "mongodb";
import {IPostsRepository} from "../domain/posts-service";
import {injectable} from "inversify";

@injectable()
export class PostsRepository implements IPostsRepository {

    constructor(private postsCollection: MongoClient.Collection<PostType>, private deletedPostsCollection: MongoClient.Collection<PostWithDateType>) {
    }

    async getAllPosts(searchNameTerm: Filter<PostType>, pageNumber: number, pageSize: number): Promise<PostType[]> {
        const posts = await this.postsCollection.find(searchNameTerm, {
            projection: {_id: false},
            skip: ((pageNumber - 1) * pageSize),
            limit: (pageSize)
        }).toArray()
        return posts
    }

    async createNewPost(newPost: PostType): Promise<PostType> {
        await this.postsCollection.insertOne({...newPost})
        return newPost
    }

    async getOnePostById(id: string): Promise<PostType | null> {
        return await this.postsCollection.findOne({id}, {projection: {_id: false}})
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

    async insertToDeletedPosts(post: PostWithDateType) {
        return await this.deletedPostsCollection.insertOne(post)
    }

    async getTotalCount(filter: Filter<PostType>): Promise<number> {
        return this.postsCollection.countDocuments(filter)
    }
}
