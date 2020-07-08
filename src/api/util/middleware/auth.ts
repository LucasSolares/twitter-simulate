import { Commands } from '../types/util';
import { Response, NextFunction } from 'express';
import { validateToken, Payload } from '../service/secureAuth';
import { RequestCommand } from '../interfaces/responseCommand';

import * as response from '../../../network/response';


export const ensureAuth = (req: RequestCommand, res: Response, next: NextFunction) => {
    try {

        const { body: { command } }: {body: { command: string }} = req;
        console.log(command)
        if (!command) {
            throw {code: 400, message: `You don't send any command`}
        }

        const commandStructure = command.split(' ');
        const commandName: Commands = commandStructure[0].toUpperCase() as Commands;
        commandStructure.splice(0,1);
        let commandStructureNormalize: string[] = [];
        
        for (let i = 0; i < commandStructure.length; i++) {
            if (commandStructure[i][0] === '"' && commandStructure[i][commandStructure[i].length - 1] === '"') {
                commandStructure[i] = commandStructure[i].split('"').join('')
                commandStructureNormalize.push(commandStructure[i])
                continue;
            }
            if(commandStructure[i].includes('"')) {
                let wordNormalized: string;
                let wordToNormalize = '';
                let iterator = 0;
                let nextPosition = i + 1;
                for (let j = nextPosition; j < commandStructure.length; j++) {
                    wordToNormalize += ` ${commandStructure[j]}`;
                    iterator++;  
                    if (commandStructure[j][commandStructure[j].length - 1] === '"'){
                        commandStructure.splice(nextPosition, iterator);
                        break;
                    }
                }
                wordNormalized = `${commandStructure[i].replace('"', '')}${wordToNormalize.replace('"', '')}`
                commandStructureNormalize.push(wordNormalized);
            } else {
                commandStructureNormalize.push(commandStructure[i])
            }
            
        }
        req.commandParams = commandStructureNormalize;
        req.commandName = commandName;
        switch (commandName) {
            
            case 'LOGIN':
            case 'REGISTER':
                next();
                break;

            default:
                req.payload = validateToken(req.headers) as Payload;
                next();
                break;
        }


    } catch (error) {
        console.error(error);
        response.error(res, { code: error.code || 500, message: error.message });
    } 
    

}