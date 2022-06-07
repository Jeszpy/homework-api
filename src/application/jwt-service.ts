import * as argon2 from "argon2";
import jwt from 'jsonwebtoken'
import {settings} from "../settings";
import {IUsersRepository} from "../domain/users-service";
import {inject, injectable} from "inversify";
import {TYPES} from "../IoCContainer";

@injectable()
export class JWTService {
    constructor(@inject(TYPES.IUsersRepository) private usersRepository: IUsersRepository) {
    }

    async createJWT(login: string, password: string): Promise<string | null | undefined> {
        const user = await this.usersRepository.getOneUserForJWT(login)
        if (user) {
            try {
                const verify = await argon2.verify(user.password, password)
                if (verify) {
                    const token = jwt.sign({userId: user.id}, settings.JWT_SECRET, {expiresIn: '1h'})
                    return token
                }
            } catch (e) {
                return null
            }
        } else {
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
}

