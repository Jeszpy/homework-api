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

const checkConnectionLimitsMiddlewareIoC = ioc.get<CheckConnectionLimitsMiddleware>(TYPES.CheckConnectionLimitsMiddleware)
const checkConnectionLimitsMiddleware = checkConnectionLimitsMiddlewareIoC.use.bind(checkConnectionLimitsMiddlewareIoC)

const authControllerIoC = ioc.get<AuthController>(TYPES.AuthController)
// const registration = authControllerIoC.registration.bind(authControllerIoC)
const registration = authControllerIoC.registration.bind(authControllerIoC)
const confirmEmail = authControllerIoC.confirmEmail.bind(authControllerIoC)
const login = authControllerIoC.login.bind(authControllerIoC)


// authRouter.post('/login', checkConnectionLimitsMiddleware ,authValidationParams, authControllerIoC.login.bind(authControllerIoC))
authRouter.post('/registration', checkConnectionLimitsMiddleware, authRegistrationValidationParams, registration)
authRouter.post('/registration-confirmation', checkConnectionLimitsMiddleware, authConfirmEmailValidationParams, confirmEmail)
authRouter.post('/login', checkConnectionLimitsMiddleware, authLoginValidationParams, login)