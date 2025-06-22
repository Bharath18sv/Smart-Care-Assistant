import e from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = e();

//middlewares
app.use(
  //cross origin resource sharing, allows different frontend port to access backend with diff port
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(e.json({ limit: "16kb" }));

app.use(
  //encode the incoming request(like forms)
  e.urlencoded({
    extended: true, //easier to handle complex data
    limit: "16kb",
  })
);

app.use(e.static("public")); //serve static files in the public folder

app.use(cookieParser()); //helps read cookies from the browser

//import routes
import healthCheck from "./routes/healthcheck.routes.js";

//routes
app.use("/api/v1/healthcheck", healthCheck);

export default app;
