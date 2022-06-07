import {body} from "express-validator";
import {inputValidatorMiddleware} from "../../middlewaries/input-validation-middleware";


const contentValidation = body('content')
    .isString()
    .withMessage('input value must be a string')
    .trim()
    .notEmpty()
    .withMessage('field must not be empty')
    .isLength({min: 20, max: 300})
    .withMessage('min-max 20-300 symbols')

export const commentsValidation = [
    contentValidation,
    inputValidatorMiddleware
]