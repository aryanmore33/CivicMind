const pool = require('../config/db');

// Initialize connection pool

const query = ` 
-- ==============================
-- ENUMS
-- ==============================

-- User role: citizen, authority, admin
CREATE TYPE user_role AS ENUM ('citizen', 'authority', 'admin');

-- Complaint status
CREATE TYPE complaint_status AS ENUM ('pending', 'in_progress', 'resolved');

-- Interaction type: like or comment
CREATE TYPE interaction_type AS ENUM ('like', 'comment');


-- ==============================
-- TABLE: users
-- ==============================
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role user_role NOT NULL DEFAULT 'citizen',
    profile_pic TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);


-- ==============================
-- TABLE: categories
-- (dynamic — allows adding new categories later)
-- ==============================
CREATE TABLE categories (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL
);


-- ==============================
-- TABLE: complaints
-- (category_id REMOVED)
-- ==============================
CREATE TABLE complaints (
    complaint_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    image_url TEXT,
    latitude NUMERIC(10,6),
    longitude NUMERIC(10,6),
    address TEXT,
    status complaint_status NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);


-- ==============================
-- NEW TABLE: complaint_categories
-- (link complaints ↔ categories)
-- ==============================
CREATE TABLE complaint_categories (
    id SERIAL PRIMARY KEY,
    complaint_id INT REFERENCES complaints(complaint_id) ON DELETE CASCADE,
    category_id INT REFERENCES categories(category_id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE (complaint_id, category_id)
);


-- ==============================
-- TABLE: interactions (likes + comments)
-- ==============================
CREATE TABLE interactions (
    interaction_id SERIAL PRIMARY KEY,
    complaint_id INT REFERENCES complaints(complaint_id) ON DELETE CASCADE,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    type interaction_type NOT NULL,
    comment_text TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- prevent same user liking same complaint multiple times
CREATE UNIQUE INDEX unique_like
ON interactions(complaint_id, user_id, type)
WHERE type = 'like';


-- ==============================
-- TABLE: notifications
-- ==============================
CREATE TABLE notifications (
    notification_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    complaint_id INT REFERENCES complaints(complaint_id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);


-- ==============================
-- TABLE: admin_logs
-- ==============================
CREATE TABLE admin_logs (
    log_id SERIAL PRIMARY KEY,
    authority_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    complaint_id INT REFERENCES complaints(complaint_id),
    action VARCHAR(200),
    created_at TIMESTAMP DEFAULT NOW()
);


`;

// Function to initialize the database schema
async function initializeDB() {
  try {
    const result = await pool.query(query);
    console.log(`Successfully Completed`);
  } catch (error) {
    console.log(error);
  }
}
initializeDB();
