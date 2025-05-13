import { Router, Request, Response } from "express";
import Task from "../../modules/task.model";
const router: Router = Router();

router.get("/", async (req: Request, res: Response) => {
  const tasks = await Task.find({
    deleted: false,
  });
  console.log(tasks);

  res.json({ tasks });
});

router.get("/detail/:id", async (req: Request, res: Response) => {
  const id = req.params.id;
  const task = await Task.findOne({
    _id: id,
    deleted: false,
  });
  console.log(task);

  res.json({ task });
});

export const taskRoutes: Router = router;
