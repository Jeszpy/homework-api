import {Router} from "express";
import {ioc} from "../IoCContainer";
import {AuthController} from "../presentation/AuthController";
import {CheckConnectionLimitsMiddleware} from "../middlewaries/auth/check-connection-limits-middleware";
import {
    authAccessTokenValidationParams,
    authConfirmEmailValidationParams,
    authLoginValidationParams, authRegistrationEmailResendingValidationParams,
    authRegistrationValidationParams
} from "../application/validations/auth-validation-params";


export const authRouter = Router({})

const checkConnectionLimitsMiddlewareIoC = ioc.get<CheckConnectionLimitsMiddleware>(CheckConnectionLimitsMiddleware)
const checkConnectionLimitsMiddleware = checkConnectionLimitsMiddlewareIoC.use.bind(checkConnectionLimitsMiddlewareIoC)


const authControllerIoC = ioc.get<AuthController>(AuthController)

const registrationEmailResending = authControllerIoC.registrationEmailResending.bind(authControllerIoC)
const registration = authControllerIoC.registration.bind(authControllerIoC)
const confirmEmail = authControllerIoC.confirmEmail.bind(authControllerIoC)
const login = authControllerIoC.login.bind(authControllerIoC)
const refreshToken = authControllerIoC.refreshToken.bind(authControllerIoC)


authRouter.use(checkConnectionLimitsMiddleware)

authRouter.post('/registration-email-resending', authRegistrationEmailResendingValidationParams, registrationEmailResending)
authRouter.post('/registration', authRegistrationValidationParams, registration)
authRouter.post('/registration-confirmation', authConfirmEmailValidationParams, confirmEmail)
authRouter.post('/login', authLoginValidationParams, login)
authRouter.post('/refresh-token', authAccessTokenValidationParams, refreshToken)