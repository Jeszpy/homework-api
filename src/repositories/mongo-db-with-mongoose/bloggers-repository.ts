import {inject, injectable} from "inversify";
import {IBloggersRepository} from "../../domain/bloggers-service";
import {BloggerType} from "../../types/bloggers";
import * as mongoose from "mongoose";
import {FilterQuery} from "mongoose";
import {TYPES} from "../../types/ioc";

@injectable()
export class BloggersRepository implements IBloggersRepository {
    constructor(@inject(TYPES.BloggersModel) private bloggersCollection: mongoose.Model<BloggerType>) {
    }

    async getAllBloggers(filter: FilterQuery<BloggerType>, pageNumber: number, pageSize: number): Promise<BloggerType[]> {
        const bloggers: BloggerType[] = await this.bloggersCollection.find({name: {$regex: filter ? filter : ''}}, {_id: false, __v: false})
            .skip((pageNumber-1) * pageSize)
            .limit(pageSize)
            .lean()
        return bloggers
    }

    async createNewBlogger(newBlogger: BloggerType): Promise<BloggerType> {
        await this.bloggersCollection.create({...newBlogger})
        return newBlogger
    }

    async getOneBloggerById(id: string): Promise<BloggerType | null> {
        return this.bloggersCollection.findOne({id},  {_id: false, __v: false}).lean()
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