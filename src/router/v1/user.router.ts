import { Router } from "express";
import { JitsiController } from "../../controller/jitsi.controller";
import { UserController } from "../../controller/user.controller";
import { AuthMiddleware } from "../../middleware/authMiddleware";


export default class UserRouter{
    public router: Router;

    constructor(){
        this.router = Router();
        this.routes()
    }

    public routes(): void {
        //GET
        this.router.get('/jitsi',AuthMiddleware.userAuthMiddleware,JitsiController.getJistiJwtToken);
        this.router.get('/',AuthMiddleware.userAuthMiddleware,UserController.getAllUsers);


        //POST
        this.router.post('/',UserController.registerUser);
        this.router.post('/login',UserController.authUser);
        this.router.post('/forgotPassword',UserController.forgotPassword);
        this.router.post('/password-reset/:userId/:token',UserController.passwordReset);

        //PUT
        this.router.put('/private/profile',AuthMiddleware.userAuthMiddleware, UserController.makeProfilePrivate);
        
    }
}