import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { connect } from 'mongoose';

import routes from './network/routes';
import config from './config';

const initializeMongo = async () => {
    try {
        await connect(config.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true });
        startApp();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

const startApp = () => {
    try {
        const app = express();

        app.use(bodyParser.urlencoded({ extended: true }));
        app.use(bodyParser.json());
        app.use(cors());

        routes(app);

        app.listen(config.PORT, () => console.log('Connected on', `http://localhost:${config.PORT}`))

    } catch (error) {
        console.error(error);
        process.exit(1)
    }
}

initializeMongo();