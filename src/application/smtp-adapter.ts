import {injectable} from "inversify";
import nodemailer, {Transporter} from "nodemailer";
import {settings} from "../settings";


@injectable()
export class SmtpAdapter {
    private transporter: Transporter

    constructor() {
        this.transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: settings.EMAIL_FROM,
                pass: settings.EMAIL_FROM_PASSWORD,
            }
        });
    }

    async send(from: string, to: string, html: string, subject: string){
        await this.transporter.sendMail({
                from: from,
                to: to,
                html: html,
                subject: subject
            }
        )
    }
}