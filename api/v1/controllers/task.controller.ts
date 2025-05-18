import { Request, Response } from "express";
import Task from "../modules/task.model";
import paginationHelper from "../../../helpers/pagination";
import searchHelper from "../../../helpers/search";

export const index = async (req: Request, res: Response) => {
  // Filter
  interface Find {
    deleted: boolean;
    status?: string;
    title?: RegExp;
  }
  const find: Find = {
    deleted: false,
  };
  if (req.query.status) {
    find.status = req.query.status.toString();
  }
  // End Filter

  // Search
  const objectSearch = searchHelper(req.query);

  if (objectSearch.regex) {
    find.title = objectSearch.regex;
  }
  // End: Search
  // Sort
  let sort = {};
  if (req.query.sortKey && req.query.sortValue) {
    const sortKey = req.query.sortKey.toLocaleString();
    sort[sortKey] = req.query.sortValue;
  }
  // End Sort

  // Pagination
  // Công thức phân trang (Skip)= (CurrentPage - 1) * LimtIems;
  let initPagination = {
    currentPage: 1,
    limitItems: 2,
  };

  const countTasks = await Task.countDocuments(find);
  const objectPagination = paginationHelper(
    initPagination,
    req.query,
    countTasks
  );
  // End Pagination

  const tasks = await Task.find(find)
    .sort(sort)
    .limit(objectPagination.limitItems)
    .skip(objectPagination.skip);
  //   console.log(tasks);

  res.json({ tasks });
};

export const detail = async (req: Request, res: Response) => {
  const id = req.params.id;
  const task = await Task.findOne({
    _id: id,
    deleted: false,
  });
  console.log(task);

  res.json({ task });
};

export const changeStatus = async (req: Request, res: Response) => {
  try {
    const id: string = req.params.id;
    const status: string = req.body.status;
    await Task.updateOne(
      { _id: id },
      {
        status: status,
      }
    );

    res.json({
      code: 200,
      message: "Cập nhật trạng thái thành công!",
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Không tồn tại!",
    });
  }
};

export const changeMulti = async (req: Request, res: Response) => {
  try {
    // const { ids, keyword, value } = req.body; // Detructuring
    enum Key {
      STATUS = "status",
      DELETE = "delete",
    }

    const ids: string[] = req.body.ids;
    const keyword: string = req.body.keyword;
    const value: string = req.body.value;

    switch (keyword) {
      case Key.STATUS:
        await Task.updateMany(
          {
            _id: { $in: ids },
          },
          {
            status: value,
          }
        );
        res.json({
          code: 200,
          message: "Cập nhật trạng thái thành công!",
        });
        break;
      case Key.DELETE:
        await Task.updateMany(
          {
            _id: { $in: ids },
          },
          {
            deleted: true,
            deletedAt: new Date(),
          }
        );
        res.json({
          code: 200,
          message: "Xóa thành công!",
        });
        break;
      default:
        res.json({
          code: 400,
          message: "Không tồn tại!",
        });
        break;
    }
  } catch (error) {
    res.json({
      code: 400,
      message: "Không tồn tại!",
    });
  }
};

export const create = async (req: Request, res: Response) => {
  try {
    const task = new Task(req.body);
    const data = await task.save();
    res.json({ code: 200, message: "Tạo mới thành công!", data: data });
  } catch (error) {
    res.json({ code: 400, message: "Tạo mới thất bại!" });
  }
};

export const edit = async (req: Request, res: Response) => {
  try {
    const id: string = req.params.id;
    await Task.updateOne({ _id: id }, req.body);
    res.json({ code: 200, message: "Chỉnh sửa thành công!" });
  } catch (error) {
    res.json({ code: 400, message: "Chỉnh sửa thất bại!" });
  }
};

export const deleteTask = async (req: Request, res: Response) => {
  try {
    const id: string = req.params.id;
    await Task.updateOne(
      { _id: id },
      {
        deleted: true,
        deletedAt: new Date(),
      }
    );
    res.json({ code: 200, message: "Xóa thành công!" });
  } catch (error) {
    res.json({ code: 400, message: "Xóa thất bại!" });
  }
};
