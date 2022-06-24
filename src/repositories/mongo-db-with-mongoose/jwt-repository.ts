import {RefreshTokenType} from "../../types/jwt";
import {IJwtRepository} from "../../application/jwt-service";
import * as mongoose from "mongoose";
import {inject, injectable} from "inversify";
import {TYPES} from "../../types/ioc";

@injectable()
export class JwtRepository implements IJwtRepository {
    constructor(@inject(TYPES.JwtModel) private jwtCollection: mongoose.Model<RefreshTokenType>) {
    }

    async saveRefreshToken(refreshToken: string): Promise<void> {
        const a = await this.jwtCollection.create({refreshToken}, {})
        console.log(a)
    }

    async getRefreshToken(refreshToken: string): Promise<RefreshTokenType | null>{
        const a = await this.jwtCollection.findOne({refreshToken})
        return a
    }

    async blockOldRefreshToken(refreshToken: string): Promise<boolean>{
        const block =  this.jwtCollection.updateOne({refreshToken}, {$set: {blocked: true}})
        return false
    }
}