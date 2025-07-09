import { blink } from './blink'

export async function initializeDatabase() {
  try {
    // Test if tables exist by trying to query them
    try {
      await blink.db.games.list({ limit: 1 })
      console.log('Database tables already exist')
      return
    } catch {
      console.log('Setting up database tables...')
      await blink.sql`CREATE TABLE IF NOT EXISTS teams (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          color TEXT,
          sport TEXT,
          user_id TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );`;

      await blink.sql`CREATE TABLE IF NOT EXISTS players (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          team_id TEXT,
          user_id TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );`;

      await blink.sql`CREATE TABLE IF NOT EXISTS games (
          id TEXT PRIMARY KEY,
          user_id TEXT,
          sport_id TEXT,
          team1_id TEXT,
          team2_id TEXT,
          team1_score INTEGER DEFAULT 0,
          team2_score INTEGER DEFAULT 0,
          team1_fouls INTEGER DEFAULT 0,
          team2_fouls INTEGER DEFAULT 0,
          game_time INTEGER DEFAULT 0,
          shot_clock_time INTEGER DEFAULT 24,
          is_game_clock_running INTEGER DEFAULT 0,
          is_shot_clock_running INTEGER DEFAULT 0,
          current_period INTEGER DEFAULT 1,
          game_status TEXT DEFAULT 'active',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );`;
    }

    // Create some sample data to test the system
    console.log('Database initialization complete')
  } catch (error) {
    console.error('Database initialization error:', error)
  }
}