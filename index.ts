import express, { Express } from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import * as database from "./config/database";
import mainV1Routes from "./api/routes/index.route";

dotenv.config();
database.connect();

const app: Express = express();
const port: number | string = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

app.use(cookieParser());

mainV1Routes(app);

app.listen(port, () => {
  console.log(`App is listening on port ${port}`);
});
