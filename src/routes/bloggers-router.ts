import {Router} from "express";
import {bloggerValidation} from "../application/validations/bloggers-validation-params";
import {
    paginationValidation,
    paginationWithSearchNameTermValidation
} from "../application/validations/pagination-validation";
import {postWithoutBloggerIdValidation} from "../application/validations/posts-validation-params";
import {ioc} from "../IoCContainer";
import {BloggersController} from "../presentation/BloggersController";
import {PaginationMiddleware} from "../middlewaries/pagination-middleware";
import {BasicAuthMiddleware} from "../middlewaries/auth/basic-auth-middleware";
import {TYPES} from "../types/ioc";


export const bloggersRouter = Router({})

const bloggersController = ioc.get<BloggersController>(TYPES.BloggersController)
const paginationMiddleware = ioc.get<PaginationMiddleware>(TYPES.PaginationMiddleware)
const basicAuthMiddleware = ioc.get<BasicAuthMiddleware>(TYPES.BasicAuthMiddleware)

bloggersRouter
    .get('/', paginationWithSearchNameTermValidation, paginationMiddleware.use.bind(paginationMiddleware), bloggersController.getAllBloggers.bind(bloggersController))
    .post('/', basicAuthMiddleware.use.bind(basicAuthMiddleware), bloggerValidation, bloggersController.getAllBloggers.bind(bloggersController))
    .get('/:id', bloggersController.getBloggerById.bind(bloggersController))
    .put('/:id', basicAuthMiddleware.use.bind(basicAuthMiddleware), bloggerValidation, bloggersController.updateBloggerById.bind(bloggersController))
    .delete('/:id', basicAuthMiddleware.use.bind(basicAuthMiddleware), bloggersController.deleteBloggerById.bind(bloggersController))
    .get('/:bloggerId/posts', paginationValidation, paginationMiddleware.use.bind(paginationMiddleware), bloggersController.getPostsForSpecificBlogger.bind(bloggersController))
    .post('/:bloggerId/posts', basicAuthMiddleware.use.bind(basicAuthMiddleware), postWithoutBloggerIdValidation, bloggersController.createPostForSpecifiedBlogger.bind(bloggersController))