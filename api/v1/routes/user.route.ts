import { Router } from "express";
import * as authenMiddleware from "../middlewares/auth.middleware";
const router: Router = Router();

import * as controller from "../controllers/user.controller";

router.post("/register", controller.register);

router.post("/login", controller.login);

router.get("/detail", authenMiddleware.requireAuth, controller.detail);

export const userRoutes: Router = router;
