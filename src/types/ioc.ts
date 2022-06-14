import {IAuthRepository} from "../domain/auth-service";
import {HtmlTemplateService} from "../application/html-template-service";
import {SmtpAdapter} from "../application/smtp-adapter";

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

    IAuthRepository: Symbol.for('IAuthRepository'),
    IAuthService: Symbol.for('IAuthService'),
    AuthController: Symbol.for('AuthController'),

    BasicAuthMiddleware: Symbol.for('BasicAuthMiddleware'),

    PaginationMiddleware: Symbol.for('PaginationMiddleware'),

    CheckConnectionLimitsMiddleware: Symbol.for('CheckConnectionLimitsMiddleware'),
    IConnectionsControlRepository: Symbol.for('IConnectionsControlRepository'),
    IUsersConnectionsControlRepository: Symbol.for('IUsersConnectionsControlRepository'),
    IBlockedUsersConnectionsControlRepository: Symbol.for('IBlockedUsersConnectionsControlRepository'),

    IEmailsRepository: Symbol.for('IEmailsRepository'),
    EmailNotificationService: Symbol.for('EmailNotificationService'),

    ITestingRepository: Symbol.for('ITestingRepository'),
    ITestingService: Symbol.for('ITestingService'),
    TestingController: Symbol.for('TestingController'),

    HtmlTemplateService: Symbol.for('HtmlTemplateService'),
    SmtpAdapter: Symbol.for('SmtpAdapter'),
}