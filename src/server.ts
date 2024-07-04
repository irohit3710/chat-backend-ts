import express, { Router } from "express";
import Middleware from "./config/middleware";
import ErrorHandler from './helper/error.handler';
import Routes from './router/index.router';
import { DB } from "./config/DB";

export class Server {
    public app: express.Application;
    isDbConnected: boolean;
    constructor () { 
        this.app = express();
        this.isDbConnected = false;

        // DB connection 
        DB.connect(this);

        // Initializing app middlewares
        Middleware.init(this);

        // Intializing Routes
        Routes.init(this);

        // Error handling
        ErrorHandler.init(this);

    }
}