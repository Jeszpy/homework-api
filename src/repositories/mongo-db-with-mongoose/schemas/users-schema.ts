import * as mongoose from "mongoose";
import {
    EmailConfirmationType,
    LoginAttemptType,
    SentConfirmationEmailType,
    UserAccountDBType,
    UserAccountType
} from "../../../types/user";


const userAccountSchema = new mongoose.Schema<UserAccountType>({
    id: {String},
    login: {String},
    email: {String},
    password: {String},
    createdAt: {Date, default: Date.now}
})

const loginAttemptSchema = new mongoose.Schema<LoginAttemptType>({
    attemptDate: {Date, default: Date.now},
    ip: {String}
})

const sentConfirmationEmailSchema = new mongoose.Schema<SentConfirmationEmailType>({
    sentDate: {Date},
})

const emailConfirmationSchema = new mongoose.Schema<EmailConfirmationType>({
    isConfirmed: {Boolean, default: false},
    confirmationCode: {String},
    expirationDate: {Date, required: true},
    sentEmails: [sentConfirmationEmailSchema]
})


export const usersSchema = new mongoose.Schema<UserAccountDBType>({
    accountData: userAccountSchema,
    loginAttempts: [loginAttemptSchema],
    emailConfirmation: emailConfirmationSchema
})