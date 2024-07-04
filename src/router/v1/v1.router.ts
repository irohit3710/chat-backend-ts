import { Router } from "express";
import UserRouter from "./user.router";
import ChatRouter from "./chat.router";
import MessageRouter from "./message.router";
import AdminRouter from "./admin.router";
import CommunityRouter from "./community.router";
import PaymentRouter from "./payment.router";
import { AuthMiddleware } from "../../middleware/authMiddleware";
import { UserController } from "../../controller/user.controller";


export default class V1Router{
    public router: Router;

    constructor(){
        this.router = Router();
        this.routes()
    }

    public routes(): void {
        //GET
        this.router.get('/health',UserController.V1health);
        // this.router.get('/chat', AuthMiddleware.userAuthMiddleware, UserController.getAllUsers);


        //POST
        // this.router.post('/chat',AuthMiddleware.userAuthMiddleware,UserController.registerUser);



        //Use
        this.router.use('/user',new UserRouter().router);
        this.router.use('/chat',AuthMiddleware.userAuthMiddleware,new ChatRouter().router);
        this.router.use('/message',AuthMiddleware.userAuthMiddleware,new MessageRouter().router);
        this.router.use('/admin',new AdminRouter().router);
        this.router.use('/community',new CommunityRouter().router);
        this.router.use('/payment',new PaymentRouter().router);
    }
}