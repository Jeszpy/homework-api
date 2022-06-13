import nodemailer, {Transport, Transporter} from 'nodemailer'
import {inject, injectable} from "inversify";
import {TYPES} from "../types/ioc";
import {IEmailsRepository} from "./users-service";
import {EmailType} from "../types/emails";
import {settings} from "../settings";
import {HtmlTemplateService} from "../application/html-template-service";
import {SmtpAdapter} from "../application/smtp-adapter";

@injectable()
export class EmailNotificationService {


    constructor(@inject(TYPES.IEmailsRepository) private emailsRepository: IEmailsRepository,
                @inject(TYPES.HtmlTemplateService) private htmlTemplateService: HtmlTemplateService,
                @inject(TYPES.SmtpAdapter) private smtpAdapter: SmtpAdapter
    ) {

    }

    async send() {
        const email = await this.getDataForSend()
        if (!email) {
            return
        }
        const html = await this.htmlTemplateService.create(email.subject, email.userLogin, email.confirmationCode)
        await this.smtpAdapter.send(settings.EMAIL_FROM, email.email, html, email.subject)
        await this.changeEmailStatus(email.id, 'sent')
        return
    }


    private async getDataForSend(): Promise<EmailType | null> {
        return this.emailsRepository.getEmailFromQueue()
    }


    private async changeEmailStatus(emailId: string, newStatus: string): Promise<boolean> {
        return this.emailsRepository.changeStatus(emailId, newStatus)
    }
}



