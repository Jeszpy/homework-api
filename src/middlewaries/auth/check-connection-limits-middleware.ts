import {NextFunction, Request, Response} from "express";
import {injectable} from "inversify";
import {blockedConnectionCollection, connectionLimitsCollection} from "../../repositories/mongo-db";
import {mixTimeInterval} from "../../application/dates-utills";



@injectable()
export class CheckConnectionLimitsMiddleware {
    constructor() {
    }

    private connectionsLimitInterval = mixTimeInterval({seconds: 10})
    private blockedInterval = mixTimeInterval({seconds: 10})
    private connectionsLimit = 5

    async use(req: Request, res: Response, next: NextFunction) {
        const connectionDate: Date = new Date()
        const ip = req.ip
        const action = (req.baseUrl).split('/').at(-1)!
        console.log(ip, action)
        const isBlocked = await this.checkBlockedStatus(ip, action, connectionDate)
        if (isBlocked) {
            return res.sendStatus(429)
        }
        const result = await this.checkConnectionsLimits(ip, action, connectionDate)
        return result ? next() : res.sendStatus(429)
    }

    private async checkBlockedStatus(ip: string, action: string, connectionDate: Date): Promise<boolean> {
        const blockedTimeLimit = new Date(+connectionDate - this.blockedInterval)
        const isBlocked = await blockedConnectionCollection.findOne({
            ip,
            action,
            bannedAt: {$gt: blockedTimeLimit}
        })
        return !!isBlocked
        // return isBlocked ? true : false
        // !!isBlocked !== isBlocked ||| isBlocked !== bool, isBlocked === {}
    }

    private async checkConnectionsLimits(ip: string, action: string, connectionDate: Date): Promise<boolean> {
        const dateLimit = new Date(+connectionDate - this.connectionsLimitInterval)
        const connectionsCounts = await connectionLimitsCollection.countDocuments({
            ip,
            action,
            connectionAt: {$gt: dateLimit}
        })
        console.log(connectionsCounts)
        if (connectionsCounts >= this.connectionsLimit) {
            console.log('banned scope')
            await blockedConnectionCollection.insertOne({ip, action, bannedAt: connectionDate})
            return false
        }
        await connectionLimitsCollection.insertOne({ip, action, connectionAt: connectionDate})
        return true
    }
}
