import {EmailNotificationService} from "../domain/email-notification-service";
import {ioc} from "../IoCContainer";
import {TYPES} from "../types/ioc";


const emailSender = ioc.get<EmailNotificationService>(TYPES.EmailNotificationService)


const sendEmails = () => {
    setTimeout( async () => {
        await emailSender.send()
        sendEmails()
    }, 3000)
}



export const scheduler = async () => {
    console.log('scheduler run')
    sendEmails()
}