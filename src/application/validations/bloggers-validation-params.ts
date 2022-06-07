import {body, query} from "express-validator";
import {inputValidatorMiddleware} from "../../middlewaries/input-validation-middleware";


const youTubeUrlRegEx = /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+$/


const bloggerNameValidation = body('name')
    .isString()
    .withMessage('input value must be a string')
    .trim()
    .notEmpty()
    .withMessage('field must not be empty')
    .isLength({min: 1, max: 15})
    .withMessage('min-max 1-15 symbols')

const bloggerYouTubeURLValidation = body('youtubeUrl')
    .isString()
    .withMessage('input value must be a string')
    .trim()
    .notEmpty()
    .withMessage('field must not be empty')
    .isLength({min: 1, max: 100})
    .withMessage('min-max 1-100 symbols')
    .matches(youTubeUrlRegEx)
    .withMessage(`must be matches ${youTubeUrlRegEx}`)

const bloggerIdValidation = query('bloggerId')
    .trim()
    .notEmpty()
    .withMessage('field must not be empty')
    .isString()
    .withMessage('this field must be a string')


export const bloggerValidation = [
    bloggerNameValidation,
    bloggerYouTubeURLValidation,
    inputValidatorMiddleware
]

export const bloggerIDValidation = [
    bloggerIdValidation,
    inputValidatorMiddleware
]