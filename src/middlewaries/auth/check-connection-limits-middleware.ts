import {NextFunction, Request, Response} from "express";
import {inject, injectable} from "inversify";
import {mixTimeInterval} from "../../application/dates-utills";
import {TYPES} from "../../types/ioc";


@injectable()
export class CheckConnectionLimitsMiddleware {
    constructor(@inject(TYPES.IConnectionsControlRepository) private connectionsControlRepository: IConnectionsControlRepository) {
    }

    private connectionsLimitInterval = mixTimeInterval({seconds: 10})
    private blockedInterval = mixTimeInterval({seconds: 10})
    private connectionsLimit = 5

    async use(req: Request, res: Response, next: NextFunction) {
        const connectionDate: Date = new Date()
        const ip = req.ip
        console.log(ip)
        const action = (req.baseUrl).split('/').at(-1)!
        const isBlocked = await this.connectionsControlRepository.checkBlockedStatus(ip, action, connectionDate, this.blockedInterval)
        if (isBlocked) {
            return res.sendStatus(429)
        }
        const result = await this.connectionsControlRepository.checkConnectionsLimits(ip, action, connectionDate, this.connectionsLimitInterval, this.connectionsLimit)
        return result ? next() : res.sendStatus(429)
    }


}

export interface IConnectionsControlRepository {
    checkBlockedStatus(ip: string, action: string, connectionDate: Date, blockedInterval: number): Promise<boolean>

    checkConnectionsLimits(ip: string, action: string, connectionDate: Date, connectionsLimitInterval: number, connectionsLimit: number): Promise<boolean>
}
