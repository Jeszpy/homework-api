import nodemailer from 'nodemailer'
import {inject, injectable} from "inversify";
import {TYPES} from "../types/ioc";
import {IEmailsRepository} from "./users-service";
import {EmailType} from "../types/emails";
import fs from 'fs/promises'
import {settings} from "../settings";
import * as cheerio from 'cheerio';

@injectable()
export class EmailNotificationService {
    constructor(@inject(TYPES.IEmailsRepository) private emailsRepository: IEmailsRepository) {
    }

    private transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: settings.EMAIL_FROM,
            pass: settings.EMAIL_FROM_PASSWORD,
        }
    });


    async send() {
        const email = await this.getDataForSend()
        if (!email) {
            return
        }
        const htmlTemplate = await this.createHtmlTemplate(email.subject, email.userLogin, email.confirmationCode)
        await this.transporter.sendMail({
                from: settings.EMAIL_FROM,
                to: email.email,
                html: htmlTemplate,
                subject: email.subject
            }
        )
        await this.changeStatus(email.id, 'sent')
        return
    }


    private async getDataForSend(): Promise<EmailType | null> {
        const email = await this.emailsRepository.getEmailFromQueue()
        return email ? email[0] : null

    }


    private async createHtmlTemplate(subject: string, userName: string, confirmationCode: string) {
        const file = await fs.readFile(`./src/application/HTMLTemplates/${subject}.html`, {encoding: 'utf8'})
        const link = `https://hl-homework-api.herokuapp.com/ht-04/api/auth/registration-confirmation?code=${confirmationCode}`
        const greetings = `Dear ${userName}, thanks for registering`
        const html = cheerio.load(file)
        html('a').attr('href', link)
        html('#hello').text(greetings)
        return html.html()
    }


    private async changeStatus(emailId: string, newStatus: string): Promise<boolean> {

        return await this.emailsRepository.changeStatus(emailId, newStatus)
    }
}



