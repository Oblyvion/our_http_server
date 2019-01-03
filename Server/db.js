const sqLite = require('sqlite3').verbose();

class DB {

    constructor(db_file = './db.sqlite3') {
        this.db = new sqLite.Database(db_file);
        this.db.exec('PRAGMA foreign_keys = ON');
    }

    create() {
        return new Promise((resolve, reject) => {
                this.db.serialize(() => {
                    this.db.run(`CREATE TABLE IF NOT EXISTS USERS
                    (
                    ID INTEGER PRIMARY KEY AUTOINCREMENT,
                    NAME TEXT NOT NULL UNIQUE,
                    PASSWORD TEXT
                    )`, err => {
                        if (err !== null) reject(err);
                    });
                    this.db.run(`CREATE TABLE IF NOT EXISTS PLAYLISTS
                    (
                    ID INTEGER PRIMARY KEY AUTOINCREMENT,
                    NAME VARCHAR(30),
                    USER_ID INTEGER,
                    FOREIGN KEY (USER_ID) REFERENCES USERS(ID)
                    )`, err => {
                        if (err !== null) reject(err);
                    });
                    this.db.run(`CREATE TABLE IF NOT EXISTS SONGS
                    (
                    ID INTEGER PRIMARY KEY AUTOINCREMENT,
                    TITLE VARCHAR(30),
                    ARTIST VARCHAR(30),
                    ADDED_BY INTEGER,
                    FOREIGN KEY (ADDED_BY) REFERENCES USERS(ID)
                    )`, err => {
                        if (err !== null) reject(err);
                    });
                    this.db.run(`CREATE TABLE IF NOT EXISTS PLAYLIST_FROM
                    (
                    PLAYLIST_ID INTEGER,
                    USER_ID INTEGER,
                    FOREIGN KEY (PLAYLIST_ID) REFERENCES PLAYLISTS(ID),
                    FOREIGN KEY (USER_ID) REFERENCES USERS(ID)
                    )`, err => {
                        if (err !== null) reject(err);
                    });
                    this.db.run(`CREATE TABLE IF NOT EXISTS PLAYLIST_MATE
                    (
                    USER_ID INTEGER,
                    USER_ID_MATE INTEGER,
                    FOREIGN KEY (USER_ID_MATE) REFERENCES USERS(ID),
                    FOREIGN KEY (USER_ID) REFERENCES USERS(ID)
                    )`, err => {
                        if (err !== null) reject(err);
                    });
                    this.db.run(`CREATE TABLE IF NOT EXISTS PLAYLIST_CONTAINS
                    (
                    SONG_ID INTEGER(2),
                    PLAYLIST_ID INTEGER(2),
                    ADDED_BY INTEGER,
                    FOREIGN KEY (SONG_ID) REFERENCES SONGS(ID),
                    FOREIGN KEY (PLAYLIST_ID) REFERENCES PLAYLISTS(ID),
                    FOREIGN KEY (ADDED_BY) REFERENCES USERS(ID)
                    )`, err => {
                        if (err !== null) reject(err);
                    });
                    resolve();
                });
            }
        )
    }

    /**
     * run sql command
     * @param sql
     * @param params
     * @returns {Promise<any>}
     */
    cmd(sql = '', ...params) {
        return new Promise((resolve, reject) => {
            this.db.run(sql, params, function (err) {
                if (err !== null) reject(err);
                if (this !== undefined) resolve(this);
            });
        });
    }

    /**
     * gets an object by SQL statement
     * @param sql
     * @param params
     * @returns {Promise<any>}
     */
    get_row(sql = '', ...params) {
        return new Promise((resolve, reject) => {
            this.db.get(sql, params, (err, row) => {
                if (err !== null) {
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });
    }

    /**
     * gets an array of objects by SQL statement
     * @param sql
     * @param params
     * @returns {Promise<any>}
     */
    get_rows(sql = '', ...params) {
        return new Promise((resolve, reject) => {
            this.db.all(sql, params, (err, rows) => {
                if (err !== null) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    skeleton() {
        return new Promise((resolve, reject) => {
            this.db.serialize(() => {
                console.log('AAAAALLLLLLESSSSSSSSSS CREATE STANDARD DATABASE');
                // this.db.run('INSERT INTO USERS (NAME) VALUES ("admin")');
                this.db.run('INSERT INTO USERS (NAME, PASSWORD) VALUES ("hurensohn", "Elise")');
                // this.db.run('INSERT INTO USERS (ID, NAME) VALUES (1, "admin")');
                this.db.run('INSERT INTO SONGS (TITLE,ARTIST,ADDED_BY) VALUES ("Beispiel Title 1", "Beispiel Artist 1", 1)');
                this.db.run('INSERT INTO SONGS (TITLE,ARTIST,ADDED_BY) VALUES ("Beispiel Title 2 du geile Eidechse", "Beispiel Artist 2", 1)');
                this.db.run('INSERT INTO PLAYLISTS (NAME, USER_ID) VALUES ("Playlist 0", 1)');
                resolve();
            });
        }).catch(err => reject(err));
    }
}

module.exports = DB;