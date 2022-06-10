import {inject, injectable} from "inversify";
import {TYPES} from "../types/ioc";
import {Request, Response} from "express";

@injectable()
export class TestingController {
    constructor(@inject(TYPES.ITestingService) private testingService: ITestingService) {
    }

    async wipeAllDataFromCollections(req: Request, res: Response) {
        await this.testingService.wipeAllDataFromCollections()
        return res.sendStatus(204)
    }

}


export interface ITestingService {
    wipeAllDataFromCollections(): Promise<boolean>
}