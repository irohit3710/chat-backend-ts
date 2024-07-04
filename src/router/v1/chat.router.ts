import { Router } from "express";
import { ChatController } from "../../controller/chat.controller";
import { UserController } from "../../controller/user.controller";


export default class ChatRouter{
    public router: Router;

    constructor(){
        this.router = Router();
        this.routes()
    }

    public routes(): void {
        // GET
        this.router.get('/',ChatController.fetchChats);
        this.router.get('/health',UserController.V1health);

        // POST
        this.router.post('/',ChatController.accessChat);
        this.router.post('/group',ChatController.createGroupChat);
        
        //PUT
        this.router.put('/rename',ChatController.renameGroupChat);
        this.router.put('/groupremove',ChatController.removeFromGroup);
        this.router.put('/groupadd',ChatController.addToGroup);
        
        
    }
}