// import axios, { AxiosRequestConfig, Method } from "axios";
// import { CONFIG } from '../../config/environment';
// const SibApiV3Sdk = require('@getbrevo/brevo');
// const { v4: uuidv4 } = require('uuid');
// export class BrevoService {
//     static async sendEmail(email_data: { email: string, name: string }[], subject: string, htmlTemplate: any, userIds?: any[], template?: any) {

//         let apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

//         let apiKey = apiInstance.authentications['apiKey'];
//         apiKey.apiKey = CONFIG.brevo.apikey;

//         let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

//         sendSmtpEmail.subject = `${subject}` || ''
//         sendSmtpEmail.bcc = email_data
//         sendSmtpEmail.sender = { "name": CONFIG.brevo.sender, "email": CONFIG.brevo.sender };
//         sendSmtpEmail.headers = { "Some-Custom-Name": uuidv4() };
//         sendSmtpEmail.htmlContent = htmlTemplate || " ";
//         sendSmtpEmail.replyTo = { email: "", name: "" };

//         try {
//             let response = await apiInstance.sendTransacEmail(sendSmtpEmail);
//             // await EmailLogService.create({
//             //     userIds: userIds,
//             //     html: htmlTemplate,
//             //     to: [],
//             //     file: '',
//             //     template: template,
//             //     subject: subject,
//             //     bcc: email_data
//             // })
//             return response
//         } catch (error) {
//             console.error(error);
//             return false
//         }
//     }
// }