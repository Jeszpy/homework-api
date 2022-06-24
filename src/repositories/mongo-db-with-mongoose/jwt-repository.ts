import {JwtType} from "../../types/jwt";
import {IJwtRepository} from "../../application/jwt-service";
import * as mongoose from "mongoose";
import {inject, injectable} from "inversify";
import {TYPES} from "../../types/ioc";

@injectable()
export class JwtRepository implements IJwtRepository {
    constructor(@inject(TYPES.JwtModel) private jwtCollection: mongoose.Model<JwtType>) {
    }

    async saveRefreshToken(refreshToken: string): Promise<void> {
        await this.jwtCollection.create({refreshToken})
    }


}