import { Express } from "express";
import { taskRoutes } from "./task.route";
import { userRoutes } from "./user.route";

const mainV1Routes = (app: Express): void => {
  const version = "/api/v1";
  app.use(version + "/tasks", taskRoutes);
  app.use(version + "/user", userRoutes);
};

export default mainV1Routes;
