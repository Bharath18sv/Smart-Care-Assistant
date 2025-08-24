import { Router } from "express";
import { registerPatient } from "../controllers/patient.controllers.js"
import {
  registerDoctor,
  loginDoctor,
  refreshAccessToken,
  addPatient,
  getPatientsForDoctor,
  getCurrentDoctor
} from "../controllers/doctor.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";

const router = Router();

//unsecured routes
router.route("/login").post(loginDoctor);
router.route("/refreshToken").post(refreshAccessToken);

//secured routes
router.route("/registerPatient").post(verifyJwt, registerPatient);
router.route("/addPatient").post(verifyJwt, addPatient);
router.route("/").get(verifyJwt, getPatientsForDoctor);
router.route("/me").get(verifyJwt, getCurrentDoctor);

export default router;
