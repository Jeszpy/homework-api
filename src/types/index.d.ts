import {UserType} from "../repositories/users-repository";


declare global{
    declare namespace Express {
        export interface Request {
            user: UserType | null
        }
    }
}