import { Commands } from '../types/util'
import { Request } from 'express';
import { Payload } from '../service/secureAuth';

export interface RequestCommand extends Request {
    commandName: Commands,
    commandParams: string[],
    payload: Payload,
}