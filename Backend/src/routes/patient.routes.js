import { Router } from "express";
import {
  registerPatient,
  loginPatient,
  refreshAccessToken,
} from "../controllers/patient.controllers.js";

const router = Router();

//unsecured routes
router.route("/register").post(registerPatient);
router.route("/login").post(loginPatient);
router.route("/refreshToken").post(refreshAccessToken);
