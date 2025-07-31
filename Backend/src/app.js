import e from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = e();

//middlewares
app.use(
  // // cross origin resource sharing, allows different frontend port to access backend with diff port
  // cors({
  //   origin: process.env.CORS_ORIGIN,
  //   credentials: true,
  // })
  cors()
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
import patientRouter from "./routes/patient.routes.js";
import doctorRouter from "./routes/doctor.routes.js";

//routes
app.use("/api/healthcheck", healthCheck);
app.use("/api/patients", patientRouter); //routes should always start with /
app.use("/api/doctors", doctorRouter);

export default app;
