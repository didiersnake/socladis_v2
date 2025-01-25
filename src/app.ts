require("dotenv").config();
import express, { Request, Response } from "express";
import config from "config";
import connectToDb from "./utils/connectToDb";
import log from "./utils/logger";
import router from "./routes";
import cookieParser from 'cookie-parser';
import cors from 'cors';

const app = express();

const corsOptions = {
  origin: "http://localhost:3000",
  // origin: "http://82.165.212.140:3000",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "Access-Control-Allow-Credentials",
  ],
};

app.use(cors(corsOptions));
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ limit: "100mb", extended: true }));
// app.use(express.json());
app.use(cookieParser());
app.use(router);

const port = config.get("port");

app.get("/",(req:Request,res:Response)=>{
  return res.json({
    status:"success",
  });
});

app.listen(port, () => {

  log.info(`App started at http://localhost:${port}`);

  connectToDb();
});

