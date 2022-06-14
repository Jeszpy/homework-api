import {IUsersConnectionsControlRepository} from "../middlewaries/auth/check-connection-limits-middleware";
import {injectable} from "inversify";
import * as MongoClient from "mongodb";
import {BlockedUserType} from "../types/connectionLimits";

@injectable()
export class UsersConnectionsControlRepository implements IUsersConnectionsControlRepository {
    constructor(private usersConnectionsControlRepository: MongoClient.Collection<BlockedUserType>, private blockedUsersConnectionsControlRepository: MongoClient.Collection<BlockedUserType>,) {
    }

    async checkUsersBlockedStatus(userName: string, action: string, connectionDate: Date, blockedInterval: number): Promise<boolean> {
        const blockedTimeLimit = new Date(+connectionDate - blockedInterval)
        const isUserBlocked = await this.blockedUsersConnectionsControlRepository.findOne({
            userName,
            action,
            bannedAt: {$gt: blockedTimeLimit}
        })
        return !!isUserBlocked
    }

    async checkUsersConnectionsLimits(userName: string, action: string, connectionDate: Date, connectionsLimitInterval: number, connectionsLimit: number): Promise<boolean> {
        const dateLimit = new Date(+connectionDate - connectionsLimitInterval)
        const connectionsCounts = await this.usersConnectionsControlRepository.countDocuments({
            userName,
            action,
            connectionAt: {$gt: dateLimit}
        })
        if (connectionsCounts >= connectionsLimit) {
            console.log('banned scope')
            await this.usersConnectionsControlRepository.insertOne({userName, action, bannedAt: connectionDate})
            return false
        }
        // await this.usersConnectionsControlRepository.insertOne({userName, action, connectionAt: connectionDate})
        return true
    }
}
