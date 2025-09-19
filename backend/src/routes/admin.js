import express from "express";
import { listTests, createTest, deleteTest, listQuestions, createQuestion, deleteQuestion, updateTest } from "../controllers/adminController.js";

const router = express.Router();

// In real app, secure with auth/role middleware
router.get("/tests", listTests);
router.post("/tests", createTest);
router.put("/tests/:testId", updateTest);
router.delete("/tests/:testId", deleteTest);

router.get("/tests/:testId/questions", listQuestions);
router.post("/tests/:testId/questions", createQuestion);
router.delete("/questions/:questionId", deleteQuestion);

export default router;


