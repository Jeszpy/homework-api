import mongoose from 'mongoose'
import {settings} from "../../settings";

const mongoUri = settings.mongoUri

export async function runDb() {
    try {
        await mongoose.connect(mongoUri);
        console.log("Connected successfully to mongo server by mongoose");
    } catch (e) {
        await mongoose.disconnect()
        console.log("Cant connect to mongo server:\n", e);
    }
}
