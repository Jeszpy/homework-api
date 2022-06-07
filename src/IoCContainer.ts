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
import {IUsersRepository, UsersService} from "./domain/users-service";
import {IUsersService, UsersController} from "./presentation/UsersController";
import {JWTService} from "./application/jwt-service";
import {AuthController} from "./presentation/AuthController";
import {JWTAuthMiddleware} from "./middlewaries/auth/jwt-auth-middleware";
import {BasicAuthMiddleware} from "./middlewaries/auth/basic-auth-middleware";
import {PaginationMiddleware} from "./middlewaries/pagination-middleware";
import {Container} from "inversify";


// Repos
// const postsRepository = new PostsRepository(postsCollection, deletedPostsCollection)
// const commentsRepository = new CommentsRepository(commentsCollection)
// const bloggersRepository = new BloggersRepository(bloggersCollection, deletedBloggersCollection)
// const usersRepository = new UsersRepository(usersCollection)

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

export const TYPES = {
    IUsersRepository: Symbol.for('IUsersRepository'),
    IUsersService: Symbol.for('IUsersService'),
    UsersController: Symbol.for('UsersController'),
    IPostsRepository: Symbol.for('IPostsRepository'),
    IPostsService: Symbol.for('IPostsService'),
    PostsController: Symbol.for('PostsController'),
    IBloggersRepository: Symbol.for('IBloggersRepository'),
    IBloggersService: Symbol.for('IBloggersService'),
    BloggersController: Symbol.for('BloggersController'),
    ICommentsRepository: Symbol.for('ICommentsRepository'),
    ICommentsService: Symbol.for('ICommentsService'),
    CommentsController: Symbol.for('CommentsController'),
    JWTAuthMiddleware: Symbol.for('jwtAuthMiddleware'),
    JWTService: Symbol.for('JWTService'),
    AuthController: Symbol.for('AuthController'),
    BasicAuthMiddleware: Symbol.for('BasicAuthMiddleware'),
    PaginationMiddleware: Symbol.for('PaginationMiddleware'),
}

const invContainer = new Container()
invContainer.bind<IUsersRepository>(TYPES.IUsersRepository).to(UsersRepository)
invContainer.bind<IUsersService>(TYPES.IUsersService).to(UsersService)
invContainer.bind<UsersController>(TYPES.UsersController).to(UsersController)
invContainer.bind<IPostsRepository>(TYPES.IPostsRepository).to(PostsRepository)
invContainer.bind<IPostsService>(TYPES.IPostsService).to(PostsService)
invContainer.bind<PostsController>(TYPES.PostsController).to(PostsController)
invContainer.bind<IBloggersRepository>(TYPES.IBloggersRepository).to(BloggersRepository)
invContainer.bind<IBloggersService>(TYPES.IBloggersService).to(BloggersService)
invContainer.bind<BloggersController>(TYPES.BloggersController).to(BloggersController)
invContainer.bind<ICommentsRepository>(TYPES.ICommentsRepository).to(CommentsRepository)
invContainer.bind<ICommentsService>(TYPES.ICommentsService).to(CommentsService)
invContainer.bind<CommentsController>(TYPES.CommentsController).to(CommentsController)
invContainer.bind<JWTAuthMiddleware>(TYPES.JWTAuthMiddleware).to(JWTAuthMiddleware)
invContainer.bind<JWTService>(TYPES.JWTService).to(JWTService)
invContainer.bind<AuthController>(TYPES.AuthController).to(AuthController)
invContainer.bind<BasicAuthMiddleware>(TYPES.BasicAuthMiddleware).to(BasicAuthMiddleware)
invContainer.bind<PaginationMiddleware>(TYPES.PaginationMiddleware).to(PaginationMiddleware)


export {invContainer as ioc}