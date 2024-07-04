import express from 'express'
import { Utility } from '../util/util';
import { AdminDao } from '../lib/dao/admin.dao';
import { ChatDao } from '../lib/dao/chat.dao';
import { UserDao } from '../lib/dao/user.dao';
import { ReportDao } from '../lib/dao/report.dao';

export class AdminController {
    static async createAdmin(req: express.Request, res: express.Response, next: express.NextFunction) {
        const payload = req.body;
        if (!payload.email || !payload.password || !payload.name) {
            return res.status(400).send("All fields are required");
        }

        const hashpassword = Utility.createPasswordHash(payload.password);

        const adminpayload = {
            name: payload.name,
            email: payload.email,
            password: hashpassword
        }

        const admin = await AdminDao.createAdmin(payload);
        if (!admin) {
            return res.status(400).send("Something went wrong");
        }
        res.status(200).send(admin);
    }

    static async adminLogin(req: express.Request, res: express.Response, next: express.NextFunction) {
        const payload = req.body;
        if (!payload.email || !payload.password) {
            return res.status(400).send("All fields are required");
        }

        const admin = await AdminDao.getAdminByEmail(payload.email);
        if (!admin) {
            return res.status(400).send("No admin exist with this email");
        }
        const decoded = await Utility.comparePasswordHash(admin.password, payload.password);

        if (!decoded) {
            return res.status(400).send("Internal Server Error");
        }

        const accessToken = Utility.generateJwtToken(admin._id);
        res.status(200).send(accessToken);
    }

    static async getAllUsers(req: express.Request, res: express.Response, next: express.NextFunction) {
        const count = Number(req.query.count) || 10;
        const pageNumber = Number(req.query.pageNumber) || 1;
        const skip = Math.max((pageNumber - 1) * count, 0)
        const searchEmail: any = req.query.searchEmail;

        let query: any = {};

        if (searchEmail && searchEmail.length > 0) {
            query.email = { $regex: new RegExp(searchEmail, 'i') }; // Case-insensitive search
        }


        let allusers = await UserDao.getAllUsersWithAdminQuery(query, skip, count);

        //map of userid and user
        const userIdsMap = new Map(allusers.map(user => [user._id.toString(), user]));


        const allChats = await ChatDao.getAllChats();

        //check if chat.groupadmin id exist in userId
        for (const chat of allChats) {
            if (chat.groupAdmin) {
                const userId = chat.groupAdmin.toString();
                if (userIdsMap.has(userId)) {
                    const currentUser: any = userIdsMap.get(userId);
                    currentUser.isAdmin = true;
                }
            }
        }

        const total = await UserDao.getAllUsersCount();

        if (!allusers) {
            return res.status(400).send("Unable to fetch data");
        }

        res.status(200).send({ allusers, total });

    }

    static async getAllGroups(req: express.Request, res: express.Response, next: express.NextFunction) {
        const count = Number(req.query.count) || 10;
        const pageNumber = Number(req.query.pageNumber) || 1;
        const skip = Math.max((pageNumber - 1) * count, 0)
        const groupName: any = req.query.groupName;

        let query: any = {
            isGroupChat: true
        };

        if (groupName && groupName.length > 0) {
            query.chatName = { $regex: new RegExp(groupName, 'i') }; // Case-insensitive search
        }

        let allgroups = await ChatDao.getAllGroupsWithQuery(query, skip, count);
        const total = await ChatDao.getAllGroupsCount();

        if (!allgroups || !total) {
            return res.status(400).send("Unable to fetch data");
        }

        res.status(200).send({ allgroups, total });
    }

    static async getAllReports(req: express.Request, res: express.Response, next: express.NextFunction) {
        const count = Number(req.query.count) || 10;
        const pageNumber = Number(req.query.pageNumber) || 1;
        const skip = Math.max((pageNumber - 1) * count, 0)

        const allReports = await ReportDao.getAllReports();
        const total = allReports.length;
        res.status(200).send({allReports,total});
    }

    static async getUserById(req: express.Request, res: express.Response, next: express.NextFunction) {
        const userId = req.params.userId;
        if(!userId){
            return res.status(400).send('User data requred');
        }

        const userDetails = await UserDao.getUserById(userId);
        if(!userDetails){
            return res.status(400).send("Something went wrong");
        }

        res.status(200).send({userDetails});
    }

    static async SuspendUserAccount(req: express.Request, res: express.Response, next: express.NextFunction) {
        const userId = req.params.userId;
        if(!userId){
            return res.status(400).send('User data requred');
        }

        const suspendedUserAccount = await UserDao.suspendUserAccount(userId);

        if(!suspendedUserAccount){
            return res.status(400).send("Something went wrong");
        }

        res.status(200).send('Account suspended');
    }

    static async f(req: express.Request, res: express.Response, next: express.NextFunction) {

    }
}