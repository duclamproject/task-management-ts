import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import * as database from "./config/database";
import Task from "./modules/task.model";

dotenv.config();
database.connect();

const app: Express = express();
const port: number | string = process.env.PORT || 3000;

app.get("/tasks", async (req: Request, res: Response) => {
  const tasks = await Task.find({
    deleted: false,
  });
  console.log(tasks);

  res.json({ tasks });
});

app.get("/tasks/detail/:id", async (req: Request, res: Response) => {
  const id = req.params.id;
  const task = await Task.findOne({
    _id: id,
    deleted: false,
  });
  console.log(task);

  res.json({ task });
});

app.listen(port, () => {
  console.log(`App is listening on port ${port}`);
});
