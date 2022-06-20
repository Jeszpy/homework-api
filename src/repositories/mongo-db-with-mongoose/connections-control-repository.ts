import * as MongoClient from "mongodb";
import {BlockedConnectionType, ConnectionLimitsType} from "../../types/connectionLimits";
import {IConnectionsControlRepository} from "../../middlewaries/auth/check-connection-limits-middleware";


export class ConnectionsControlRepository implements IConnectionsControlRepository {
    constructor(private connectionLimitsCollection: MongoClient.Collection<ConnectionLimitsType>, private blockedConnectionsCollection: MongoClient.Collection<BlockedConnectionType>) {
    }

    async checkBlockedStatus(ip: string, action: string, connectionDate: Date, blockedInterval: number): Promise<boolean> {
        const blockedTimeLimit = new Date(+connectionDate - blockedInterval)
        const isBlocked = await this.blockedConnectionsCollection.findOne({
            ip,
            action,
            bannedAt: {$gt: blockedTimeLimit}
        })
        return !!isBlocked
        // return isBlocked ? true : false
        // !!isBlocked !== isBlocked ||| isBlocked !== bool, isBlocked === {}
    }

    async checkConnectionsLimits(ip: string, action: string, connectionDate: Date, connectionsLimitInterval: number, connectionsLimit: number): Promise<boolean> {
        const dateLimit = new Date(+connectionDate - connectionsLimitInterval)
        const connectionsCounts = await this.connectionLimitsCollection.countDocuments({
            ip,
            action,
            connectionAt: {$gt: dateLimit}
        })
        if (connectionsCounts >= connectionsLimit) {
            await this.blockedConnectionsCollection.insertOne({ip, action, bannedAt: connectionDate})
            return false
        }
        await this.connectionLimitsCollection.insertOne({ip, action, connectionAt: connectionDate})
        return true
    }

}