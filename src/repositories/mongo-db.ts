import mongoose from 'mongoose'
import {MongoClient} from 'mongodb'
import {settings} from "../settings";
import {CommentsType} from "../types/comments";
import {BloggerType, BloggerWithDateType} from "../types/bloggers";
import {UserType} from "../types/user";
import {PostType, PostWithDateType} from "../types/posts";

const mongoUri = settings.mongoUri

// const client = new MongoClient(mongoUri);

// const db = client.db("bloggers")
// export const bloggersCollection = db.collection<BloggerType>('bloggers-management')
// export const deletedBloggersCollection = db.collection<BloggerWithDateType>('deleted-bloggers')
// export const postsCollection = db.collection<PostType>('posts-management')
// export const deletedPostsCollection = db.collection<PostWithDateType>('deleted-posts')
// export const usersCollection = db.collection<UserType>('users-management')
// export const commentsCollection = db.collection<CommentsType>('comments-management')

export async function runDb() {
    try {
        await mongoose.connect(mongoUri);
        console.log("Connected successfully to mongo server");
    } catch (e) {
        console.log("Cant connect to mongo server:\n", e);
    }
}
