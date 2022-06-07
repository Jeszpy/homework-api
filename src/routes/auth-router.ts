import {Router} from "express";
import {authValidationParams} from "../application/validations/auth-validation-params";
import {ioc, TYPES} from "../IoCContainer";
import {AuthController} from "../presentation/AuthController";

export const authRouter = Router({})

const authController = ioc.get<AuthController>(TYPES.AuthController)

authRouter.post('/login', authValidationParams, authController.login.bind(authController))