import {Router} from "express";
import {authValidationParams} from "../application/validations/auth-validation-params";
import {ioc} from "../IoCContainer";
import {AuthController} from "../presentation/AuthController";
import {TYPES} from "../types/ioc"
import {CheckConnectionLimitsMiddleware} from "../middlewaries/auth/check-connection-limits-middleware";


export const authRouter = Router({})

const authController = ioc.get<AuthController>(TYPES.AuthController)
const checkConnectionLimitsMiddleware = ioc.get<CheckConnectionLimitsMiddleware>(TYPES.CheckConnectionLimitsMiddleware)

authRouter.post('/login', checkConnectionLimitsMiddleware.use.bind(checkConnectionLimitsMiddleware) ,authValidationParams, authController.login.bind(authController))