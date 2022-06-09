import {injectable} from "inversify";
import * as MongoClient from "mongodb";
import {EmailType} from "../types/emails";
import {IEmailsRepository} from "../domain/users-service";

@injectable()
export class EmailsRepository implements IEmailsRepository {
    constructor(private emailsCollection: MongoClient.Collection<EmailType>) {
    }

    async insertEmailToQueue(email: string, topic: string, userLogin: string, confirmationCode: string): Promise<boolean> {
        const createdAt = new Date()
        const isInserted = await this.emailsCollection.insertOne({email, topic, userLogin, confirmationCode, createdAt})
        return isInserted.acknowledged
    }
}