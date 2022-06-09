import {Container} from "inversify";
import "reflect-metadata";
import {PostsRepository} from "./repositories/posts-repository";
import {IPostsRepository, PostsService} from "./domain/posts-service";
import {IPostsService, PostsController} from "./presentation/PostsController";
import {CommentsRepository} from "./repositories/comments-repository";
import {CommentsService, ICommentsRepository} from "./domain/comments-service";
import {CommentsController, ICommentsService} from "./presentation/CommentsController";
import {BloggersRepository} from "./repositories/bloggers-repository";
import {BloggersService, IBloggersRepository} from "./domain/bloggers-service";
import {BloggersController, IBloggersService} from "./presentation/BloggersController";
import {UsersRepository} from "./repositories/users-repository";
import {IEmailsRepository, IUsersRepository, UsersService} from "./domain/users-service";
import {IUsersService, UsersController} from "./presentation/UsersController";
import {JWTService} from "./application/jwt-service";
import {AuthController, IAuthService} from "./presentation/AuthController";
import {JWTAuthMiddleware} from "./middlewaries/auth/jwt-auth-middleware";
import {BasicAuthMiddleware} from "./middlewaries/auth/basic-auth-middleware";
import {PaginationMiddleware} from "./middlewaries/pagination-middleware";
import {TYPES} from "./types/ioc";
import {
    blockedConnectionCollection,
    bloggersCollection,
    commentsCollection, connectionLimitsCollection,
    deletedPostsCollection, emailsCollection,
    postsCollection,
    usersCollection
} from "./repositories/mongo-db";
import {
    CheckConnectionLimitsMiddleware,
    IConnectionsControlRepository
} from "./middlewaries/auth/check-connection-limits-middleware";
import {AuthService, IAuthRepository} from "./domain/auth-service";
import {ConnectionsControlRepository} from "./repositories/connections-control-repository";
import {EmailsRepository} from "./repositories/emails-repository";
import {EmailNotificationService} from "./application/email-notification-service";
// import {EmailNotificationService} from "./application/email-notification-service";


// Repos
const postsRepository = new PostsRepository(postsCollection, deletedPostsCollection)
const commentsRepository = new CommentsRepository(commentsCollection)
const bloggersRepository = new BloggersRepository(bloggersCollection)
const usersRepository = new UsersRepository(usersCollection)
const connectionsControlRepository = new ConnectionsControlRepository(connectionLimitsCollection, blockedConnectionCollection)
const emailsRepository = new EmailsRepository(emailsCollection)

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
invContainer.bind<IUsersRepository>(TYPES.IUsersRepository).toConstantValue(usersRepository)
invContainer.bind<IUsersService>(TYPES.IUsersService).to(UsersService)
invContainer.bind<UsersController>(TYPES.UsersController).to(UsersController)
invContainer.bind<IPostsRepository>(TYPES.IPostsRepository).toConstantValue(postsRepository)
invContainer.bind<IPostsService>(TYPES.IPostsService).to(PostsService)
invContainer.bind<PostsController>(TYPES.PostsController).to(PostsController)
invContainer.bind<IBloggersRepository>(TYPES.IBloggersRepository).toConstantValue(bloggersRepository)
invContainer.bind<IBloggersService>(TYPES.IBloggersService).to(BloggersService)
invContainer.bind<BloggersController>(TYPES.BloggersController).to(BloggersController)
invContainer.bind<ICommentsRepository>(TYPES.ICommentsRepository).toConstantValue(commentsRepository)
invContainer.bind<ICommentsService>(TYPES.ICommentsService).to(CommentsService)
invContainer.bind<CommentsController>(TYPES.CommentsController).to(CommentsController)
invContainer.bind<JWTAuthMiddleware>(TYPES.JWTAuthMiddleware).to(JWTAuthMiddleware)
invContainer.bind<JWTService>(TYPES.JWTService).to(JWTService)
invContainer.bind<IAuthRepository>(TYPES.IAuthRepository).toConstantValue(usersRepository)
invContainer.bind<IAuthService>(TYPES.IAuthService).to(AuthService)
invContainer.bind<AuthController>(TYPES.AuthController).to(AuthController)
invContainer.bind<BasicAuthMiddleware>(TYPES.BasicAuthMiddleware).to(BasicAuthMiddleware)
invContainer.bind<PaginationMiddleware>(TYPES.PaginationMiddleware).to(PaginationMiddleware)
invContainer.bind<CheckConnectionLimitsMiddleware>(TYPES.CheckConnectionLimitsMiddleware).to(CheckConnectionLimitsMiddleware)

invContainer.bind<IConnectionsControlRepository>(TYPES.IConnectionsControlRepository).toConstantValue(connectionsControlRepository)
invContainer.bind<IEmailsRepository>(TYPES.IEmailsRepository).toConstantValue(emailsRepository)
invContainer.bind<EmailNotificationService>(TYPES.EmailNotificationService).to(EmailNotificationService)

export {invContainer as ioc}