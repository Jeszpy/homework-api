import {Router} from "express";
import {paginationValidation} from "../application/validations/pagination-validation";
import {userValidationParams} from "../application/validations/users-validation-params";
import {ioc, TYPES} from "../IoCContainer";
import {UsersController} from "../presentation/UsersController";
import {PaginationMiddleware} from "../middlewaries/pagination-middleware";
import {BasicAuthMiddleware} from "../middlewaries/auth/basic-auth-middleware";

export const usersRouter = Router({})

const usersController = ioc.get<UsersController>(TYPES.UsersController)
const paginationMiddleware = ioc.get<PaginationMiddleware>(TYPES.PaginationMiddleware)
const basicAuthMiddleware = ioc.get<BasicAuthMiddleware>(TYPES.BasicAuthMiddleware)


usersRouter
    .get('/', paginationValidation, paginationMiddleware.use.bind(paginationMiddleware), usersController.getAllUsers.bind(usersController))
    .post('/', basicAuthMiddleware.use.bind(basicAuthMiddleware), userValidationParams, usersController.createUser.bind(usersController))
    .delete('/:id', basicAuthMiddleware.use.bind(basicAuthMiddleware), usersController.deleteUserById.bind(usersController))