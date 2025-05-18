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
