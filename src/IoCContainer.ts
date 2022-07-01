import {Container} from "inversify";
import "reflect-metadata";
import {IPostsRepository, PostsService} from "./domain/posts-service";
import {CommentsService, ICommentsRepository} from "./domain/comments-service";
import {CommentsController, ICommentsService} from "./presentation/CommentsController";
import {BloggersService, IBloggersRepository} from "./domain/bloggers-service";
import {BloggersController, IBloggersService} from "./presentation/BloggersController";
import {IEmailsRepository, IUsersRepository, UsersService} from "./domain/users-service";
import {IUsersService, UsersController} from "./presentation/UsersController";
import {IJwtRepository, JWTService} from "./application/jwt-service";
import {AuthController, IAuthService} from "./presentation/AuthController";
import {JWTAuthMiddleware} from "./middlewaries/auth/jwt-auth-middleware";
import {BasicAuthMiddleware} from "./middlewaries/auth/basic-auth-middleware";
import {PaginationMiddleware} from "./middlewaries/pagination-middleware";
import {TYPES} from "./types/ioc";
import {
    CheckConnectionLimitsMiddleware,
    IConnectionsControlRepository
} from "./middlewaries/auth/check-connection-limits-middleware";
import {AuthService, IAuthRepository} from "./domain/auth-service";
import {EmailNotificationService} from "./domain/email-notification-service";
import {ITestingRepository, TestingService} from "./domain/testing-service";
import {ITestingService, TestingController} from "./presentation/TestingController";
import {HtmlTemplateService} from "./application/html-template-service";
import {SmtpAdapter} from "./application/smtp-adapter";
import {BloggersRepository} from "./repositories/mongo-db-with-mongoose/bloggers-repository";
import {
    BlockedConnectionsModel,
    BloggersModel,
    CommentsModel,
    ConnectionsLimitModel, EmailsModel, JwtModel,
    PostsModel,
    UsersModel
} from "./repositories/mongo-db-with-mongoose/models";
import {PostsRepository} from "./repositories/mongo-db-with-mongoose/posts-repository";
import {CommentsRepository} from "./repositories/mongo-db-with-mongoose/comments-repository";
import {UsersRepository} from "./repositories/mongo-db-with-mongoose/users-repository";
import {ConnectionsControlRepository} from "./repositories/mongo-db-with-mongoose/connections-control-repository";
import {EmailsRepository} from "./repositories/mongo-db-with-mongoose/emails-repository";
import {JwtRepository} from "./repositories/mongo-db-with-mongoose/jwt-repository";
import {TestingRepository} from "./repositories/mongo-db-with-mongoose/testing-repository";
import {IPostsService, PostsController} from "./presentation/PostsController";


// Old imports for native mongoose
// import {
//     blockedConnectionCollection, blockedUsersConnectionCollection,
//     bloggersCollection,
//     commentsCollection, connectionLimitsCollection,
//     emailsCollection, jwtCollection,
//     postsCollection,
//     usersCollection
// } from "./repositories/mongo-db/mongo-db";
// import {BloggersRepository} from "./repositories/mongo-db/bloggers-repository";
// import {PostsRepository} from "./repositories/mongo-db/posts-repository";
// import {CommentsRepository} from "./repositories/mongo-db/comments-repository";
// import {UsersRepository} from "./repositories/mongo-db/users-repository";
// import {JwtRepository} from "./repositories/mongo-db/jwt-repository";
// import {ConnectionsControlRepository} from "./repositories/mongo-db/connections-control-repository";
// import {EmailsRepository} from "./repositories/mongo-db/emails-repository";
// import {TestingRepository} from "./repositories/mongo-db/testing-repository";


// Repos with native mongoDB driver
// const postsRepository = new PostsRepository(postsCollection)
// const commentsRepository = new CommentsRepository(commentsCollection)
// const bloggersRepository = new BloggersRepository(bloggersCollection)
// const usersRepository = new UsersRepository(usersCollection)
// const connectionsControlRepository = new ConnectionsControlRepository(connectionLimitsCollection, blockedConnectionCollection)
// const emailsRepository = new EmailsRepository(emailsCollection)
// const jwtRepository = new JwtRepository(jwtCollection)
// const testingRepository = new TestingRepository(connectionLimitsCollection, blockedConnectionCollection,
//     bloggersCollection, commentsCollection, emailsCollection, postsCollection, usersCollection)


// Repos mongoDB with mongoose
// const postsRepository = new PostsRepository(PostsModel)
// const commentsRepository = new CommentsRepository(CommentsModel)
// const bloggersRepository = new BloggersRepository(BloggersModel)
// const usersRepository = new UsersRepository(UsersModel)
// const connectionsControlRepository = new ConnectionsControlRepository(ConnectionsLimitModel, BlockedConnectionsModel)
// const emailsRepository = new EmailsRepository(EmailsModel)
// const jwtRepository = new JwtRepository(JwtModel)
// const testingRepository = new TestingRepository(ConnectionsLimitModel, BlockedConnectionsModel,
//     BloggersModel, CommentsModel, EmailsModel, PostsModel, UsersModel)


// Services
// const commentsService = new CommentsService(commentsRepository)
// const bloggersService = new BloggersService(bloggersRepository, postsRepository)
// const postsService = new PostsService(postsRepository, bloggersRepository)
// const usersService = new UsersService(usersRepository)
// const jwtService = new JWTService(usersRepository)

// Controllers
// const bloggersController = new BloggersController(bloggersService, postsService)
// const postsController = new PostsController(postsService, commentsService)
// const commentsController = new CommentsController(commentsService)
// const usersController = new UsersController(usersService)
// const authController = new AuthController(jwtService)


// Middlewares
// const jwtAuthMiddleware = new JWTAuthMiddleware(jwtService, usersService)
// const basicAuthMiddleware = new BasicAuthMiddleware()
// const paginationMiddleware = new PaginationMiddleware()


// IoCContainer
// export const ioc = {
// bloggersController,
// postsController,
// commentsController,
// usersController,
// authController,
// jwtAuthMiddleware,
// basicAuthMiddleware,
// paginationMiddleware
// }

const invContainer = new Container()


invContainer.bind(TYPES.UsersModel).toConstantValue(UsersModel)
invContainer.bind<IUsersRepository>(TYPES.IUsersRepository).to(UsersRepository)
invContainer.bind<IUsersService>(TYPES.IUsersService).to(UsersService)
invContainer.bind(UsersController).toSelf()

invContainer.bind(TYPES.PostsModel).toConstantValue(PostsModel)
invContainer.bind<IPostsRepository>(TYPES.IPostsRepository).to(PostsRepository)
invContainer.bind<IPostsService>(TYPES.IPostsService).to(PostsService)
invContainer.bind(PostsController).toSelf()

invContainer.bind(TYPES.BloggersModel).toConstantValue(BloggersModel)
invContainer.bind<IBloggersRepository>(TYPES.IBloggersRepository).to(BloggersRepository)
invContainer.bind<IBloggersService>(TYPES.IBloggersService).to(BloggersService)
invContainer.bind(BloggersController).toSelf()

invContainer.bind(TYPES.CommentsModel).toConstantValue(CommentsModel)
invContainer.bind<ICommentsRepository>(TYPES.ICommentsRepository).to(CommentsRepository)
invContainer.bind<ICommentsService>(TYPES.ICommentsService).to(CommentsService)
invContainer.bind(CommentsController).toSelf()

invContainer.bind<IAuthRepository>(TYPES.IAuthRepository).to(UsersRepository)
invContainer.bind<IAuthService>(TYPES.IAuthService).to(AuthService)
invContainer.bind(AuthController).toSelf()

invContainer.bind(TYPES.JwtModel).toConstantValue(JwtModel)
invContainer.bind<IJwtRepository>(TYPES.IJwtRepository).to(JwtRepository)
invContainer.bind<JWTService>(TYPES.JWTService).to(JWTService)
// invContainer.bind(JWTService).toSelf()

invContainer.bind<JWTAuthMiddleware>(TYPES.JWTAuthMiddleware).to(JWTAuthMiddleware)
invContainer.bind<BasicAuthMiddleware>(TYPES.BasicAuthMiddleware).to(BasicAuthMiddleware)
invContainer.bind<PaginationMiddleware>(TYPES.PaginationMiddleware).to(PaginationMiddleware)

invContainer.bind(TYPES.ConnectionsLimitModel).toConstantValue(ConnectionsLimitModel)
invContainer.bind(TYPES.BlockedConnectionsModel).toConstantValue(BlockedConnectionsModel)
invContainer.bind<IConnectionsControlRepository>(TYPES.IConnectionsControlRepository).to(ConnectionsControlRepository)
invContainer.bind<CheckConnectionLimitsMiddleware>(CheckConnectionLimitsMiddleware).toSelf()

invContainer.bind(TYPES.EmailsModel).toConstantValue(EmailsModel)
invContainer.bind<IEmailsRepository>(TYPES.IEmailsRepository).to(EmailsRepository)
invContainer.bind<EmailNotificationService>(TYPES.EmailNotificationService).to(EmailNotificationService)

invContainer.bind<ITestingRepository>(TYPES.ITestingRepository).to(TestingRepository)
invContainer.bind<ITestingService>(TYPES.ITestingService).to(TestingService)
invContainer.bind<TestingController>(TYPES.TestingController).to(TestingController)

invContainer.bind<HtmlTemplateService>(TYPES.HtmlTemplateService).to(HtmlTemplateService)
invContainer.bind<SmtpAdapter>(TYPES.SmtpAdapter).to(SmtpAdapter)

export {invContainer as ioc}