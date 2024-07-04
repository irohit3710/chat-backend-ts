import { Router } from "express";
import { AdminController } from "../../controller/admin.controller";


export default class AdminRouter{
    public router: Router;

    constructor(){
        this.router = Router();
        this.routes()
    }

    public routes(): void {
        // GET
        this.router.get('/allUsers',AdminController.getAllUsers);
        this.router.get('/allGroups',AdminController.getAllGroups)
        this.router.get('/allReports',AdminController.getAllReports);
        this.router.get('/user/get/:userId',AdminController.getUserById)
        this.router.get('/user/suspend/:userId',AdminController.SuspendUserAccount)

        // POST
        this.router.post('/create',AdminController.createAdmin);
        this.router.post('/login',AdminController.adminLogin);
    }
}