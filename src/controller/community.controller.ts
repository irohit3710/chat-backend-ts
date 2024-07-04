import express from 'express'
import { LocationDao } from '../lib/dao/location.dao';

export class CommunityController {

    static async setLocation(req: express.Request, res: express.Response, next: express.NextFunction) {
        try {
            const payload = req.body;
            const location = {
                user: "60b17095a1a6f9047cf452fd",
                coordinates: {
                    type: 'Point',
                    coordinates: [payload.coordinates[0], payload.coordinates[1]],
                }
            }

            const locationSet = await LocationDao.setLocation(location);
            if (!locationSet) {
                return res.status(404).send("Unable to set location");
            }
            console.log("location : ", locationSet);
            res.status(200).send("OK")
        } catch (error) {
            next(error);
        }
    }

    static async nearbyLocations(req: express.Request, res: express.Response, next: express.NextFunction) {
        try {
            const payload = req.body;
            const longitude = payload.coordinates[0];
            const latitude = payload.coordinates[1];

            const nearbyUsers = await LocationDao.getNearbyUsers(latitude,longitude);
            if(!nearbyUsers){
                return res.status(500).send("Unable to get nearby users");
            }
            res.status(200).send(nearbyUsers);
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