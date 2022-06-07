import {body, param} from 'express-validator'
import {inputValidatorMiddleware} from '../../middlewaries/input-validation-middleware'

const titleValidation = body('title')
    .isString()
    .withMessage('input value must be a string')
    .trim()
    .notEmpty()
    .withMessage('field must not be empty')
    .isLength({min: 1, max: 30})
    .withMessage('min-max 1-30 symbols')

const shortDescriptionValidation = body('shortDescription')
    .isString()
    .withMessage('input value must be a string')
    .trim()
    .notEmpty()
    .withMessage('field must not be empty')
    .isLength({min: 1, max: 100})
    .withMessage('min-max 1-100 symbols')

const contentValidation = body('content')
    .isString()
    .withMessage('input value must be a string')
    .trim()
    .notEmpty()
    .withMessage('field must not be empty')
    .isLength({min: 1, max: 1000})
    .withMessage('min-max 1-1000 symbols')

const bloggerIDValidation = body('bloggerId')
    .isString()
    .withMessage('input value must be a string')
    .trim()
    .notEmpty()
    .withMessage('field must not be empty')

export const postValidation = [
    titleValidation,
    shortDescriptionValidation,
    contentValidation,
    bloggerIDValidation,
    inputValidatorMiddleware,
]

export const postWithoutBloggerIdValidation = [
    titleValidation,
    shortDescriptionValidation,
    contentValidation,
    inputValidatorMiddleware,
]
