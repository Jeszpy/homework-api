import {query} from "express-validator";
import {inputValidatorMiddleware} from "../../middlewaries/input-validation-middleware";

const pageNumberValidation = query('PageNumber')
    .optional({checkFalsy: true})
    .isInt({min: 1})
    .withMessage('this field must be a integer and more or equal 1')

const pageSizeValidation = query('PageSize')
    .optional({checkFalsy: true})
    .isInt({min: 1})
    .withMessage('this field must be a integer and more or equal 1')

const searchNameTermValidation = query('SearchNameTerm')
    .optional({checkFalsy: true})
    .isString()
    .withMessage('this field must be a string')

export const paginationValidation = [
    pageNumberValidation,
    pageSizeValidation,
    inputValidatorMiddleware
]

export const paginationValidationForComments = [
    pageNumberValidation,
    pageSizeValidation,
    inputValidatorMiddleware
]


export const paginationWithSearchNameTermValidation = [
    searchNameTermValidation,
    pageNumberValidation,
    pageSizeValidation,
    inputValidatorMiddleware
]


