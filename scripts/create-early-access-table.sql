-- Create early_access table
CREATE TABLE IF NOT EXISTS early_access (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(50) DEFAULT 'pending'
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_early_access_email ON early_access(email);
CREATE INDEX IF NOT EXISTS idx_early_access_created_at ON early_access(created_at);
