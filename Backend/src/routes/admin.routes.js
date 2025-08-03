import { Router } from "express";
import {
  registerAdmin,
  loginAdmin,
  logoutAdmin,
  addDoctor,
  getAllDoctors,
  getDoctorById,
  updateDoctor,
  approveDoctor,
  deleteDoctor,
  getDashboardStats,
} from "../controllers/admin.controllers.js";
import {
  verifyAdminJWT,
  requireAdminRole,
  checkPermission,
} from "../middlewares/adminAuth.middleware.js";

const router = Router();

// Public routes (no authentication required)
router.post("/register", registerAdmin);
router.post("/login", loginAdmin);

// Protected routes (authentication required)
router.use(verifyAdminJWT);

router.post("/logout", logoutAdmin);

// Dashboard
router.get(
  "/dashboard/stats",
  checkPermission("viewAnalytics"),
  getDashboardStats
);

// Doctor Management
router.post("/doctors", checkPermission("manageDoctors"), addDoctor);
router.get("/doctors", checkPermission("manageDoctors"), getAllDoctors);
router.get(
  "/doctors/:doctorId",
  checkPermission("manageDoctors"),
  getDoctorById
);
router.put(
  "/doctors/:doctorId",
  checkPermission("manageDoctors"),
  updateDoctor
);
router.put(
  "/doctors/:doctorId/approve",
  checkPermission("manageDoctors"),
  approveDoctor
);
router.delete(
  "/doctors/:doctorId",
  checkPermission("manageDoctors"),
  deleteDoctor
);

export default router;
