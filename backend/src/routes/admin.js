import express from "express";
import multer from "multer";
import { listTests, createTest, deleteTest, listQuestions, createQuestion, deleteQuestion, updateTest, downloadQuestionsTemplate, bulkUploadQuestions } from "../controllers/adminController.js";

const router = express.Router();

const upload = multer({ dest: "src/uploads/" });

// In real app, secure with auth/role middleware
router.get("/tests", listTests);
router.post("/tests", createTest);
router.put("/tests/:testId", updateTest);
router.delete("/tests/:testId", deleteTest);

router.get("/tests/:testId/questions", listQuestions);
router.post("/tests/:testId/questions", createQuestion);
router.delete("/questions/:questionId", deleteQuestion);

// Template download and bulk upload
router.get("/questions/template", downloadQuestionsTemplate);
router.post("/tests/:testId/questions/upload", upload.single("file"), bulkUploadQuestions);

export default router;


