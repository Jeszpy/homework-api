import {inject, injectable} from "inversify";
import {TYPES} from "../types/ioc";
import {IEmailsRepository} from "../domain/users-service";


const notificationService = (sender: any) => {

}



@injectable()
export class NotificationService {
    constructor(@inject(TYPES.IEmailsRepository) private emailsRepository: IEmailsRepository) {
    }

    private transporter(){

    }


}