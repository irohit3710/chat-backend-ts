import { Router } from "express"
import V1Router from "./v1/v1.router";


export default class VersionRouter{
    public router: Router;

    constructor (){
        this.router = Router();
        this.routes();    
    }

    public routes(): void {
        this.router.use("/v1", new V1Router().router)
    }
}