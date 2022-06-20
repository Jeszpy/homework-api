import {JwtType} from "../../types/jwt";
import {IJwtRepository} from "../../application/jwt-service";
import * as mongoose from "mongoose";


export class JwtRepository implements IJwtRepository {
    constructor(private jwtCollection: mongoose.Model<JwtType>) {
    }

    async saveRefreshToken(refreshToken: string): Promise<void> {
        await this.jwtCollection.create({refreshToken})
    }


}