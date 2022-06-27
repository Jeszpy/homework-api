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
        await this.jwtCollection.create({refreshToken})
    }

    async getRefreshToken(refreshToken: string): Promise<RefreshTokenType | null>{
        return this.jwtCollection.findOne({refreshToken: refreshToken})
    }

    async blockOldRefreshToken(oldRefreshToken: string): Promise<boolean>{
        const block =  await this.jwtCollection.updateOne({refreshToken: oldRefreshToken}, {$set: {blocked: true}})
        return block.modifiedCount === 1
    }
}