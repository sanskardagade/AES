import sql from "../config/neonsetup.js";

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


