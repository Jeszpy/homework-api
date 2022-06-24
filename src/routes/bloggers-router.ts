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

const basicAuthMiddlewareIoC = ioc.get<BasicAuthMiddleware>(TYPES.BasicAuthMiddleware)
const basicAuthMiddleware = basicAuthMiddlewareIoC.use.bind(basicAuthMiddlewareIoC)

const paginationMiddlewareIoC = ioc.get<PaginationMiddleware>(TYPES.PaginationMiddleware)
const paginationMiddleware = paginationMiddlewareIoC.use.bind(paginationMiddlewareIoC)

const bloggersControllerIoC = ioc.get<BloggersController>(BloggersController)

const getAllBloggers = bloggersControllerIoC.getAllBloggers.bind(bloggersControllerIoC)
const createBlogger = bloggersControllerIoC.createBlogger.bind(bloggersControllerIoC)
const getBloggerById = bloggersControllerIoC.getBloggerById.bind(bloggersControllerIoC)
const updateBloggerById = bloggersControllerIoC.updateBloggerById.bind(bloggersControllerIoC)
const deleteBloggerById = bloggersControllerIoC.deleteBloggerById.bind(bloggersControllerIoC)
const getPostsForSpecificBlogger = bloggersControllerIoC.getPostsForSpecificBlogger.bind(bloggersControllerIoC)
const createPostForSpecifiedBlogger = bloggersControllerIoC.createPostForSpecifiedBlogger.bind(bloggersControllerIoC)


bloggersRouter
    .get('/', paginationWithSearchNameTermValidation, paginationMiddleware, getAllBloggers)
    .post('/', basicAuthMiddleware, bloggerValidation, createBlogger)
    .get('/:id', getBloggerById)
    .put('/:id', basicAuthMiddleware, bloggerValidation, updateBloggerById)
    .delete('/:id', basicAuthMiddleware, deleteBloggerById)
    .get('/:bloggerId/posts', paginationValidation, paginationMiddleware, getPostsForSpecificBlogger)
    .post('/:bloggerId/posts', basicAuthMiddleware, postWithoutBloggerIdValidation, createPostForSpecifiedBlogger)