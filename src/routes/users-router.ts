import {Router} from "express";
import {paginationValidation} from "../application/validations/pagination-validation";
import {
    userRegistrationValidationParams
} from "../application/validations/users-validation-params";
import {ioc} from "../IoCContainer";
import {UsersController} from "../presentation/UsersController";
import {PaginationMiddleware} from "../middlewaries/pagination-middleware";
import {BasicAuthMiddleware} from "../middlewaries/auth/basic-auth-middleware";
import {TYPES} from "../types/ioc";

export const usersRouter = Router({})

const usersController = ioc.get<UsersController>(TYPES.UsersController)
const paginationMiddleware = ioc.get<PaginationMiddleware>(TYPES.PaginationMiddleware)
const basicAuthMiddleware = ioc.get<BasicAuthMiddleware>(TYPES.BasicAuthMiddleware)


usersRouter
    .get('/', paginationValidation, paginationMiddleware.use.bind(paginationMiddleware), usersController.getAllUsers.bind(usersController))
    .post('/', basicAuthMiddleware.use.bind(basicAuthMiddleware), userRegistrationValidationParams, usersController.createUser.bind(usersController))
    .delete('/:id', basicAuthMiddleware.use.bind(basicAuthMiddleware), usersController.deleteUserById.bind(usersController))