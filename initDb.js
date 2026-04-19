import pkg from 'pg';
const { Client } = pkg;

const connectionString = 'postgresql://postgres.erevwzaymsqqdjyzkolt:MitraStudy$51@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres';

const client = new Client({ connectionString });

const sql = `
-- Drop existing tables if repopulating
DROP TABLE IF EXISTS study_sessions CASCADE;
DROP TABLE IF EXISTS timetable_entries CASCADE;
DROP TABLE IF EXISTS topics CASCADE;
DROP TABLE IF EXISTS units CASCADE;
DROP TABLE IF EXISTS subjects CASCADE;
DROP TABLE IF EXISTS commitment_days CASCADE;
DROP TABLE IF EXISTS commitments CASCADE;
DROP TABLE IF EXISTS user_profiles CASCADE;

-- 1. Users Profile & Daily Routine
CREATE TABLE user_profiles (
    user_id UUID NOT NULL PRIMARY KEY, -- Links to auth.users without explicit constraint to prevent cross-schema issues from direct UI queries
    wake_up_time TIME NOT NULL DEFAULT '07:00:00',
    sleep_time TIME NOT NULL DEFAULT '23:00:00',
    preferred_session_length INT NOT NULL DEFAULT 60,
    break_between_sessions INT NOT NULL DEFAULT 15,
    max_daily_study_hours INT NOT NULL DEFAULT 6,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Fixed Commitments (College, Meals, Gym, etc.)
CREATE TABLE commitments (
    id VARCHAR(50) PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES user_profiles(user_id) ON DELETE CASCADE,
    label VARCHAR(255) NOT NULL,
    commitment_type VARCHAR(50) NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL
);

CREATE TABLE commitment_days (
    commitment_id VARCHAR(50) REFERENCES commitments(id) ON DELETE CASCADE,
    day_of_week VARCHAR(15) NOT NULL,
    PRIMARY KEY (commitment_id, day_of_week)
);

-- 3. Syllabus Management
CREATE TABLE subjects (
    id VARCHAR(50) PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES user_profiles(user_id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    difficulty VARCHAR(20) NOT NULL DEFAULT 'medium'
);

CREATE TABLE units (
    id VARCHAR(50) PRIMARY KEY,
    subject_id VARCHAR(50) NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    sort_order INT DEFAULT 0
);

CREATE TABLE topics (
    id VARCHAR(50) PRIMARY KEY,
    unit_id VARCHAR(50) NOT NULL REFERENCES units(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    is_completed BOOLEAN NOT NULL DEFAULT FALSE,
    sort_order INT DEFAULT 0
);

-- 4. Planner & Timetable
CREATE TABLE timetable_entries (
    id VARCHAR(50) PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES user_profiles(user_id) ON DELETE CASCADE,
    subject_id VARCHAR(50) NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    subject_name VARCHAR(255), 
    topic_name VARCHAR(255),
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    day_of_week VARCHAR(15) NOT NULL
);

-- 5. Pomodoro Analytics Tracking
CREATE TABLE study_sessions (
    id VARCHAR(50) PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES user_profiles(user_id) ON DELETE CASCADE,
    subject_id VARCHAR(50) NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    session_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    minutes_studied INT NOT NULL
);

-- RLS Enable (to ensure security from frontend)
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE commitments ENABLE ROW LEVEL SECURITY;
ALTER TABLE commitment_days ENABLE ROW LEVEL SECURITY;
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE units ENABLE ROW LEVEL SECURITY;
ALTER TABLE topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE timetable_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_sessions ENABLE ROW LEVEL SECURITY;

-- Creating generic policy enabling all operations for the logged-in user on their own data
CREATE POLICY "Allow all actions for user on profile" ON user_profiles FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Allow all actions for user on commitments" ON commitments FOR ALL USING (auth.uid() = user_id);
-- commitment_days bypasses direct user check since it cascades/joins locally
CREATE POLICY "Allow all actions on commitment_days" ON commitment_days FOR ALL USING (true); 
CREATE POLICY "Allow all actions for user on subjects" ON subjects FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Allow all actions on units" ON units FOR ALL USING (true);
CREATE POLICY "Allow all actions on topics" ON topics FOR ALL USING (true);
CREATE POLICY "Allow all actions for user on timetable" ON timetable_entries FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Allow all actions for user on sessions" ON study_sessions FOR ALL USING (auth.uid() = user_id);

`;

async function initDb() {
  try {
    await client.connect();
    console.log("Connected. Executing schema initialization...");
    await client.query(sql);
    console.log("✅ Initialization successful!");
  } catch (err) {
    console.error("❌ Initialization Error:", err);
  } finally {
    await client.end();
  }
}

initDb();
