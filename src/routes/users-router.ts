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

const basicAuthMiddlewareIoC = ioc.get<BasicAuthMiddleware>(TYPES.BasicAuthMiddleware)
const basicAuthMiddleware = basicAuthMiddlewareIoC.use.bind(basicAuthMiddlewareIoC)

const paginationMiddlewareIoC = ioc.get<PaginationMiddleware>(TYPES.PaginationMiddleware)
const paginationMiddleware = paginationMiddlewareIoC.use.bind(paginationMiddlewareIoC)

const usersController = ioc.get<UsersController>(TYPES.UsersController)
const getAllUsers = usersController.getAllUsers.bind(usersController)
const createUser = usersController.createUser.bind(usersController)
const deleteUserById = usersController.deleteUserById.bind(usersController)


usersRouter
    .get('/', paginationValidation, paginationMiddleware, getAllUsers)
    .post('/', basicAuthMiddleware, userRegistrationValidationParams, createUser)
    .delete('/:id', basicAuthMiddleware, deleteUserById)