import { Request, Response } from "express";
import User from "../modules/user.model";
import md5 from "md5";
import {
  generateRandomString,
  generateRandomNumber,
} from "../../helpers/generate";

export const register = async (req: Request, res: Response) => {
  const existEmail = await User.findOne({
    email: req.body.email,
    deleted: false,
  });
  if (!existEmail) {
    req.body.password = md5(req.body.password);
    const user = new User({
      fullName: req.body.fullName,
      email: req.body.email,
      password: req.body.password,
      token: generateRandomString(30),
    });

    await user.save();

    const token = user.token;

    res.cookie("token", token);
    res.json({
      code: 200,
      message: "Đăng ký thành công!",
      user: user,
      token: token,
    });
  } else {
    res.json({
      code: 400,
      message: "Email đã tồn tại, đăng ký thất bại!",
    });
  }
};

export const login = async (req: Request, res: Response) => {
  const email: string = req.body.email;
  const password: string = req.body.password;
  const user = await User.findOne({
    email: email,
    deleted: false,
  });
  if (!user) {
    res.json({
      code: 400,
      message: "Không tồn tại email!",
    });
    return;
  }
  if (user.password !== md5(password)) {
    res.json({
      code: 400,
      message: "Sai mật khẩu!",
    });
    return;
  }
  const token = user.token;

  res.json({
    code: 200,
    message: "Đăng nhập thành công!",
    token: token,
  });
};

export const detail = async (req: Request, res: Response) => {
  const id: string = req.params.id;
  const user = await User.findOne({
    _id: id,
    deleted: false,
  }).select("-password -token");

  res.json({
    code: 200,
    message: "Lấy thông tin chi tiết thành công!",
    infor: user,
  });
};
