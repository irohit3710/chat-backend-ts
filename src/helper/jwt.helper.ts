import jwt from 'jsonwebtoken';
import { CONFIG } from '../config/environment';

export default class JWTHelper {

    static verify(header: any){
        const decoded = jwt.verify(header, CONFIG.jwt.secret) as any;
        return decoded;
    }
}