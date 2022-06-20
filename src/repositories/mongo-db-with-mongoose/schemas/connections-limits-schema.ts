import * as mongoose from "mongoose";
import {ConnectionLimitsType} from "../../../types/connectionLimits";


export const connectionsLimitsSchema = new mongoose.Schema<ConnectionLimitsType>({
    ip: {String},
    action: {String},
    connectionAt: {Date},
})