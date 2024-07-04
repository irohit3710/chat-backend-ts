import { Router } from "express";
import { MessageController } from "../../controller/message.controller";


export default class MessageRouter{
    public router: Router;

    constructor(){
        this.router = Router();
        this.routes()
    }

    public routes(): void {
        // GET
        this.router.get('/:chatId',MessageController.getAllMessages);
        
        //POST
        this.router.post('/',MessageController.sendMessage);
    }
}