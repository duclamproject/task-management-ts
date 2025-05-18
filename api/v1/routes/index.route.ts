import { Express } from "express";
import * as authMiddleware from "../middlewares/auth.middleware";
import { taskRoutes } from "./task.route";
import { userRoutes } from "./user.route";

const mainV1Routes = (app: Express): void => {
  const version = "/api/v1";
  app.use(version + "/tasks", authMiddleware.requireAuth, taskRoutes);
  app.use(version + "/user", userRoutes);
};

export default mainV1Routes;
