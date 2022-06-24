import {IAuthRepository} from "../domain/auth-service";
import {HtmlTemplateService} from "../application/html-template-service";
import {SmtpAdapter} from "../application/smtp-adapter";
import {BlockedConnectionsModel, ConnectionsLimitModel} from "../repositories/mongo-db-with-mongoose/models";

export const TYPES = {
    UsersModel: Symbol.for('UsersModel'),
    IUsersRepository: Symbol.for('IUsersRepository'),
    IUsersService: Symbol.for('IUsersService'),
    UsersController: Symbol.for('UsersController'),

    PostsModel: Symbol.for('PostsModel'),
    IPostsRepository: Symbol.for('IPostsRepository'),
    IPostsService: Symbol.for('IPostsService'),
    PostsController: Symbol.for('PostsController'),

    BloggersModel: Symbol.for('BloggersModel'),
    IBloggersRepository: Symbol.for('IBloggersRepository'),
    IBloggersService: Symbol.for('IBloggersService'),
    BloggersController: Symbol.for('BloggersController'),

    CommentsModel: Symbol.for('CommentsModel'),
    ICommentsRepository: Symbol.for('ICommentsRepository'),
    ICommentsService: Symbol.for('ICommentsService'),
    CommentsController: Symbol.for('CommentsController'),

    JwtModel: Symbol.for('JwtModel'),
    IJwtRepository: Symbol.for('IJwtRepository'),
    JWTAuthMiddleware: Symbol.for('jwtAuthMiddleware'),
    JWTService: Symbol.for('JWTService'),

    AuthModel: Symbol.for('AuthModel'),
    IAuthRepository: Symbol.for('IAuthRepository'),
    IAuthService: Symbol.for('IAuthService'),
    AuthController: Symbol.for('AuthController'),

    BasicAuthMiddleware: Symbol.for('BasicAuthMiddleware'),

    PaginationMiddleware: Symbol.for('PaginationMiddleware'),

    ConnectionsLimitModel: Symbol.for('ConnectionsLimitModel'),
    BlockedConnectionsModel: Symbol.for('BlockedConnectionsModel'),
    CheckConnectionLimitsMiddleware: Symbol.for('CheckConnectionLimitsMiddleware'),
    IConnectionsControlRepository: Symbol.for('IConnectionsControlRepository'),

    EmailsModel: Symbol.for('EmailsModel'),
    IEmailsRepository: Symbol.for('IEmailsRepository'),
    EmailNotificationService: Symbol.for('EmailNotificationService'),

    ITestingRepository: Symbol.for('ITestingRepository'),
    ITestingService: Symbol.for('ITestingService'),
    TestingController: Symbol.for('TestingController'),

    HtmlTemplateService: Symbol.for('HtmlTemplateService'),
    SmtpAdapter: Symbol.for('SmtpAdapter'),


}