import {Router} from "express";
import {ioc} from "../IoCContainer";
import {AuthController} from "../presentation/AuthController";
import {TYPES} from "../types/ioc"
import {CheckConnectionLimitsMiddleware} from "../middlewaries/auth/check-connection-limits-middleware";
import {
    authConfirmEmailValidationParams,
    authLoginValidationParams, authRegistrationEmailResendingValidationParams,
    authRegistrationValidationParams
} from "../application/validations/auth-validation-params";


export const authRouter = Router({})

const checkConnectionLimitsMiddlewareIoC = ioc.get<CheckConnectionLimitsMiddleware>(TYPES.CheckConnectionLimitsMiddleware)
const checkConnectionLimitsMiddleware = checkConnectionLimitsMiddlewareIoC.use.bind(checkConnectionLimitsMiddlewareIoC)


const authControllerIoC = ioc.get<AuthController>(TYPES.AuthController)
const registrationEmailResending = authControllerIoC.registrationEmailResending.bind(authControllerIoC)
const registration = authControllerIoC.registration.bind(authControllerIoC)
const confirmEmail = authControllerIoC.confirmEmail.bind(authControllerIoC)
const login = authControllerIoC.login.bind(authControllerIoC)

authRouter.use(checkConnectionLimitsMiddleware)

// authRouter.post('/registration-email-resending', checkConnectionLimitsMiddleware, authRegistrationEmailResendingValidationParams, registrationEmailResending)
// authRouter.post('/registration', checkConnectionLimitsMiddleware, authRegistrationValidationParams, registration)
// authRouter.post('/registration-confirmation', checkConnectionLimitsMiddleware, authConfirmEmailValidationParams, confirmEmail)
// authRouter.post('/login', checkConnectionLimitsMiddleware, authLoginValidationParams, login)

authRouter.post('/registration-email-resending', authRegistrationEmailResendingValidationParams, registrationEmailResending)
authRouter.post('/registration', authRegistrationValidationParams, registration)
authRouter.post('/registration-confirmation', authConfirmEmailValidationParams, confirmEmail)
authRouter.post('/login', authLoginValidationParams, login)