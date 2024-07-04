import express from 'express'
import { UserDao } from '../lib/dao/user.dao';
import tokenModel from '../models/token.model';
import { Utility } from '../util/util';

export class UserController {
    static async forgotPassword(req: express.Request, res: express.Response, next: express.NextFunction) {
        try {
            const email = req.body.email;
            if (!email) {
                return res.status(500).send("Internal Server Errorrrr");
            }

            const user = await UserDao.getUserByEmail(email);
            if (!user) {
                return res.status(400).send("User with given email doesn't exist");
            }
            const token: any = await UserDao.getTokenByUserId(user._id);
            if (!token) {
                const newToken = new tokenModel({
                    userId: user._id,
                    token: crypto.randomUUID().toString(),
                });
                await newToken.save();
            }
            const link = `${process.env.BASE_URL}/api/user/password-reset/${user._id}/${token.token}`;
            const bodyy = {
                message: "password reset link sent to your email account",
                link: link,
            }
            res.send(bodyy);
        } catch (error) {
            next(error);
        }
    }

    static async passwordReset(req: express.Request, res: express.Response, next: express.NextFunction) {
        try {
            const password = req.body.password;
            const userId = req.params.userId;
            const tokenValue = req.params.token;
            if (!password) {
                return res.status(500).send("Internal server Error");
            }

            const user = await UserDao.getUserById(userId);
            if (!user) {
                return res.status(400).send("invalid link or expired");
            }
            const token = await UserDao.getTokenByUserIdAndToken(userId, tokenValue);
            if (!token) {
                return res.status(400).send("Invalid link or expired");
            }

            const hashedPassword = Utility.createPasswordHash(password);

            const saveNewPassword = await UserDao.updateUserPassword(userId, hashedPassword);
            if (!saveNewPassword) {
                return res.status(404).send('Something went wrong');
            }

            const tokenDelete = await UserDao.deleteExistingToken(userId, tokenValue);
            if (!tokenDelete) {
                console.log('Something went wrong while token delete');
            }
            const bodyy = {
                message: "Password Reset Successfully",
                pass: password,
                hPass: hashedPassword,
            }
            res.send(bodyy);
        } catch (error) {
            next(error);
        }
    }

    static async getAllUsers(req: express.Request, res: express.Response, next: express.NextFunction) {
        try {
            const keyword = req.query.search;
            const userId = req.user._id;
            let query: any = {};
            if (keyword) {
                query = {
                    $or: [
                        { name: { $regex: req.query.search, $options: "i" } },
                        { email: { $regex: req.query.search, $options: "i" } },
                    ],
                }
            }

            const users = await UserDao.getAllMatchingUsers(query, userId);
            res.status(200).send(users);
        } catch (error) {
            next(error);
        }
    }
    static async registerUser(req: express.Request, res: express.Response, next: express.NextFunction) {
        try {
            const { name, email, password, pic } = req.body;

            if (!name || !email || !password) {
                res.status(400);
                throw new Error("Please Enter all the Feilds");
            }

            const userExist = await UserDao.getUserByEmail(email);
            if (userExist) {
                return res.status(400).send('User already exist');
            }
            const hashedPassword = Utility.createPasswordHash(password);
            const payload = {
                name,
                email,
                password: hashedPassword,
                pic,
            }

            const newUser = await UserDao.createUser(payload);

            if (!newUser) {
                return res.status(400).send("Something went wrong");
            }

            const response = {
                _id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                isAdmin: newUser.isAdmin,
                pic: newUser.pic,
                token: Utility.generateJwtToken(newUser._id),
            }
            res.status(200).send(response);
        } catch (error) {
            next(error);
        }
    }

    static async authUser(req: express.Request, res: express.Response, next: express.NextFunction) {
        try {
            const { email, password } = req.body;

            const user = await UserDao.getUserByEmail(email);

            if (!user) {
                return res.status(404).send("User not found");
            }

            const passwordMatched = await Utility.comparePasswordHash(user.password, password);
            if (passwordMatched) {
                res.status(200).send({
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    isAdmin: user.isAdmin,
                    pic: user.pic,
                    token: Utility.generateJwtToken(user._id),
                    private: user.private
                })
            }
            else {
                return res.status(400).send('Invalid Email or Password');
            }
        } catch (error) {
            next(error);
        }
    }

    static async makeProfilePrivate(req: express.Request, res: express.Response, next: express.NextFunction) {
        try {
            const user = req.user;
            if (!user) {
                return res.status(404).send("User not found");
            }

            const updatedUser = await UserDao.makeProfilePrivate(user._id, !user.private);
            if(!updatedUser){
                return res.status(400).send('Profile not updated');
            }
            res.status(200).send('Profile Updated');
        } catch (error) {
            next(error);
        }
    }

    static async V1health(req: express.Request, res: express.Response, next: express.NextFunction) {
        try {
            let healthcheck = {
                message: 'OK',
                time: new Date().toLocaleString()
            };
            res.status(200).send(healthcheck)
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