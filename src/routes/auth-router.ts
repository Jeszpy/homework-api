import {Router} from "express";
import {ioc} from "../IoCContainer";
import {AuthController} from "../presentation/AuthController";
import {TYPES} from "../types/ioc"
import {CheckConnectionLimitsMiddleware} from "../middlewaries/auth/check-connection-limits-middleware";
import {
    authConfirmEmailValidationParams,
    authLoginValidationParams,
    authRegistrationValidationParams
} from "../application/validations/auth-validation-params";


export const authRouter = Router({})

const authController = ioc.get<AuthController>(TYPES.AuthController)
const checkConnectionLimitsMiddleware = ioc.get<CheckConnectionLimitsMiddleware>(TYPES.CheckConnectionLimitsMiddleware)

// authRouter.post('/login', checkConnectionLimitsMiddleware.use.bind(checkConnectionLimitsMiddleware) ,authValidationParams, authController.login.bind(authController))
authRouter.post('/registration', checkConnectionLimitsMiddleware.use.bind(checkConnectionLimitsMiddleware) ,authRegistrationValidationParams, authController.registration.bind(authController))
authRouter.post('/registration-confirmation', checkConnectionLimitsMiddleware.use.bind(checkConnectionLimitsMiddleware) ,authConfirmEmailValidationParams, authController.confirmEmail.bind(authController))
authRouter.post('/login', checkConnectionLimitsMiddleware.use.bind(checkConnectionLimitsMiddleware) , authLoginValidationParams, authController.login.bind(authController))