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
import {UsersController} from "../presentation/UsersController";

export const postsRouter = Router({})

const basicAuthMiddlewareIoC = ioc.get<BasicAuthMiddleware>(TYPES.BasicAuthMiddleware)
const basicAuthMiddleware = basicAuthMiddlewareIoC.use.bind(basicAuthMiddlewareIoC)

const jwtAuthMiddlewareIoC = ioc.get<JWTAuthMiddleware>(TYPES.JWTAuthMiddleware)
const jwtAuthMiddleware = jwtAuthMiddlewareIoC.use.bind(jwtAuthMiddlewareIoC)


const paginationMiddlewareIoC = ioc.get<PaginationMiddleware>(TYPES.PaginationMiddleware)
const paginationMiddleware = paginationMiddlewareIoC.use.bind(paginationMiddlewareIoC)


const postsController = ioc.get<PostsController>(PostsController)

const getAllPosts = postsController.getAllPosts.bind(postsController)
const createNewPost = postsController.createNewPost.bind(postsController)
const getOnePostById = postsController.getOnePostById.bind(postsController)
const updateOnePostById = postsController.updateOnePostById.bind(postsController)
const deleteOnePostById = postsController.deleteOnePostById.bind(postsController)
const createCommentForPost = postsController.createCommentForPost.bind(postsController)
const getCommentsByPost = postsController.getCommentsByPost.bind(postsController)

postsRouter
    .get('/', paginationValidation, paginationMiddleware, getAllPosts)
    .post('/', basicAuthMiddleware, postValidation, createNewPost)
    .get('/:id', getOnePostById)
    .put('/:id', basicAuthMiddleware, postValidation, updateOnePostById)
    .delete('/:id', basicAuthMiddleware, deleteOnePostById)
    .post('/:postId/comments', jwtAuthMiddleware, commentsValidation, createCommentForPost)
    .get('/:postId/comments', paginationValidation, paginationMiddleware, getCommentsByPost)