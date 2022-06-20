import * as mongoose from "mongoose";
import {JwtType} from "../../../types/jwt";


export const jwtSchema = new mongoose.Schema<JwtType>({
    userId: {type: String, required: true},
    refreshToken: {type: String, required: true},
    blocked: {type: Boolean, default: false}
})