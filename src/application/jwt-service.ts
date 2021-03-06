import * as argon2 from "argon2";
import jwt from 'jsonwebtoken'
import {settings} from "../settings";
import {IUsersRepository} from "../domain/users-service";
import {inject, injectable} from "inversify";
import {TYPES} from "../types/ioc";
import {AccessAndRefreshTokenType, RefreshTokenType} from "../types/jwt";
import { v4 as uuid} from 'uuid'

@injectable()
export class JWTService {
    constructor(@inject(TYPES.IUsersRepository) private usersRepository: IUsersRepository, @inject(TYPES.IJwtRepository) private jwtRepository: IJwtRepository) {
    }

    async verifyJwt(token: RefreshTokenType | null): Promise<string | null>{
        if (!token) return null
        if (token.blocked) return null
        try {
            jwt.verify(token.refreshToken, settings.JWT_SECRET)
        } catch (e) {
            return null
        }
        return token.refreshToken
    }

    async createJWT(login: string, password: string): Promise<AccessAndRefreshTokenType | null> {
        const user = await this.usersRepository.getOneUserForJWT(login)
        if (!user) {
            return null
        }
        try {
            const verify = await argon2.verify(user.password, password)
            if (verify) {
                const accessToken = jwt.sign({userId: user.id}, settings.JWT_SECRET, {expiresIn: settings.ACCESS_TOKEN_EXPIRES_IN})
                const refreshToken = jwt.sign({userId: user.id}, settings.JWT_SECRET, {expiresIn: settings.REFRESH_TOKEN_EXPIRES_IN})
                await this.jwtRepository.saveRefreshToken(refreshToken)
                return {accessToken, refreshToken}
            }
            return null
        } catch (e) {
            return null
        }
    }

    async getUserIdByToken(token: string): Promise<string | null> {
        try {
            const result: any = jwt.verify(token, settings.JWT_SECRET)
            return result.userId
        } catch (e) {
            return null
        }

    }

    async blockOldRefreshToken (oldRefreshToken: string): Promise<boolean | null>{
        try {
            jwt.verify(oldRefreshToken, settings.JWT_SECRET)
        } catch (e) {
            return null
        }
        const token = await this.jwtRepository.getRefreshToken(oldRefreshToken)
        if (!token) return null
        if (token.blocked) return null
        return this.jwtRepository.blockOldRefreshToken(oldRefreshToken)
    }

    async getNewRefreshToken(refreshToken: string): Promise<AccessAndRefreshTokenType | null> {
        const token = await this.jwtRepository.getRefreshToken(refreshToken)
        const oldRefreshToken = await this.verifyJwt(token)
        if (!oldRefreshToken) return null
        await this.jwtRepository.blockOldRefreshToken(oldRefreshToken)
        const userInfo: any = jwt.decode(oldRefreshToken)
        const userId: string = userInfo.userId
        const payload = {
            jwtId: uuid(),
            userId,
        }
        const accessToken = jwt.sign(payload, settings.JWT_SECRET, {expiresIn: settings.ACCESS_TOKEN_EXPIRES_IN})
        const newRefreshToken = jwt.sign(payload, settings.JWT_SECRET, {expiresIn: settings.REFRESH_TOKEN_EXPIRES_IN})
        await this.jwtRepository.saveRefreshToken(newRefreshToken)
        return {accessToken, refreshToken: newRefreshToken}
    }
}

export interface IJwtRepository {

    saveRefreshToken(refreshToken: string): Promise<void>

    getRefreshToken(refreshToken: string): Promise<RefreshTokenType | null>

    blockOldRefreshToken(refreshToken: string): Promise<boolean>

}
