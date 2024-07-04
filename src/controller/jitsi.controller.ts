import express from 'express'
import { JitsiService } from '../services/jitsi.service';

export class JitsiController {
    static async getJistiJwtToken(req: express.Request, res: express.Response, next: express.NextFunction) {
        try {
            const email = req.query.email;
            const name = req.query.name;
            const id = req.query.id;

            const token = await JitsiService.generateJwtToken(id,name,email);
            res.status(200).send(token);
        } catch (error) {
            next(error);
        }
    }

    static async f(req: express.Request, res: express.Response, next: express.NextFunction) {
        try {

        } catch (error) {
            next(error);
        }
    }
}