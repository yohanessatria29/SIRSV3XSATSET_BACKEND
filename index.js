import express from "express";
import session from "express-session";
import {} from "dotenv/config";
import { databaseRSOnline, databaseSIRS } from "./config/Database.js";
import router from "./routes/index.js";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

// 
app.use(express.json({ limit: '1mb' }));  

// cek ukuran payload
app.use((req, res, next) => {
  const bodySize = JSON.stringify(req.body).length; // Menghitung ukuran payload (dalam byte)
  const bodySizeInMB = bodySize / (1024 * 1024); // Menghitung ukuran dalam MB
  const maxSize = 1 * 1024 * 1024; // Maksimal ukuran payload yang diizinkan (10MB)

  if (bodySize > maxSize) {
    return res.status(413).send({
      status: false,
      message: "Payload terlalu besar, melebihi batas yang diperbolehkan (10MB)."
    });
  }

  next(); 
});

try {
  await databaseSIRS.authenticate();
  console.log("database sirs connected...");
} catch (error) {
  console.log(error);
}

app.use(
  session({
    secret: "a8d2c9b6-61f2-4e7a-a8cf-7f7d9a8978e4",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true },
  })
);

try {
  await databaseRSOnline.authenticate();
  console.log("database rsonline connected...");
} catch (error) {
  console.log(error);
}

app.use(cors({ credentials: true, origin: [process.env.ORIGIN] }));

// app.use(function(req, res, next){
//     res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
//     res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
//     res.setHeader('Access-Control-Allow-Credentials', true);
//     next();
// })

app.use(cookieParser());
app.use(express.json());
app.use(router);

app.listen(5001, () => {
  console.log("server running at port 5001");
});
