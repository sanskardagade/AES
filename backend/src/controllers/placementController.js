import sql from "../config/neonsetup.js";

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
          COALESCE(us.total_points, 0) AS total_points
        FROM users u
        LEFT JOIN user_statistics us ON us.user_id = u.id
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
        COALESCE(rc.recent_tests, '[]'::json) AS recent_tests
      FROM ranked r
      LEFT JOIN recent rc ON rc.user_id = r.user_id
      ORDER BY r.rank ASC, r.user_id ASC;
    `;

    const students = rows.map(row => ({
      id: row.user_id,
      name: row.name,
      email: row.email,
      department: "N/A",
      year: "N/A",
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


