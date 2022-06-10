import {inject, injectable} from "inversify";
import {TYPES} from "../types/ioc";
import {ITestingService} from "../presentation/TestingController";

@injectable()
export class TestingService implements ITestingService {
    constructor(@inject(TYPES.ITestingRepository) private testingRepository: ITestingRepository) {
    }

    async wipeAllDataFromCollections(): Promise<boolean> {
        return await this.testingRepository.wipeAllDataFromCollections()
    }
}


export interface ITestingRepository {
    wipeAllDataFromCollections(): Promise<boolean>
}