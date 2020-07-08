import { HTTPError } from '../../../network/response';

export interface Validation {
    condition: boolean;
    error: HTTPError
}