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
                    PASSWORD TEXT,
                    SCORE INTEGER
                    )`, err => {
                        if (err !== null) reject(err);
                    });
                    this.db.run(`CREATE TABLE IF NOT EXISTS PLAYLISTS
                    (
                    ID INTEGER PRIMARY KEY AUTOINCREMENT,
                    NAME VARCHAR(30) NOT NULL,
                    USER_ID INTEGER NOT NULL,
                    FOREIGN KEY (USER_ID) REFERENCES USERS(ID)
                    )`, err => {
                        if (err !== null) reject(err);
                    });
                    this.db.run(`CREATE TABLE IF NOT EXISTS SONGS
                    (
                    ID INTEGER PRIMARY KEY AUTOINCREMENT,
                    TITLE VARCHAR(30) NOT NULL,
                    ARTIST VARCHAR(30),
                    ADDED_BY INTEGER,
                    PATH TEXT UNIQUE,
                    FOREIGN KEY (ADDED_BY) REFERENCES USERS(ID)
                    )`, err => {
                        if (err !== null) reject(err);
                    });
                    // this.db.run(`CREATE TABLE IF NOT EXISTS PLAYLIST_FROM
                    // (
                    // PLAYLIST_ID INTEGER,
                    // USER_ID INTEGER,
                    // FOREIGN KEY (PLAYLIST_ID) REFERENCES PLAYLISTS(ID),
                    // FOREIGN KEY (USER_ID) REFERENCES USERS(ID)
                    // )`, err => {
                    //     if (err !== null) reject(err);
                    // });
                    this.db.run(`CREATE TABLE IF NOT EXISTS PLAYLIST_CONTAINS
                    (
                    SONG_ID INTEGER(2),
                    PLAYLIST_ID INTEGER(2),
                    SUPPORTED_BY TEXT,
                    FOREIGN KEY (SONG_ID) REFERENCES SONGS(ID),
                    FOREIGN KEY (PLAYLIST_ID) REFERENCES PLAYLISTS(ID)
                    )`, err => {
                        if (err !== null) reject(err);
                    });
                    this.db.run(`CREATE TABLE IF NOT EXISTS PLAYLIST_MATES
                    (
                    USER_ID INTEGER,
                    MATE_ID INTEGER,
                    FOREIGN KEY (USER_ID) REFERENCES USERS(ID),
                    FOREIGN KEY (MATE_ID) REFERENCES USERS(ID),
                    UNIQUE (USER_ID, MATE_ID)
                    )`, err => {
                        if (err !== null) reject(err);
                    });
                    this.db.run('CREATE TABLE IF NOT EXISTS COLLABORATORS ' +
                        '(' +
                        'USER_ID INTEGER(2) NOT NULL,' +
                        'MATE_ID INTEGER(2) NOT NULL,' +
                        'PLAYLIST_ID INTEGER(2) NOT NULL,' +
                        'FOREIGN KEY (USER_ID) REFERENCES USERS(ID),' +
                        'FOREIGN KEY (MATE_ID) REFERENCES USERS(ID),' +
                        'FOREIGN KEY (PLAYLIST_ID) REFERENCES PLAYLISTS(ID),' +
                        'UNIQUE (USER_ID, MATE_ID, PLAYLIST_ID))');

                    // STANDARD USERS -> ADMINS
                    // this.db.run('INSERT INTO USERS (NAME, PASSWORD, SCORE) VALUES ("admin", "admin", 5)');
                    // STANDARD SONGS
                    try {
                        console.log("jldsafjlsadjö");
                        // this.db.run('INSERT INTO SONGS (TITLE, ARTIST, PATH) VALUES ("Bad Habit Terrasound", "Free Artist", "./Songs/Bad_Habit_Terrasound.mp3")');
                        console.log("hallooijsadfo");
                    } catch (err) {
                        console.log("db.js, Z.87: CATCHED ERROR = ", err);
                    }
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
                this.db.run('INSERT INTO USERS (NAME, PASSWORD, SCORE) VALUES ("test", "test", 10)');
                this.db.run('INSERT INTO USERS (NAME, PASSWORD, SCORE) VALUES ("max", "test", 5)');
                this.db.run('INSERT INTO USERS (NAME, PASSWORD, SCORE) VALUES ("heinz", "test", 5)');
                this.db.run('INSERT INTO USERS (NAME, PASSWORD, SCORE) VALUES ("garry", "test", 5)');
                this.db.run('INSERT INTO USERS (NAME, PASSWORD, SCORE) VALUES ("sigmuel", "test", 40)');
                // this.db.run('INSERT INTO USERS (ID, NAME) VALUES (1, "admin")');
                this.db.run('INSERT INTO SONGS (TITLE,ARTIST,ADDED_BY, PATH) VALUES ("Beispiel Title 1", "Beispiel Artist 1", 1, "PATHBliBlaBlubbb")');
                this.db.run('INSERT INTO SONGS (TITLE,ARTIST,ADDED_BY, PATH) VALUES ("Beispiel Title 2 du geile Eidechse", "Beispiel Artist 2", 1, "BliBlaBlubbbPATH")');
                this.db.run('INSERT INTO PLAYLISTS (NAME, USER_ID) VALUES ("Playlist 1", 2)');
                this.db.run('INSERT INTO PLAYLISTS (NAME, USER_ID) VALUES ("Playlist 2", 1)');
                this.db.run('INSERT INTO PLAYLISTS (NAME, USER_ID) VALUES ("Playlist 3", 1)');
                this.db.run('INSERT INTO PLAYLISTS (NAME, USER_ID) VALUES ("Playlist 4", 3)');
                this.db.run('INSERT INTO PLAYLISTS (NAME, USER_ID) VALUES ("Playlist 5", 4)');
                // this.db.run('INSERT INTO PLAYLIST_FROM (PLAYLIST_ID, USER_ID) VALUES (1, 2)');
                // this.db.run('INSERT INTO PLAYLIST_FROM (PLAYLIST_ID, USER_ID) VALUES (2, 1)');
                // this.db.run('INSERT INTO PLAYLIST_FROM (PLAYLIST_ID, USER_ID) VALUES (3, 1)');
                this.db.run('INSERT INTO PLAYLIST_CONTAINS (SONG_ID, PLAYLIST_ID, SUPPORTED_BY) VALUES (1, 2, "test")');
                this.db.run('INSERT INTO PLAYLIST_CONTAINS (SONG_ID, PLAYLIST_ID, SUPPORTED_BY) VALUES (2, 2, "test")');
                this.db.run('INSERT INTO PLAYLIST_CONTAINS (SONG_ID, PLAYLIST_ID, SUPPORTED_BY) VALUES (1, 1, "max")');
                this.db.run('INSERT INTO PLAYLIST_MATES (USER_ID, MATE_ID) VALUES (1, 2)');  //
                this.db.run('INSERT INTO PLAYLIST_MATES (USER_ID, MATE_ID) VALUES (1, 3)');
                this.db.run('INSERT INTO PLAYLIST_MATES (USER_ID, MATE_ID) VALUES (2, 1)');
                this.db.run('INSERT INTO PLAYLIST_MATES (USER_ID, MATE_ID) VALUES (3, 1)');
                this.db.run('INSERT INTO COLLABORATORS (USER_ID, MATE_ID, PLAYLIST_ID) VALUES (1, 2, 3)');
                this.db.run('INSERT INTO COLLABORATORS (USER_ID, MATE_ID, PLAYLIST_ID) VALUES (2, 1, 1)');
                this.db.run('INSERT INTO COLLABORATORS (USER_ID, MATE_ID, PLAYLIST_ID) VALUES (1, 2, 2)');
                this.db.run('INSERT INTO COLLABORATORS (USER_ID, MATE_ID, PLAYLIST_ID) VALUES (3, 1, 4)');
                resolve();
            });
        }).catch(err => console.log(err));
    }
}
module.exports = DB;