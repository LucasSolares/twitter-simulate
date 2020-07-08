import { Response } from 'express';
import { ErrorCodes, SuccessCodes} from '../api/util/types/httpCodes';

interface HTTPResponse {
    message: string,
    data?: any
}

export interface HTTPError extends HTTPResponse{
    code: ErrorCodes,
}

export interface HTTPSuccess extends HTTPResponse {
    code: SuccessCodes,
}

export const success = (res: Response, data: HTTPSuccess) => res.status(data.code).send(data);

export const error = (res: Response, data: HTTPError) => res.status(data.code).send(data);
