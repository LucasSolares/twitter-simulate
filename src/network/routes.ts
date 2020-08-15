import { Application } from 'express';

import commandRouter from '../api/command/network';

const routes = (app: Application) => {
    app.use('/api/commands/v1', commandRouter)
}

export default routes;
