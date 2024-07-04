import { Router } from "express";
import { PaymentController } from "../../controller/payment.controller";
import { AuthMiddleware } from "../../middleware/authMiddleware";


export default class PaymentRouter{
    public router: Router;

    constructor(){
        this.router = Router();
        this.routes()
    }

    public routes(): void {
        // GET
        this.router.get('/get/key',AuthMiddleware.userAuthMiddleware,PaymentController.getKey);
        
        //POST
        this.router.post('/checkout',AuthMiddleware.userAuthMiddleware,PaymentController.checkoutCreate);
        this.router.post('/verify',PaymentController.verifyPayment);
    }
}