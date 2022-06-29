import * as argon2 from "argon2";
import jwt, {Jwt, JwtHeader, JwtPayload} from 'jsonwebtoken'
import {settings} from "../settings";
import {IUsersRepository} from "../domain/users-service";
import {inject, injectable} from "inversify";
import {TYPES} from "../types/ioc";
import {AccessAndRefreshTokenType, RefreshTokenType} from "../types/jwt";

@injectable()
export class JWTService {
    constructor(@inject(TYPES.IUsersRepository) private usersRepository: IUsersRepository, @inject(TYPES.IJwtRepository) private jwtRepository: IJwtRepository) {
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
        } catch (e) {
            return null
        }
        return null
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
        let oldRefreshToken
        if (!token) return null
        if (token.blocked) return null
        try {
            oldRefreshToken = jwt.verify(token.refreshToken, settings.JWT_SECRET)
        } catch (e) {
            return null
        }
        // await this.jwtRepository.blockOldRefreshToken(token.refreshToken)
        await this.jwtRepository.blockOldRefreshToken(oldRefreshToken)
        const userInfo = jwt.decode(token.refreshToken)
        const userId = userInfo.userId
        const accessToken = jwt.sign({userId}, settings.JWT_SECRET, {expiresIn: settings.ACCESS_TOKEN_EXPIRES_IN})
        const newRefreshToken = jwt.sign({userId}, settings.JWT_SECRET, {expiresIn: settings.REFRESH_TOKEN_EXPIRES_IN})
        console.log(`Old refreshToken: ${oldRefreshToken}`)
        console.log(`New refreshToken: ${newRefreshToken}`)
        console.log(`Is it mirror: ${oldRefreshToken === newRefreshToken}`)
        await this.jwtRepository.saveRefreshToken(newRefreshToken)
        return {accessToken, refreshToken: newRefreshToken}
    }
}

export interface IJwtRepository {

    saveRefreshToken(refreshToken: string): Promise<void>

    getRefreshToken(refreshToken: string): Promise<RefreshTokenType | null>

    blockOldRefreshToken(refreshToken: string): Promise<boolean>

}
