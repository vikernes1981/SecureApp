import sqlite3 from 'sqlite3';

const database = new sqlite3.Database('./database.sqlite');

// SQLite Database Setup
database.serialize(() => {
    database.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL
        )
    `);
});

export default database;