import * as mongoose from "mongoose";
import {BlockedConnectionType, ConnectionLimitsType} from "../../types/connectionLimits";
import {BloggerType} from "../../types/bloggers";
import {ITestingRepository} from "../../domain/testing-service";
import {CommentsType} from "../../types/comments";
import {EmailType} from "../../types/emails";
import {PostType} from "../../types/posts";
import {UserAccountDBType} from "../../types/user";
import {inject, injectable} from "inversify";
import {TYPES} from "../../types/ioc";


@injectable()
export class TestingRepository implements ITestingRepository {
    constructor(@inject(TYPES.ConnectionsLimitModel) private connectionLimitsCollection: mongoose.Model<ConnectionLimitsType>,
                @inject(TYPES.BlockedConnectionsModel) private blockedConnectionsCollection: mongoose.Model<BlockedConnectionType>,
                @inject(TYPES.BloggersModel) private bloggersCollection: mongoose.Model<BloggerType>,
                @inject(TYPES.CommentsModel) private commentsCollection: mongoose.Model<CommentsType>,
                @inject(TYPES.EmailsModel) private emailsCollection: mongoose.Model<EmailType>,
                @inject(TYPES.PostsModel) private postsCollection: mongoose.Model<PostType>,
                @inject(TYPES.UsersModel) private usersCollection: mongoose.Model<UserAccountDBType>
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