import { Router } from "express";
import { CommunityController } from "../../controller/community.controller";


export default class CommunityRouter{
    public router: Router;

    constructor(){
        this.router = Router();
        this.routes()
    }

    public routes(): void {
        // GET
        this.router.get('/getNearbyUsers', CommunityController.nearbyLocations);
        
        // POST
        this.router.post('/setLocation', CommunityController.setLocation);
        
    }
}