import {body} from 'express-validator'
import {inputValidatorMiddleware} from '../../middlewaries/input-validation-middleware'

const loginValidation = body('login')
    .isString()
    .withMessage('input value must be a string')
    .trim()
    .notEmpty()
    .withMessage('field must not be empty')
    .isLength({min: 3, max: 10})
    .withMessage('min-max 3-10 symbols')

const passwordValidation = body('password')
    .isString()
    .withMessage('input value must be a string')
    .trim()
    .notEmpty()
    .withMessage('field must not be empty')
    .isLength({min: 6, max: 20})
    .withMessage('min-max 6-20 symbols')

export const userValidationParams = [
    loginValidation,
    passwordValidation,
    inputValidatorMiddleware
]
