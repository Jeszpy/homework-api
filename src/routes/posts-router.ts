import {Router} from 'express'
import {postValidation} from '../application/validations/posts-validation-params'
import {paginationValidation} from "../application/validations/pagination-validation";
import {commentsValidation} from "../application/validations/comments-validation-params";
import {ioc} from "../IoCContainer";
import {PostsController} from "../presentation/PostsController";
import {PaginationMiddleware} from "../middlewaries/pagination-middleware";
import {BasicAuthMiddleware} from "../middlewaries/auth/basic-auth-middleware";
import {JWTAuthMiddleware} from "../middlewaries/auth/jwt-auth-middleware";
import {TYPES} from "../types/ioc";

export const postsRouter = Router({})

const postsController = ioc.get<PostsController>(TYPES.PostsController)
const paginationMiddleware = ioc.get<PaginationMiddleware>(TYPES.PaginationMiddleware)
const basicAuthMiddleware = ioc.get<BasicAuthMiddleware>(TYPES.BasicAuthMiddleware)
const jwtAuthMiddleware = ioc.get<JWTAuthMiddleware>(TYPES.JWTAuthMiddleware)


postsRouter
    .get('/', paginationValidation, paginationMiddleware.use.bind(paginationMiddleware), postsController.getAllPosts.bind(postsController))
    .post('/', basicAuthMiddleware.use.bind(basicAuthMiddleware), postValidation, postsController.createNewPost.bind(postsController))
    .get('/:id', postsController.getOnePostById.bind(postsController))
    .put('/:id', basicAuthMiddleware.use.bind(basicAuthMiddleware), postValidation, postsController.updateOnePostById.bind(postsController))
    .delete('/:id', basicAuthMiddleware.use.bind(basicAuthMiddleware), postsController.deleteOnePostById.bind(postsController))
    .post('/:postId/comments', jwtAuthMiddleware.use.bind(jwtAuthMiddleware), commentsValidation, postsController.createCommentForPost.bind(postsController))
    .get('/:postId/comments', paginationValidation, paginationMiddleware.use.bind(paginationMiddleware), postsController.getCommentsByPost.bind(postsController))