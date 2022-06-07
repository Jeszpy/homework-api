import {Router} from "express";
import {commentsValidation} from "../application/validations/comments-validation-params";
import {ioc} from "../IoCContainer";
import {CommentsController} from "../presentation/CommentsController";
import {JWTAuthMiddleware} from "../middlewaries/auth/jwt-auth-middleware";
import {TYPES} from "../types/ioc";


export const commentsRouter = Router({})

const commentsController = ioc.get<CommentsController>(TYPES.CommentsController)
const jwtAuthMiddleware = ioc.get<JWTAuthMiddleware>(TYPES.JWTAuthMiddleware)

commentsRouter
    .get('/:commentId',commentsController.getCommentById.bind(commentsController))
    .put('/:commentId', jwtAuthMiddleware.use.bind(jwtAuthMiddleware), commentsValidation, commentsController.updateCommentById.bind(commentsController))
    .delete('/:commentId', jwtAuthMiddleware.use.bind(jwtAuthMiddleware), commentsController.deleteCommentById.bind(commentsController))