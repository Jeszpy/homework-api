import * as MongoClient from "mongodb";
import {JwtType} from "../types/jwt";
import {IJwtRepository} from "../application/jwt-service";


export class JwtRepository implements IJwtRepository {
    constructor(private jwtCollection: MongoClient.Collection<JwtType>) {
    }

    async saveRefreshToken(refreshToken: string): Promise<void> {
        await this.jwtCollection.insertOne({refreshToken, blocked: false})
    }


}