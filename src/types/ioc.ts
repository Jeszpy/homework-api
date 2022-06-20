import {IAuthRepository} from "../domain/auth-service";
import {HtmlTemplateService} from "../application/html-template-service";
import {SmtpAdapter} from "../application/smtp-adapter";
import {BloggersRepository} from "../repositories/mongo-db-with-mongoose/bloggers-repository";
import {BloggersModel} from "../repositories/mongo-db-with-mongoose/models";
import {BloggersService, IBloggersRepository} from "../domain/bloggers-service";
import {Container} from "inversify";
import {BloggersController, IBloggersService} from "../presentation/BloggersController";

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

    IJwtRepository: Symbol.for('IJwtRepository'),
    JWTAuthMiddleware: Symbol.for('jwtAuthMiddleware'),
    JWTService: Symbol.for('JWTService'),

    IAuthRepository: Symbol.for('IAuthRepository'),
    IAuthService: Symbol.for('IAuthService'),
    AuthController: Symbol.for('AuthController'),

    BasicAuthMiddleware: Symbol.for('BasicAuthMiddleware'),

    PaginationMiddleware: Symbol.for('PaginationMiddleware'),

    CheckConnectionLimitsMiddleware: Symbol.for('CheckConnectionLimitsMiddleware'),
    IConnectionsControlRepository: Symbol.for('IConnectionsControlRepository'),

    IEmailsRepository: Symbol.for('IEmailsRepository'),
    EmailNotificationService: Symbol.for('EmailNotificationService'),

    ITestingRepository: Symbol.for('ITestingRepository'),
    ITestingService: Symbol.for('ITestingService'),
    TestingController: Symbol.for('TestingController'),

    HtmlTemplateService: Symbol.for('HtmlTemplateService'),
    SmtpAdapter: Symbol.for('SmtpAdapter'),


}





const invContainer = new Container()

// сюда подсовываем хоть на нэйтив монге, хоть на монгусе, хоть на postgres (я про BloggersModel)
const bloggersRepository = new BloggersRepository(BloggersModel)
// тут уже забинживаем на интерфейс
invContainer.bind<IBloggersRepository>(TYPES.IBloggersRepository).toConstantValue(bloggersRepository)
// ну и пошли дальше по цепочки биндиться
invContainer.bind<IBloggersService>(TYPES.IBloggersService).to(BloggersService)
invContainer.bind<BloggersController>(TYPES.BloggersController).to(BloggersController)