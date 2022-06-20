import * as argon2 from "argon2";
import jwt from 'jsonwebtoken'
import {settings} from "../settings";
import {IUsersRepository} from "../domain/users-service";
import {inject, injectable} from "inversify";
import {TYPES} from "../types/ioc";
import {AccessAndRefreshTokenType, JwtType} from "../types/jwt";

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
                // const oldRefreshToken = await this.jwtRepository.findRefreshTokenByUserId(user.id)
                // await this.jwtRepository.blockOldRefreshToken(user.id, oldRefreshToken)
                await this.jwtRepository.saveNewRefreshToken(user.id, refreshToken)
                // TODO: 1: создать эндпоинт для получения аксэс токена.
                //  2: присылает рефреш -> проверяем рефреш -> генерируем новый аксесс и рефреш -> ,локаем тот рефреш токен который прислали -> отсылаем новый акссес и рефреш
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

    // async

}

export interface IJwtRepository {

    // findRefreshTokenByUserId(userId: string): Promise<JwtType | null>

    saveNewRefreshToken(userId: string, refreshToken: string): Promise<void>

    blockOldRefreshToken(userId: string, refreshToken: string): Promise<void>
}
