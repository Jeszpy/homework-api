import {NextFunction, Request, Response} from "express";
import {injectable} from "inversify";
import {ConnectionLimitsType} from "../../types/connectionLimits";
import {connectionLimitsCollection} from "../../repositories/mongo-db";


@injectable()
export class checkConnectionLimitsMiddleware {
    constructor() {
    }

    private limitInterval = 10 * 1000
    private connectionLimit = 5

    async use(req: Request, res: Response, next: NextFunction) {
        const ip = req.ip
        const action = (req.baseUrl).split('/').at(-1)
        // TODO: why this. === undefined ???
        const result = await this.checkLimits(ip, action!)
        return result ? next() : res.sendStatus(429)
    }


    private async checkLimits(ip: string, action: string): Promise<boolean> {
        console.log('im here')
        const date: Date = new Date()
        const dateLimit = date.setDate(date.getTime() - this.limitInterval)
        const connectionsCounts = await connectionLimitsCollection.countDocuments({ip, action, connectionAt: {$gt: new Date(dateLimit)}})
        if (connectionsCounts > this.connectionLimit){
            return false
        }
        await connectionLimitsCollection.insertOne({ip, action, connectionAt: date})
        return true
    }
}

export const cclm = new checkConnectionLimitsMiddleware()