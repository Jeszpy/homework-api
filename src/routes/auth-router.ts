import {Router} from "express";
import {authValidationParams} from "../application/validations/auth-validation-params";
import {ioc} from "../IoCContainer";
import {AuthController} from "../presentation/AuthController";
import {TYPES} from "../types/ioc";
import {cclm, checkConnectionLimitsMiddleware} from "../middlewaries/auth/check-connection-limits-middleware";

export const authRouter = Router({})

const authController = ioc.get<AuthController>(TYPES.AuthController)

authRouter.post('/login', cclm.use ,authValidationParams, authController.login.bind(authController))