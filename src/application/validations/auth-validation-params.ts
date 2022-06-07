import { body } from 'express-validator'
import { inputValidatorMiddleware } from '../../middlewaries/input-validation-middleware'

const loginValidation = body('login')
  .isString()
  .withMessage('input value must be a string')
  .trim()
  .notEmpty()
  .withMessage('field must not be empty')

const passwordValidation = body('password')
  .isString()
  .withMessage('input value must be a string')
  .trim()
  .notEmpty()
  .withMessage('field must not be empty')

export const authValidationParams = [
  loginValidation,
  passwordValidation,
  inputValidatorMiddleware,
]
