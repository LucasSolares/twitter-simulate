import { Router } from "express";
import { ensureAuth } from "../util/middleware/auth";
import { commandController } from '../controller/command';

const commandRouter = Router();

commandRouter.post("/", ensureAuth, commandController);

export default commandRouter;
