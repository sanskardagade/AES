import sql from "../config/neonsetup.js";

async function ensureTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS user_profiles (
      user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
      branch VARCHAR(255),
      phone VARCHAR(50),
      roll VARCHAR(100),
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
}

export const getProfile = async (req, res) => {
  try {
    await ensureTable();
    const userId = req.user.id;
    const rows = await sql`SELECT user_id, branch, phone, roll FROM user_profiles WHERE user_id = ${userId}`;
    const profile = rows[0] || { user_id: userId, branch: "", phone: "", roll: "" };
    res.json({ profile });
  } catch (err) {
    console.error('Error fetching profile:', err);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
};

export const updateProfile = async (req, res) => {
  try {
    await ensureTable();
    const userId = req.user.id;
    const { branch, phone, roll } = req.body;
    const rows = await sql`
      INSERT INTO user_profiles (user_id, branch, phone, roll)
      VALUES (${userId}, ${branch || ''}, ${phone || ''}, ${roll || ''})
      ON CONFLICT (user_id) DO UPDATE SET
        branch = EXCLUDED.branch,
        phone = EXCLUDED.phone,
        roll = EXCLUDED.roll,
        updated_at = CURRENT_TIMESTAMP
      RETURNING user_id, branch, phone, roll
    `;
    res.json({ profile: rows[0] });
  } catch (err) {
    console.error('Error updating profile:', err);
    res.status(500).json({ error: 'Failed to update profile' });
  }
};


