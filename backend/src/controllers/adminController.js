import sql from "../config/neonsetup.js";
import fs from "fs";
import path from "path";
import XLSX from "xlsx";

export const listTests = async (_req, res) => {
  try {
    const tests = await sql`
      SELECT id, title, subject, description, duration_minutes, total_questions, total_points, difficulty, is_active
      FROM tests
      ORDER BY id DESC
    `;
    res.json({ tests });
  } catch (err) {
    console.error("Error listing tests:", err);
    res.status(500).json({ error: "Failed to list tests" });
  }
};

export const createTest = async (req, res) => {
  try {
    const { title, subject, description, duration_minutes, total_questions, total_points, difficulty } = req.body;
    if (!title || !subject || !duration_minutes || !total_points || !difficulty) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const rows = await sql`
      INSERT INTO tests (title, subject, description, duration_minutes, total_questions, total_points, difficulty, is_active)
      VALUES (${title}, ${subject}, ${description || ''}, ${duration_minutes}, ${total_questions || 0}, ${total_points}, ${difficulty}, true)
      RETURNING id, title, subject, description, duration_minutes, total_questions, total_points, difficulty, is_active
    `;
    res.status(201).json({ test: rows[0] });
  } catch (err) {
    console.error("Error creating test:", err);
    res.status(500).json({ error: "Failed to create test" });
  }
};

export const deleteTest = async (req, res) => {
  try {
    const { testId } = req.params;
    await sql`DELETE FROM tests WHERE id = ${testId}`;
    res.json({ message: "Test deleted" });
  } catch (err) {
    console.error("Error deleting test:", err);
    res.status(500).json({ error: "Failed to delete test" });
  }
};

export const updateTest = async (req, res) => {
  try {
    const { testId } = req.params;
    const { title, subject, description, duration_minutes, total_questions, total_points, difficulty, is_active } = req.body;
    const rows = await sql`
      UPDATE tests SET 
        title = COALESCE(${title}, title),
        subject = COALESCE(${subject}, subject),
        description = COALESCE(${description}, description),
        duration_minutes = COALESCE(${duration_minutes}, duration_minutes),
        total_questions = COALESCE(${total_questions}, total_questions),
        total_points = COALESCE(${total_points}, total_points),
        difficulty = COALESCE(${difficulty}, difficulty),
        is_active = COALESCE(${is_active}, is_active),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${testId}
      RETURNING id, title, subject, description, duration_minutes, total_questions, total_points, difficulty, is_active
    `;
    if (rows.length === 0) return res.status(404).json({ error: 'Test not found' });
    res.json({ test: rows[0] });
  } catch (err) {
    console.error('Error updating test:', err);
    res.status(500).json({ error: 'Failed to update test' });
  }
};

export const listQuestions = async (req, res) => {
  try {
    const { testId } = req.params;
    const questions = await sql`
      SELECT id, test_id, question_text, option_a, option_b, option_c, option_d, correct_answer, points
      FROM questions
      WHERE test_id = ${testId}
      ORDER BY id ASC
    `;
    res.json({ questions });
  } catch (err) {
    console.error("Error listing questions:", err);
    res.status(500).json({ error: "Failed to list questions" });
  }
};

export const createQuestion = async (req, res) => {
  try {
    const { testId } = req.params;
    const { question_text, option_a, option_b, option_c, option_d, correct_answer, points } = req.body;
    if (!question_text || !option_a || !option_b || !option_c || !option_d || !correct_answer) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const rows = await sql`
      INSERT INTO questions (test_id, question_text, option_a, option_b, option_c, option_d, correct_answer, points)
      VALUES (${testId}, ${question_text}, ${option_a}, ${option_b}, ${option_c}, ${option_d}, ${correct_answer}, ${points || 1})
      RETURNING id, test_id, question_text, option_a, option_b, option_c, option_d, correct_answer, points
    `;
    // Update total_questions if provided or increment based on count
    await sql`UPDATE tests SET total_questions = (SELECT COUNT(*) FROM questions WHERE test_id = ${testId}) WHERE id = ${testId}`;
    res.status(201).json({ question: rows[0] });
  } catch (err) {
    console.error("Error creating question:", err);
    res.status(500).json({ error: "Failed to create question" });
  }
};

export const deleteQuestion = async (req, res) => {
  try {
    const { questionId } = req.params;
    const rows = await sql`DELETE FROM questions WHERE id = ${questionId} RETURNING test_id`;
    if (rows.length > 0) {
      const testId = rows[0].test_id;
      await sql`UPDATE tests SET total_questions = (SELECT COUNT(*) FROM questions WHERE test_id = ${testId}) WHERE id = ${testId}`;
    }
    res.json({ message: "Question deleted" });
  } catch (err) {
    console.error("Error deleting question:", err);
    res.status(500).json({ error: "Failed to delete question" });
  }
};


// Generate and send a sample Excel template for questions
export const downloadQuestionsTemplate = async (_req, res) => {
  try {
    const rows = [
      [
        "Question Text",
        "Option A",
        "Option B",
        "Option C",
        "Option D",
        "Correct Answer (A-D)",
        "Points (optional)",
      ],
      [
        "What is 2 + 2?",
        "3",
        "4",
        "5",
        "6",
        "B",
        1,
      ],
    ];
    const worksheet = XLSX.utils.aoa_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Questions");

    const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", 'attachment; filename="questions_template.xlsx"');
    return res.status(200).send(buffer);
  } catch (err) {
    console.error("Error generating template:", err);
    return res.status(500).json({ error: "Failed to generate template" });
  }
};

// Parse uploaded Excel and bulk insert questions for a test
export const bulkUploadQuestions = async (req, res) => {
  try {
    const { testId } = req.params;
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const filePath = req.file.path;
    const workbook = XLSX.read(fs.readFileSync(filePath));
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const json = XLSX.utils.sheet_to_json(sheet, { defval: "" });

    const toInsert = [];
    for (const row of json) {
      const question_text = row["Question Text"] || row["question"] || row["Question"];
      const option_a = row["Option A"] || row["A"] || row["Option a"]; 
      const option_b = row["Option B"] || row["B"] || row["Option b"]; 
      const option_c = row["Option C"] || row["C"] || row["Option c"]; 
      const option_d = row["Option D"] || row["D"] || row["Option d"]; 
      const correct_answer_raw = row["Correct Answer (A-D)"] || row["Correct"] || row["Answer"] || row["Correct Answer"];
      const points = Number(row["Points (optional)"] || row["Points"] || 1);

      const correct_answer = String(correct_answer_raw || "").toUpperCase().trim();

      if (!question_text || !option_a || !option_b || !option_c || !option_d || !["A", "B", "C", "D"].includes(correct_answer)) {
        // skip invalid rows silently
        continue;
      }
      toInsert.push({ question_text, option_a, option_b, option_c, option_d, correct_answer, points: Number.isFinite(points) ? points : 1 });
    }

    if (toInsert.length === 0) {
      return res.status(400).json({ error: "No valid questions found in file" });
    }

    for (const q of toInsert) {
      await sql`
        INSERT INTO questions (test_id, question_text, option_a, option_b, option_c, option_d, correct_answer, points)
        VALUES (${testId}, ${q.question_text}, ${q.option_a}, ${q.option_b}, ${q.option_c}, ${q.option_d}, ${q.correct_answer}, ${q.points})
      `;
    }

    await sql`UPDATE tests SET total_questions = (SELECT COUNT(*) FROM questions WHERE test_id = ${testId}) WHERE id = ${testId}`;

    try { fs.unlinkSync(filePath); } catch (_) {}

    return res.status(201).json({ inserted: toInsert.length });
  } catch (err) {
    console.error("Error bulk uploading questions:", err);
    return res.status(500).json({ error: "Failed to upload questions" });
  }
};


