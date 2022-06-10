import {BloggerType} from "../types/bloggers";
import * as MongoClient from 'mongodb'
import {Filter} from "mongodb";
import {IBloggersRepository} from "../domain/bloggers-service";
import {injectable} from "inversify";

@injectable()
export class BloggersRepository implements IBloggersRepository {
    // constructor(private bloggersCollection: MongoClient.Collection<BloggerType>, private deletedBloggersCollection: MongoClient.Collection<BloggerWithDateType>) {
    // }
    constructor(private bloggersCollection: MongoClient.Collection<BloggerType>) {
    }

    async getAllBloggers(filter: Filter<BloggerType>, pageNumber: number, pageSize: number): Promise<BloggerType[]> {
        const bloggers: BloggerType[] = await this.bloggersCollection.find(filter, {
            projection: {_id: false},
            skip: ((pageNumber - 1) * pageSize),
            limit: (pageSize)
        }).toArray()
        return bloggers
    }

    async createNewBlogger(newBlogger: BloggerType): Promise<BloggerType> {
        await this.bloggersCollection.insertOne({...newBlogger})
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

    async getTotalCount(filter: Filter<BloggerType>): Promise<number> {
        return this.bloggersCollection.countDocuments(filter)
    }
}