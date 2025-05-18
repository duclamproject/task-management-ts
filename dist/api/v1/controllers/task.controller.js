"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTask = exports.edit = exports.create = exports.changeMulti = exports.changeStatus = exports.detail = exports.index = void 0;
const task_model_1 = __importDefault(require("../modules/task.model"));
const pagination_1 = __importDefault(require("../../../helpers/pagination"));
const search_1 = __importDefault(require("../../../helpers/search"));
const index = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const find = {
        deleted: false,
    };
    if (req.query.status) {
        find.status = req.query.status.toString();
    }
    const objectSearch = (0, search_1.default)(req.query);
    if (objectSearch.regex) {
        find.title = objectSearch.regex;
    }
    let sort = {};
    if (req.query.sortKey && req.query.sortValue) {
        const sortKey = req.query.sortKey.toLocaleString();
        sort[sortKey] = req.query.sortValue;
    }
    let initPagination = {
        currentPage: 1,
        limitItems: 2,
    };
    const countTasks = yield task_model_1.default.countDocuments(find);
    const objectPagination = (0, pagination_1.default)(initPagination, req.query, countTasks);
    const tasks = yield task_model_1.default.find(find)
        .sort(sort)
        .limit(objectPagination.limitItems)
        .skip(objectPagination.skip);
    res.json({ tasks });
});
exports.index = index;
const detail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const task = yield task_model_1.default.findOne({
        _id: id,
        deleted: false,
    });
    console.log(task);
    res.json({ task });
});
exports.detail = detail;
const changeStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const status = req.body.status;
        yield task_model_1.default.updateOne({ _id: id }, {
            status: status,
        });
        res.json({
            code: 200,
            message: "Cập nhật trạng thái thành công!",
        });
    }
    catch (error) {
        res.json({
            code: 400,
            message: "Không tồn tại!",
        });
    }
});
exports.changeStatus = changeStatus;
const changeMulti = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let Key;
        (function (Key) {
            Key["STATUS"] = "status";
            Key["DELETE"] = "delete";
        })(Key || (Key = {}));
        const ids = req.body.ids;
        const keyword = req.body.keyword;
        const value = req.body.value;
        switch (keyword) {
            case Key.STATUS:
                yield task_model_1.default.updateMany({
                    _id: { $in: ids },
                }, {
                    status: value,
                });
                res.json({
                    code: 200,
                    message: "Cập nhật trạng thái thành công!",
                });
                break;
            case Key.DELETE:
                yield task_model_1.default.updateMany({
                    _id: { $in: ids },
                }, {
                    deleted: true,
                    deletedAt: new Date(),
                });
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
    }
    catch (error) {
        res.json({
            code: 400,
            message: "Không tồn tại!",
        });
    }
});
exports.changeMulti = changeMulti;
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const task = new task_model_1.default(req.body);
        const data = yield task.save();
        res.json({ code: 200, message: "Tạo mới thành công!", data: data });
    }
    catch (error) {
        res.json({ code: 400, message: "Tạo mới thất bại!" });
    }
});
exports.create = create;
const edit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        yield task_model_1.default.updateOne({ _id: id }, req.body);
        res.json({ code: 200, message: "Chỉnh sửa thành công!" });
    }
    catch (error) {
        res.json({ code: 400, message: "Chỉnh sửa thất bại!" });
    }
});
exports.edit = edit;
const deleteTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        yield task_model_1.default.updateOne({ _id: id }, {
            deleted: true,
            deletedAt: new Date(),
        });
        res.json({ code: 200, message: "Xóa thành công!" });
    }
    catch (error) {
        res.json({ code: 400, message: "Xóa thất bại!" });
    }
});
exports.deleteTask = deleteTask;
