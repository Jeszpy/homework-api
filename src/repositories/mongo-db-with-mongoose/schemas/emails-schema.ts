import * as mongoose from "mongoose";
import {EmailType} from "../../../types/emails";


export const emailSchema = new mongoose.Schema<EmailType>({
    id: {String},
    email: {String},
    subject: {String},
    userLogin: {String},
    confirmationCode: {String},
    status: {String},
    createdAt: {Date}
})