import {inject, injectable} from "inversify";
import * as MongoClient from "mongodb";
import {EmailType} from "../types/emails";
import {IEmailsRepository} from "../domain/users-service";
import {TYPES} from "../types/ioc";

@injectable()
export class EmailsRepository implements IEmailsRepository {
    constructor(private emailsCollection: MongoClient.Collection<EmailType>) {
    }

    async insertEmailToQueue(emailInfo: EmailType): Promise<boolean> {
        const isInserted = await this.emailsCollection.insertOne(emailInfo)
        return isInserted.acknowledged
    }

    async getEmailFromQueue(): Promise<EmailType | null> {
        const email = await this.emailsCollection.find({status: 'pending'}, {projection: {_id: false}}).sort({"createdAt": -1}).limit(1).toArray()
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