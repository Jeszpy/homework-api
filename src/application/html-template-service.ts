import fs from "fs/promises";
import * as cheerio from "cheerio";
import {injectable} from "inversify";

@injectable()
export class HtmlTemplateService {
    constructor() {
    }


    async create(subject: string, userName: string, confirmationCode: string) {
        const file = await fs.readFile(`./src/application/HTMLTemplates/${subject}.html`, {encoding: 'utf8'})
        const link = `https://hl-homework-api.herokuapp.com/ht-04/api/auth/registration-confirmation?code=${confirmationCode}`
        let text
        switch (subject) {
            case 'registration':
                text = `Dear ${userName}, thanks for registering!`;
                break
            case 'registration-email-resending':
                text = `${userName}, this email with a new verification code.`
                break
            default:
                text = ''
        }
        const html = cheerio.load(file)
        html('a').attr('href', link)
        html('#hello').text(text)
        return html.html()
    }
}