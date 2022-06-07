import {Router} from "express";
import {authValidationParams} from "../application/validations/auth-validation-params";
import {ioc} from "../IoCContainer";
import {AuthController} from "../presentation/AuthController";
import {TYPES} from "../types/ioc";

export const authRouter = Router({})

const authController = ioc.get<AuthController>(TYPES.AuthController)

authRouter.post('/login', authValidationParams, authController.login.bind(authController))