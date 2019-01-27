const sqLite = require('sqlite3').verbose();

class DB {

    constructor(db_file = './db.sqlite3') {
        this.db = new sqLite.Database(db_file);
        this.db.exec('PRAGMA foreign_keys = ON');
    }

    adminInit() {
        // try {
        //     const adminName = "admin";
        //     const path = "./Server/Songs";
        //     console.log("__dirname = ", __dirname );
        //     console.log("path = ", path);
        //     // CREATE STANDARD USERS -> ADMINS
        //     this.db.run('INSERT OR IGNORE INTO USERS (NAME, PASSWORD, SCORE) VALUES (?, ?, 5)', adminName, adminName);
        //     console.log("jldsafjlsadjö");
        //     // CREATE STANDARD SONGS
        //     this.db.run('INSERT OR IGNORE INTO SONGS (TITLE, ARTIST, ADDED_BY, PATH) ' +
        //         'VALUES ("Canon in D Major", "Johann Pachelbel", 1, ?)', path + '/Johann Pachelbel - Canon in D Major.mp3');
        //     this.db.run('INSERT OR IGNORE INTO PLAYLISTS (ID, NAME, USER_ID) ' +
        //         'VALUES (?, ?, ?)', 1, "Playlist Admin", 1);
        // } catch (err) {
        //     console.log("db.js, Z.87: CATCHED ERROR = ", err);
        // }
    }

    create() {
        return new Promise((resolve, reject) => {
                this.db.serialize(() => {
                    this.db.run(`CREATE TABLE IF NOT EXISTS USERS
                    (
                    ID INTEGER PRIMARY KEY AUTOINCREMENT,
                    NAME VARCHAR(30) NOT NULL UNIQUE,
                    PASSWORD VARCHAR(30) NOT NULL,
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
                    ADDED_BY INTEGER NOT NULL,
                    PATH TEXT UNIQUE,
                    FOREIGN KEY (ADDED_BY) REFERENCES USERS(ID)
                    )`, err => {
                        if (err !== null) reject(err);
                    });
                    this.db.run(`CREATE TABLE IF NOT EXISTS PLAYLIST_CONTAINS
                    (
                    SONG_ID INTEGER NOT NULL,
                    PLAYLIST_ID INTEGER NOT NULL,
                    SUPPORTED_BY VARCHAR(30),
                    FOREIGN KEY (SONG_ID) REFERENCES SONGS(ID),
                    FOREIGN KEY (PLAYLIST_ID) REFERENCES PLAYLISTS(ID)
                    )`, err => {
                        if (err !== null) reject(err);
                    });
                    this.db.run(`CREATE TABLE IF NOT EXISTS PLAYLIST_MATES
                    (
                    USER_ID INTEGER NOT NULL,
                    MATE_ID INTEGER NOT NULL,
                    REQUEST BOOLEAN NOT NULL,
                    FOREIGN KEY (USER_ID) REFERENCES USERS(ID),
                    FOREIGN KEY (MATE_ID) REFERENCES USERS(ID),
                    UNIQUE (USER_ID, MATE_ID)
                    )`, err => {
                        if (err !== null) reject(err);
                    });
                    this.db.run('CREATE TABLE IF NOT EXISTS COLLABORATORS ' +
                        '(' +
                        'USER_ID INTEGER NOT NULL,' +
                        'MATE_ID INTEGER NOT NULL,' +
                        'PLAYLIST_ID INTEGER NOT NULL,' +
                        'FOREIGN KEY (USER_ID) REFERENCES USERS(ID),' +
                        'FOREIGN KEY (MATE_ID) REFERENCES USERS(ID),' +
                        'FOREIGN KEY (PLAYLIST_ID) REFERENCES PLAYLISTS(ID),' +
                        'UNIQUE (USER_ID, MATE_ID, PLAYLIST_ID))');

                    resolve();
                });
                this.adminInit();
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
                this.db.run('INSERT INTO PLAYLIST_MATES (USER_ID, MATE_ID, REQUEST) VALUES (1, 2, 1)');  //
                this.db.run('INSERT INTO PLAYLIST_MATES (USER_ID, MATE_ID, REQUEST) VALUES (1, 3, 1)');
                this.db.run('INSERT INTO PLAYLIST_MATES (USER_ID, MATE_ID, REQUEST) VALUES (2, 1, 1)');
                this.db.run('INSERT INTO PLAYLIST_MATES (USER_ID, MATE_ID, REQUEST) VALUES (3, 1, 1)');
                this.db.run('INSERT INTO PLAYLIST_MATES (USER_ID, MATE_ID, REQUEST) VALUES (1, 4, 1)');
                this.db.run('INSERT INTO PLAYLIST_MATES (USER_ID, MATE_ID, REQUEST) VALUES (4, 1, 0)');
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