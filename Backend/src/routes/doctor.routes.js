import { Router } from "express";
import { registerPatient } from "../controllers/patient.controllers";
import {
  registerDoctor,
  loginDoctor,
  refreshAccessToken,
  addPatient,
  getPatientsForDoctor,
} from "../controllers/doctor.controller";
import { verifyJwt } from "../middlewares/auth.middleware";

const router = Router();

//unsecured routes
router.route("/login").post(loginDoctor);
router.route("/refreshToken").post(refreshAccessToken);

//secured routes
router.route("/registerPatient").post(verifyJwt, registerPatient);
router.route("/addPatient").post(verifyJwt, addPatient);
router.route("/").get(verifyJwt, getPatientsForDoctor);

export default router;
