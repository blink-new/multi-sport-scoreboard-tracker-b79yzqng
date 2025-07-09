import { blink } from './blink'

export async function initializeDatabase() {
  try {
    // Test if tables exist by trying to query them
    try {
      await blink.db.games.list({ limit: 1 })
      console.log('Database tables already exist')
      return
    } catch (error) {
      console.log('Setting up database tables...')
      await blink.sql`
        CREATE TABLE teams (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          color TEXT
        );
      `;
    }

    // Create some sample data to test the system
    console.log('Database initialization complete')
  } catch (error) {
    console.error('Database initialization error:', error)
  }
}