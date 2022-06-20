import * as MongoClient from "mongodb";
import {JwtType} from "../../types/jwt";
import {IJwtRepository} from "../../application/jwt-service";


export class JwtRepository implements IJwtRepository {
    constructor(private jwtCollection: MongoClient.Collection<JwtType>) {
    }

    async findRefreshTokenByUserId (userId: string): Promise<boolean>{
        const token = await this.jwtCollection.findOne({userId})
        if (!token){
            return false
        }
        return true
    }

    async saveNewRefreshToken(userId: string, refreshToken: string): Promise<void> {
        await this.jwtCollection.insertOne({userId, refreshToken, blocked: false})
    }

    async blockOldRefreshToken(refreshToken: string): Promise<void> {

    }
}