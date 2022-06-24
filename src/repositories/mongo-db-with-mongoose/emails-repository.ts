import {inject, injectable} from "inversify";
import {IEmailsRepository} from "../../domain/users-service";
import {EmailType} from "../../types/emails";
import * as mongoose from "mongoose";
import {TYPES} from "../../types/ioc";

@injectable()
export class EmailsRepository implements IEmailsRepository {
    constructor(@inject(TYPES.EmailsModel) private emailsCollection: mongoose.Model<EmailType>) {
    }

    async insertEmailToQueue(emailInfo: EmailType): Promise<boolean> {
        await this.emailsCollection.create(emailInfo)
        return true
    }

    async getEmailFromQueue(): Promise<EmailType | null> {
        const email = await this.emailsCollection.find({status: 'pending'}, {projection: {_id: false}}).sort({"createdAt": -1}).limit(1)
        if (!email[0]) {
            return null
        }
        const id = email[0].id
        await this.emailsCollection.updateOne({id}, {$set: {status: 'sending'}})
        return email[0]
    }

    async changeStatus(emailId: string, newStatus: string): Promise<boolean> {
        const result = await this.emailsCollection.updateOne({id: emailId}, {$set: {status: newStatus}})
        return result.modifiedCount === 1
    }
}