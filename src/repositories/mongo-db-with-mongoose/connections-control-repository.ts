import {BlockedConnectionType, ConnectionLimitsType} from "../../types/connectionLimits";
import {IConnectionsControlRepository} from "../../middlewaries/auth/check-connection-limits-middleware";
import * as mongoose from "mongoose";
import {inject, injectable} from "inversify";
import {TYPES} from "../../types/ioc";

@injectable()
export class ConnectionsControlRepository implements IConnectionsControlRepository {
    constructor(@inject(TYPES.ConnectionsLimitModel) private connectionLimitsCollection: mongoose.Model<ConnectionLimitsType>,
                @inject(TYPES.BlockedConnectionsModel) private blockedConnectionsCollection: mongoose.Model<BlockedConnectionType>) {
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
            await this.blockedConnectionsCollection.create({ip, action, bannedAt: connectionDate})
            return false
        }
        await this.connectionLimitsCollection.create({ip, action, connectionAt: connectionDate})
        return true
    }

}