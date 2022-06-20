// import {ITestingRepository} from "../../domain/testing-service";


import * as mongoose from "mongoose";
import {BlockedConnectionType, ConnectionLimitsType} from "../../types/connectionLimits";
import {BloggerType} from "../../types/bloggers";
import {ITestingRepository} from "../../domain/testing-service";
import {CommentsType} from "../../types/comments";
import {EmailType} from "../../types/emails";
import {PostType} from "../../types/posts";
import {UserAccountDBType} from "../../types/user";

export class TestingRepository implements ITestingRepository {
    constructor(private connectionLimitsCollection: mongoose.Model<ConnectionLimitsType>,
                private blockedConnectionsCollection: mongoose.Model<BlockedConnectionType>,
                private bloggersCollection: mongoose.Model<BloggerType>,
                private commentsCollection: mongoose.Model<CommentsType>,
                private emailsCollection: mongoose.Model<EmailType>,
                private postsCollection: mongoose.Model<PostType>,
                private usersCollection: mongoose.Model<UserAccountDBType>
    ) {
    }

    async wipeAllDataFromCollections(): Promise<boolean> {
        await this.bloggersCollection.deleteMany({})
        await this.postsCollection.deleteMany({})
        await this.usersCollection.deleteMany({})
        await this.emailsCollection.deleteMany({})
        await this.commentsCollection.deleteMany({})
        await this.connectionLimitsCollection.deleteMany({})
        await this.blockedConnectionsCollection.deleteMany({})
        return true
    }
}