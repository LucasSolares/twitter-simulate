import { IncomingHttpHeaders } from 'http';

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from '../../../config';

export interface Payload {
    sub: string,
}

export const hashPassword = async (unhashedPassword: string) => {
    const salt = await bcrypt.genSalt();
    return await bcrypt.hash(unhashedPassword, salt);
}

export const comparePassword = async (unhashedPassword: string, hashedPassword: string) => 
    await bcrypt.compare(unhashedPassword, hashedPassword);

export const generateAndSignToken = (payload: Payload) => 
    jwt.sign(payload, config.SECRET, { expiresIn: '1h' });

export const validateToken = ({ authorization = '' }: {authorization?: IncomingHttpHeaders['authorization']}) => {
    try {
        const token = authorization.replace(/['"]+/g, '')
        if (!token) {
            throw { message: 'You dont send any token', code: 401 }
        }
        return jwt.verify(token, config.SECRET);
    } catch (error) {
        console.error(error);
        switch (error.message) {
            case 'jwt expired':
                throw { message: 'Token expired', code: 401 }

            default:
                error.code = 401;
                throw error
        }
    }
    
}