import sql from "../config/neonsetup.js";
import bus from "../events/bus.js";

export const getPlacementStudents = async (req, res) => {
  try {
    const rows = await sql` 
      WITH stats AS (
        SELECT 
          u.id AS user_id,
          u.name,
          u.email,
          COALESCE(us.tests_completed, 0) AS tests_completed,
          COALESCE(us.average_score, 0) AS average_score,
          COALESCE(us.total_points, 0) AS total_points,
          up.branch,
          up.roll
        FROM users u
        LEFT JOIN user_statistics us ON us.user_id = u.id
        LEFT JOIN user_profiles up ON up.user_id = u.id
      ),
      ranked AS (
        SELECT 
          *,
          RANK() OVER (ORDER BY total_points DESC) AS rank
        FROM stats
      ),
      recent AS (
        SELECT 
          utr.user_id,
          JSON_AGG(
            JSON_BUILD_OBJECT(
              'test', t.title,
              'score', utr.percentage,
              'date', TO_CHAR(utr.completed_at, 'YYYY-MM-DD')
            )
            ORDER BY utr.completed_at DESC
          ) FILTER (WHERE utr.user_id IS NOT NULL) AS recent_tests
        FROM user_test_results utr
        JOIN tests t ON t.id = utr.test_id
        WHERE utr.status = 'completed'
        GROUP BY utr.user_id
      )
      SELECT 
        r.user_id,
        r.name,
        r.email,
        r.tests_completed,
        r.average_score,
        r.total_points,
        r.rank,
        r.branch,
        r.roll,
        COALESCE(rc.recent_tests, '[]'::json) AS recent_tests
      FROM ranked r
      LEFT JOIN recent rc ON rc.user_id = r.user_id
      ORDER BY r.rank ASC, r.user_id ASC;
    `;

    const students = rows.map(row => ({
      id: row.user_id,
      name: row.name,
      email: row.email,
      department: row.branch || "N/A",
      year: row.roll || "N/A",
      testsCompleted: Number(row.tests_completed) || 0,
      averageScore: Math.round(Number(row.average_score) || 0),
      totalPoints: Number(row.total_points) || 0,
      rank: Number(row.rank) || 0,
      recentTests: Array.isArray(row.recent_tests) ? row.recent_tests : [],
      strengths: [],
      weaknesses: []
    }));

    res.json({ students });
  } catch (err) {
    console.error("Error fetching placement students:", err);
    // Fallback empty list to avoid frontend crashes
    res.json({ students: [] });
  }
};

export const getPlacementStudentDetails = async (req, res) => {
  try {
    const { userId } = req.params;
    const profile = await sql`
      SELECT u.id, u.name, u.email, up.branch, up.roll
      FROM users u
      LEFT JOIN user_profiles up ON up.user_id = u.id
      WHERE u.id = ${userId}
    `;
    if (profile.length === 0) return res.status(404).json({ error: 'Student not found' });

    const tests = await sql`
      SELECT t.title, utr.percentage, utr.score, utr.max_score, utr.time_taken_minutes, utr.completed_at
      FROM user_test_results utr
      JOIN tests t ON t.id = utr.test_id
      WHERE utr.user_id = ${userId} AND utr.status = 'completed'
      ORDER BY utr.completed_at DESC
      LIMIT 20
    `;

    res.json({
      student: {
        id: profile[0].id,
        name: profile[0].name,
        email: profile[0].email,
        department: profile[0].branch || 'N/A',
        year: profile[0].roll || 'N/A',
        tests: tests.map(r => ({
          title: r.title,
          percentage: Math.round(r.percentage || 0),
          score: r.score,
          maxScore: r.max_score,
          time: r.time_taken_minutes,
          date: r.completed_at
        }))
      }
    });
  } catch (err) {
    console.error('Error fetching student details:', err);
    res.status(500).json({ error: 'Failed to load student details' });
  }
};

export const recommendStudent = async (req, res) => {
  try {
    const { userId } = req.params;
    const { note } = req.body || {};
    await sql`
      INSERT INTO activity_log (user_id, activity_type, activity_description)
      VALUES (${userId}, 'recommended', ${note || 'Recommended for placement'})
    `;
    bus.emit('placement:update', { type: 'recommended', userId });
    res.json({ ok: true });
  } catch (err) {
    console.error('Error recommending student:', err);
    res.status(500).json({ error: 'Failed to recommend student' });
  }
};

// SSE stream for real-time placement updates
const sseClients = new Set();
export const placementStream = async (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders?.();
  sseClients.add(res);

  const send = async () => {
    try {
      const data = await (async () => {
        const resp = await getPlacementData();
        return resp;
      })();
      res.write(`data: ${JSON.stringify({ type: 'placement:update', data })}\n\n`);
    } catch (_) {}
  };

  const unsubscribe = bus.on('placement:update', send);

  // send initial snapshot
  await send();

  req.on('close', () => {
    unsubscribe?.();
    sseClients.delete(res);
    try { res.end(); } catch (_) {}
  });
};

async function getPlacementData() {
  const rows = await sql`
      WITH stats AS (
        SELECT 
          u.id AS user_id,
          u.name,
          u.email,
          COALESCE(us.tests_completed, 0) AS tests_completed,
          COALESCE(us.average_score, 0) AS average_score,
          COALESCE(us.total_points, 0) AS total_points,
          up.branch,
          up.roll
        FROM users u
        LEFT JOIN user_statistics us ON us.user_id = u.id
        LEFT JOIN user_profiles up ON up.user_id = u.id
      ),
      ranked AS (
        SELECT 
          *,
          RANK() OVER (ORDER BY total_points DESC) AS rank
        FROM stats
      ),
      recent AS (
        SELECT 
          utr.user_id,
          JSON_AGG(
            JSON_BUILD_OBJECT(
              'test', t.title,
              'score', utr.percentage,
              'date', TO_CHAR(utr.completed_at, 'YYYY-MM-DD')
            )
            ORDER BY utr.completed_at DESC
          ) FILTER (WHERE utr.user_id IS NOT NULL) AS recent_tests
        FROM user_test_results utr
        JOIN tests t ON t.id = utr.test_id
        WHERE utr.status = 'completed'
        GROUP BY utr.user_id
      )
      SELECT 
        r.user_id,
        r.name,
        r.email,
        r.tests_completed,
        r.average_score,
        r.total_points,
        r.rank,
        r.branch,
        r.roll,
        COALESCE(rc.recent_tests, '[]'::json) AS recent_tests
      FROM ranked r
      LEFT JOIN recent rc ON rc.user_id = r.user_id
      ORDER BY r.rank ASC, r.user_id ASC;
  `;

  const students = rows.map(row => ({
    id: row.user_id,
    name: row.name,
    email: row.email,
    department: row.branch || "N/A",
    year: row.roll || "N/A",
    testsCompleted: Number(row.tests_completed) || 0,
    averageScore: Math.round(Number(row.average_score) || 0),
    totalPoints: Number(row.total_points) || 0,
    rank: Number(row.rank) || 0,
    recentTests: Array.isArray(row.recent_tests) ? row.recent_tests : [],
    strengths: [],
    weaknesses: []
  }));

  return { students };
}


