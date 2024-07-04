import express, { NextFunction, Request, Response } from 'express';
import { IServer } from '../lib/interfaces';
import VersionRouter from './version.router';

export default class Routes {

    static init(server: IServer): void {
        const router: express.Router = express.Router();

        server.app.use('/', router);
        // Health check
        server.app.get('/healthCheck', async (req: Request, res: Response, next: NextFunction) => {
            let healthcheck = {
                dbConnect: server.isDbConnected,
                uptime: process.uptime(),
                message: 'OK',
                time: new Date().toLocaleString()
            };
            try {
                res.send(healthcheck);
            } catch (e) {
                healthcheck.message = e as any;
                res.status(503).send(healthcheck);
            }
        });

        server.app.use('/api',new VersionRouter().router);
    }
}