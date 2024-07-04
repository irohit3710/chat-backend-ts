import express from 'express'
import Razorpay from 'razorpay';
import { OrderDao } from '../lib/dao/order.dao';
import { validatePaymentVerification } from 'razorpay/dist/utils/razorpay-utils';
import { PaymentDao } from '../lib/dao/payment.dao';

const instance = new Razorpay({ key_id: process.env.RAZORPAY_API_KEY || '', key_secret: process.env.RAZORPAY_API_SECRET })

export class PaymentController {
    static async checkoutCreate(req: express.Request, res: express.Response, next: express.NextFunction) {
        try {
            const amount = req.body.amount;
            const userId = req.body.userId;
            const options = {
                amount: amount,
                currency: "INR",
            }

            const order = await instance.orders.create(options);
            const orderpayload = {
                userId: userId,
                orderId: order.id,
                amount: order.amount,
            }

            const savedOrder = await OrderDao.createOrder(orderpayload);
            if (!savedOrder) {
                return res.status(404).send('Unable to create order');
            }

            res.status(200).json({
                success: true,
                orderId: order.id,
            })

        } catch (error) {
            next(error);
        }
    }

    static async verifyPayment(req: express.Request, res: express.Response, next: express.NextFunction) {
        try {
            const orderId = req.body.razorpay_order_id;
            const paymentId = req.body.razorpay_payment_i;
            const signature = req.body.razorpay_signature;

            const payload = {
                userId: '',
                orderId: orderId,
                amount: '',
                payment: paymentId,
                signature: signature,
            }

            const payment = await PaymentDao.createRazorpayPayment(payload);
            const result = validatePaymentVerification({ order_id: orderId, payment_id: paymentId }, signature, process.env.RAZORPAY_API_SECRET || '');

            let redirectUrl = '';
            if (result) {
                redirectUrl = `/payment/success/${signature}`
            }
            else {
                redirectUrl = `/payment/success/${signature}`
            }
            res.status(200).redirect(redirectUrl);
        } catch (error) {
            next(error);
        }
    }

    static async getKey(req: express.Request, res: express.Response, next: express.NextFunction) {
        try {
            const key  = process.env.RAZORPAY_API_KEY;
            res.status(200).send({key});
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