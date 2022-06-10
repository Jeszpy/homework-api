import {Router} from "express";
import {commentsValidation} from "../application/validations/comments-validation-params";
import {ioc} from "../IoCContainer";
import {CommentsController} from "../presentation/CommentsController";
import {JWTAuthMiddleware} from "../middlewaries/auth/jwt-auth-middleware";
import {TYPES} from "../types/ioc";


export const commentsRouter = Router({})

const jwtAuthMiddlewareIoC = ioc.get<JWTAuthMiddleware>(TYPES.JWTAuthMiddleware)
const jwtAuthMiddleware = jwtAuthMiddlewareIoC.use.bind(jwtAuthMiddlewareIoC)

const commentsController = ioc.get<CommentsController>(TYPES.CommentsController)
const getCommentById = commentsController.getCommentById.bind(commentsController)
const updateCommentById = commentsController.updateCommentById.bind(commentsController)
const deleteCommentById = commentsController.deleteCommentById.bind(commentsController)


commentsRouter
    .get('/:commentId', getCommentById)
    .put('/:commentId', jwtAuthMiddleware, commentsValidation, updateCommentById)
    .delete('/:commentId', jwtAuthMiddleware, deleteCommentById)