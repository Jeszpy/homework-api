import * as mongoose from "mongoose";
import {RefreshTokenType} from "../../../types/jwt";


export const jwtSchema = new mongoose.Schema<RefreshTokenType>({
    refreshToken: {type: String},
    blocked: {type: Boolean, default: false}
})