-- AES Platform Database Schema

-- Users table (already exists, but let's ensure it has all needed columns)
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tests table
CREATE TABLE IF NOT EXISTS tests (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    subject VARCHAR(100) NOT NULL,
    description TEXT,
    duration_minutes INTEGER NOT NULL,
    total_questions INTEGER NOT NULL,
    total_points INTEGER NOT NULL,
    difficulty VARCHAR(20) NOT NULL CHECK (difficulty IN ('Beginner', 'Intermediate', 'Advanced')),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Test tags table (for subject tags)
CREATE TABLE IF NOT EXISTS test_tags (
    id SERIAL PRIMARY KEY,
    test_id INTEGER REFERENCES tests(id) ON DELETE CASCADE,
    tag_name VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User test results table
CREATE TABLE IF NOT EXISTS user_test_results (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    test_id INTEGER REFERENCES tests(id) ON DELETE CASCADE,
    score INTEGER NOT NULL,
    max_score INTEGER NOT NULL,
    percentage DECIMAL(5,2) NOT NULL,
    time_taken_minutes INTEGER NOT NULL,
    completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'completed' CHECK (status IN ('completed', 'in_progress', 'abandoned')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User statistics table (for caching performance data)
CREATE TABLE IF NOT EXISTS user_statistics (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    tests_completed INTEGER DEFAULT 0,
    average_score DECIMAL(5,2) DEFAULT 0,
    total_points INTEGER DEFAULT 0,
    current_rank INTEGER DEFAULT 0,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id)
);

-- Activity log table
CREATE TABLE IF NOT EXISTS activity_log (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    activity_type VARCHAR(50) NOT NULL,
    activity_description TEXT NOT NULL,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Questions table
CREATE TABLE IF NOT EXISTS questions (
    id SERIAL PRIMARY KEY,
    test_id INTEGER REFERENCES tests(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    option_a VARCHAR(500) NOT NULL,
    option_b VARCHAR(500) NOT NULL,
    option_c VARCHAR(500) NOT NULL,
    option_d VARCHAR(500) NOT NULL,
    correct_answer CHAR(1) NOT NULL CHECK (correct_answer IN ('A', 'B', 'C', 'D')),
    points INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Admin users table
CREATE TABLE IF NOT EXISTS admin_users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'placement_officer')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample tests
INSERT INTO tests (title, subject, description, duration_minutes, total_questions, total_points, difficulty) VALUES
('Mathematics - Advanced Level', 'Mathematics', 'Comprehensive mathematics test covering calculus, algebra, and geometry.', 90, 5, 100, 'Advanced'),
('Computer Science Fundamentals', 'Computer Science', 'Test your knowledge of programming concepts, algorithms, and data structures.', 60, 3, 75, 'Intermediate'),
('Physics - Mechanics', 'Physics', 'Advanced physics test focusing on mechanics, kinematics, and dynamics.', 75, 4, 85, 'Advanced'),
('Basic Mathematics', 'Mathematics', 'Fundamental mathematics concepts for beginners.', 45, 3, 50, 'Beginner'),
('Introduction to Programming', 'Computer Science', 'Basic programming concepts and syntax.', 60, 3, 70, 'Beginner');

-- Insert sample questions for Mathematics test
INSERT INTO questions (test_id, question_text, option_a, option_b, option_c, option_d, correct_answer, points) VALUES
(1, 'What is the derivative of x² + 3x + 2?', '2x + 3', '2x + 2', 'x + 3', '2x + 5', 'A', 20),
(1, 'Solve for x: 2x + 5 = 13', 'x = 4', 'x = 3', 'x = 5', 'x = 6', 'A', 20),
(1, 'What is the area of a circle with radius 5?', '25π', '10π', '50π', '5π', 'A', 20),
(1, 'Find the limit as x approaches 0 of (sin x)/x', '0', '1', '∞', 'undefined', 'B', 20),
(1, 'What is the integral of 2x?', 'x²', 'x² + C', '2x²', 'x² + 2x', 'B', 20);

-- Insert sample questions for Computer Science test
INSERT INTO questions (test_id, question_text, option_a, option_b, option_c, option_d, correct_answer, points) VALUES
(2, 'What is the time complexity of binary search?', 'O(n)', 'O(log n)', 'O(n²)', 'O(1)', 'B', 25),
(2, 'Which data structure follows LIFO principle?', 'Queue', 'Stack', 'Array', 'Linked List', 'B', 25),
(2, 'What is the output of: print(3 * 2 ** 2)', '12', '36', '18', '6', 'A', 25);

-- Insert sample questions for Physics test
INSERT INTO questions (test_id, question_text, option_a, option_b, option_c, option_d, correct_answer, points) VALUES
(3, 'What is the unit of force?', 'Joule', 'Newton', 'Watt', 'Pascal', 'B', 21),
(3, 'What is the acceleration due to gravity?', '9.8 m/s²', '10 m/s²', '8.9 m/s²', '11 m/s²', 'A', 21),
(3, 'What is the formula for kinetic energy?', 'mv', '½mv²', 'mgh', 'Fd', 'B', 21),
(3, 'What is the speed of light?', '3 × 10⁸ m/s', '3 × 10⁶ m/s', '3 × 10⁹ m/s', '3 × 10⁷ m/s', 'A', 22);

-- Insert admin users
INSERT INTO admin_users (username, email, password, role) VALUES
('admin', 'admin@aes.com', 'admin123', 'admin'),
('placement_officer', 'placement@aes.com', 'placement123', 'placement_officer');

-- Insert test tags
INSERT INTO test_tags (test_id, tag_name) VALUES
(1, 'Calculus'), (1, 'Algebra'), (1, 'Geometry'),
(2, 'Programming'), (2, 'Algorithms'), (2, 'Data Structures'),
(3, 'Mechanics'), (3, 'Kinematics'), (3, 'Dynamics'),
(4, 'Arithmetic'), (4, 'Basic Algebra'), (4, 'Geometry'),
(5, 'Variables'), (5, 'Loops'), (5, 'Functions'),
(6, 'Reactions'), (6, 'Compounds'), (6, 'Synthesis'),
(7, 'Poetry'), (7, 'Novels'), (7, 'Analysis'),
(8, 'Ancient'), (8, 'Medieval'), (8, 'Modern');

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_test_results_user_id ON user_test_results(user_id);
CREATE INDEX IF NOT EXISTS idx_user_test_results_test_id ON user_test_results(test_id);
CREATE INDEX IF NOT EXISTS idx_user_test_results_completed_at ON user_test_results(completed_at);
CREATE INDEX IF NOT EXISTS idx_activity_log_user_id ON activity_log(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_log_created_at ON activity_log(created_at);
CREATE INDEX IF NOT EXISTS idx_tests_subject ON tests(subject);
CREATE INDEX IF NOT EXISTS idx_tests_difficulty ON tests(difficulty);
