import express from "express";
import { 
  getAvailableTests, 
  getTestWithQuestions,
  getUserCompletedTests, 
  getUserStatistics, 
  startTest, 
  submitTestResults 
} from "../controllers/testController.js";

const router = express.Router();

// Public routes (no authentication required for viewing tests)
router.get("/available", getAvailableTests);
router.get("/:testId/questions", getTestWithQuestions);

// Protected routes (require authentication)
// Note: In a real app, you'd add authentication middleware here
// For now, derive user from header for development
router.use((req, res, next) => {
  const headerUserId = req.header('X-User-Id');
  const parsedId = headerUserId ? Number(headerUserId) : NaN;
  const userId = Number.isFinite(parsedId) && parsedId > 0 ? parsedId : 1;
  req.user = { id: userId };
  next();
});

router.get("/completed", getUserCompletedTests);
router.get("/statistics", getUserStatistics);
router.post("/start/:testId", startTest);
router.post("/submit", submitTestResults);

export default router;
