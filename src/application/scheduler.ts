import {EmailNotificationService} from "./email-notification-service";
import {ioc} from "../IoCContainer";
import {TYPES} from "../types/ioc";


const EmailSender = ioc.get<EmailNotificationService>(TYPES.EmailNotificationService)
const emailService = EmailSender.send.bind(EmailSender)



const sendEmails = () => {
    setTimeout( async () => {
        await emailService()
        sendEmails()
    }, 3000)
}

export const scheduler = async () => {
    console.log('scheduler off manually')
    // console.log('scheduler run')
    // sendEmails()
}