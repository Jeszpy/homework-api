import {injectable} from "inversify";
import {IBloggersRepository} from "../../domain/bloggers-service";
import {BloggerType} from "../../types/bloggers";
import * as mongoose from "mongoose";
import {FilterQuery} from "mongoose";

@injectable()
export class BloggersRepository implements IBloggersRepository {
    constructor(private bloggersCollection: mongoose.Model<BloggerType>) {
    }

    async getAllBloggers(filter: FilterQuery<BloggerType>, pageNumber: number, pageSize: number): Promise<BloggerType[]> {
        const bloggers: BloggerType[] = await this.bloggersCollection.find(filter, {
            projection: {_id: false},
            skip: ((pageNumber - 1) * pageSize),
            limit: (pageSize)
        })
        return bloggers
    }

    async createNewBlogger(newBlogger: BloggerType): Promise<BloggerType> {
        await this.bloggersCollection.create({...newBlogger})
        // const createBlogger = await this.bloggersCollection.create({...newBlogger})
        // createBlogger.save()
        return newBlogger
    }

    async getOneBloggerById(id: string): Promise<BloggerType | null> {
        return await this.bloggersCollection.findOne({id}, {projection: {_id: false}})
    }

    async updateOneBlogger(id: string, name: string, youtubeUrl: string): Promise<boolean> {
        try {
            await this.bloggersCollection.updateOne({id: id}, {$set: {name, youtubeUrl}})
            return true
        } catch (e) {
            return false
        }
    }

    async deleteOneBloggerById(id: string): Promise<boolean> {
        try {
            await this.bloggersCollection.deleteOne({id})
            return true
        } catch (e) {
            return false
        }
    }

    async getTotalCount(filter: FilterQuery<BloggerType>): Promise<number> {
        return this.bloggersCollection.countDocuments(filter)
    }
}