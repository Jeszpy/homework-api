// import {ITestingRepository} from "../../domain/testing-service";
//
//
// export class TestingRepository implements ITestingRepository {
    // constructor(private connectionLimitsCollection: MongoClient.Collection<ConnectionLimitsType>,
    //             private blockedConnectionsCollection: MongoClient.Collection<BlockedConnectionType>,
    //             private bloggersCollection: MongoClient.Collection<BloggerType>,
    //             private commentsCollection: MongoClient.Collection<CommentsType>,
    //             private emailsCollection: MongoClient.Collection<EmailType>,
    //             private postsCollection: MongoClient.Collection<PostType>,
    //             private usersCollection: MongoClient.Collection<UserAccountDBType>
    // ) {
    // }
    //
    // async wipeAllDataFromCollections(): Promise<boolean> {
    //     await this.bloggersCollection.deleteMany({})
    //     await this.postsCollection.deleteMany({})
    //     await this.usersCollection.deleteMany({})
    //     await this.emailsCollection.deleteMany({})
    //     await this.commentsCollection.deleteMany({})
    //     await this.connectionLimitsCollection.deleteMany({})
    //     await this.blockedConnectionsCollection.deleteMany({})
    //     return true
    // }
// }