import * as mongoose from "mongoose";
import {JwtType} from "../../../types/jwt";


export const jwtSchema = new mongoose.Schema<JwtType>({
    // userId: {type: String, required: true}, ???
    refreshToken: {String},
    blocked: {Boolean, default: false}
})