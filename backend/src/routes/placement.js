import express from "express";
import { getPlacementStudents, getPlacementStudentDetails, recommendStudent, placementStream } from "../controllers/placementController.js";

const router = express.Router();

// In a real app, add auth middleware here to protect access
router.use((req, res, next) => {
  const headerUserId = req.header('X-User-Id');
  const parsedId = headerUserId ? Number(headerUserId) : NaN;
  const userId = Number.isFinite(parsedId) && parsedId > 0 ? parsedId : 1;
  req.user = { id: userId };
  next();
});
router.get("/students", getPlacementStudents);
router.get("/students/:userId", getPlacementStudentDetails);
router.post("/students/:userId/recommend", recommendStudent);
router.get("/stream", placementStream);

export default router;
 

