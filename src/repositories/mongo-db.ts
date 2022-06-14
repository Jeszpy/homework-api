import mongoose from 'mongoose'
import {MongoClient} from 'mongodb'
import {settings} from "../settings";
import {CommentsType} from "../types/comments";
import {BloggerType, BloggerWithDateType} from "../types/bloggers";
import {UserAccountDBType} from "../types/user";
import {PostType, PostWithDateType} from "../types/posts";
import {BlockedConnectionType, BlockedUserType, ConnectionLimitsType} from "../types/connectionLimits";
import {EmailType} from "../types/emails";

const mongoUri = settings.mongoUri

const client = new MongoClient(mongoUri);

const db = client.db("homework-api")
export const bloggersCollection = db.collection<BloggerType>('bloggers-management')
export const deletedBloggersCollection = db.collection<BloggerWithDateType>('deleted-bloggers')
export const postsCollection = db.collection<PostType>('posts-management')
export const deletedPostsCollection = db.collection<PostWithDateType>('deleted-posts')
export const usersCollection = db.collection<UserAccountDBType>('users-management')
export const commentsCollection = db.collection<CommentsType>('comments-management')
export const connectionLimitsCollection = db.collection<ConnectionLimitsType>('connection-limits-management')
export const blockedConnectionCollection = db.collection<BlockedConnectionType>('connections-black-list-management')
export const usersConnectionCollection = db.collection<BlockedUserType>('users-connections-management')
export const blockedUsersConnectionCollection = db.collection<BlockedUserType>('users-connections-black-list-management')
export const emailsCollection = db.collection<EmailType>('emails-management')

export async function runDb() {
    try {
        // await mongoose.connect(mongoUri);
        await client.connect()
        console.log("Connected successfully to mongo server");
    } catch (e) {
        console.log("Cant connect to mongo server:\n", e);
    }
}
