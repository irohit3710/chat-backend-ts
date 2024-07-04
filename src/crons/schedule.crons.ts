import cron from 'node-cron'
import { KeepAliveCron } from './keepAliveCron';

export class ScheduleCron {
    static async KeepAliveServer() {
        cron.schedule('*/1 * * * *', KeepAliveCron.FourteenMinReqCron, {
            scheduled: true,
            timezone: "Asia/Kolkata",
        });
    }
}