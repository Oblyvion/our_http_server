// const request = require('request');
const express = require('express');
const sqLite = require('sqlite3');
const {celebrate, Joi, isCelebrate} = require('celebrate');
const EscapeHtml = require('escape-html');
const DB = require('./db');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const os = require('os');
const path = require('path');
const fs = require('fs');
// const ProgressBar = require('progressbar.js');

// const basic_auth = require('basic-auth');
// const bodyParser = require('body-parser');
// const fileUpload = require('express-fileupload');


const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // DAS IST DER WINDOWS FILEPATH. NICHT VERWERFEN BITTE PLEASE^^
        cb(null, "./\Server/\Songs")
    },
    filename: function (req, file, cb) {
        console.log("MULTER FILENAME = ", file);
        cb(null, file.originalname)
    }
});
const upload = multer({storage: storage});

let UserData = null;

const app = express();
app.use(express.json());
app.use(cors());

// SQLite DB Handler
const db = new DB();
db.create()
    .then(() => console.log('DB created'))
    .catch(err => {
        throw err;
    });

const auth = async (req, res, next) => {
        try {
            let token = req.get('Authorization');

            console.log("app.js, auth: TOKEN = " + token);
            console.log("app.js, auth: TOKEN decoded = " + jwt.decode(token));
            console.log("app.js, auth: TOKEN decoded and stringified = " + JSON.stringify(jwt.decode(token)));
            console.log("app.js, auth: TOKEN USERNAME = " + jwt.decode(token).username);

            console.log("app.js, auth: TOKEN decoded and stringified = " + JSON.stringify(jwt.decode(token)));
            // const user = await db.get_row('SELECT ID FROM USERS WHERE NAME = ?', jwt.decode(token).username);
            // console.log("app.js, auth: USER = " + user.ID);
            if (token) {
                console.log("BOOAAAAAAA alder");
                jwt.verify(token, 'secret', (err, decode) => {
                    try {
                        console.log("JAAA FUCK THAD ERROR = ", err);
                        if (err) {
                            // return res.send({
                            //     success: false,
                            //     msg: 'Unauthorized access!'
                            // });
                            throw 'There is a problem right here, Z. 66.'
                        }
                    } catch (err) {
                        console.log("app.js, auth: KOMICHER ERR = " + err);
                    }
                    console.log("app.js, auth: DECODE = " + JSON.stringify(decode));
                    req.decode = decode;
                    next();
                })
            } else {
                console.log("Kein Token gefunden!!!");
                res.send({
                    success: false,
                    msg: 'No token available.'
                })
            }

        } catch
            (err) {
            console.log("app.js, Auth, Z.58: ERROR = : ", err.toString());
            res.send({
                success: false,
                msg: "ERROR: You are not authorized for this action!",
                err: err
            })
        }
    }
;

async function userInit(req) {
    try {
        const standardPlaylistName = 'Your own 1. Playlist';
        const standardSongId = 1;
        const userID = await db.get_row('SELECT ID FROM USERS WHERE NAME = ?', req.body.name);
        await db.cmd('INSERT INTO PLAYLISTS (NAME, USER_ID) VALUES (?, ?)', standardPlaylistName, userID.ID);
        const playlistID = await db.get_row('SELECT ID FROM PLAYLISTS WHERE USER_ID = ?', userID.ID);
        console.log('playlistID = ', playlistID);
        await db.cmd('INSERT INTO PLAYLIST_CONTAINS (SONG_ID, PLAYLIST_ID, SUPPORTED_BY) VALUES (?, ?, ?)',
            standardSongId, playlistID.ID, 'Admin');
    } catch (err) {
        console.log("ERROR @userInit = ", err);
    }
}

// app.use(function (req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     next();
// });

// ----------------------------GET section----------------------------
/**
 * get app root
 */

app.get('/init', (req, res) => {
    Promise.all([
        db.skeleton()
    ]).then(() => {
            res.send({
                success: true,
                msg: 'db ready to use',

            });
        }
    ).catch((err) => {
            res.send({
                success: false,
                msg: 'db init error',
                err: err
            })
        }
    )
});

/**
 * get all users which are not the current user and not his playlist mates
 */
app.get('/users', auth, async (req, res) => {
    const user = jwt.decode(req.get('Authorization')).username;
    console.log("app.js, app.get/users: USER = ", user);
    const userID = await db.get_row('SELECT ID FROM USERS WHERE NAME = ?', user);
    console.log("app.js, app.get/users: ID = ", userID.ID);

    await db.get_rows('SELECT NAME FROM USERS WHERE USERS.ID NOT IN (?) EXCEPT SELECT NAME FROM USERS ' +
        'JOIN PLAYLIST_MATES ' +
        'ON PLAYLIST_MATES.USER_ID = (?) ' +
        'AND PLAYLIST_MATES.MATE_ID IN (USERS.ID)', userID.ID, userID.ID)
        .then(rows => {
            console.log("app.js, app.get/users: USERS = ", rows);
            if (!rows)
                throw 'No other users found.';
            res.send({
                success: true,
                data: rows
            });
        })
        .catch(err => {
            console.log("app.js, app.get/users: ERROR = ", err);
            res.send({
                success: false,
                msg: 'No other users found',
                err: err
            });
        });
});

/**
 * get user by id
 */
app.get('/user/:id', (req, res) => {
    db.get_row('SELECT NAME,PASSWORD FROM USERS WHERE ID = ?', +req.params.id)
        .then(row => {
            if (!row)
                throw 'User does not exist with ID ' + req.params.id + '.';
            res.send({
                success: true,
                data: row
            });
        })
        .catch(err => {
            res.send({
                success: false,
                msg: 'No user found.',
                err: err
            });
        });
});

// TODO API BESCHREIBUNG BEI POST
/**
 * get user by name
 */
app.post('/login', (req, res) => {
    console.log("app.js, login: NAME = ", req.body.name);
    // console.log("password = ", req.body.password);
    const result = db.get_row('SELECT * FROM USERS WHERE NAME = ?', req.body.name)
        .then(user => {
            if (!user)
                throw 'user does not exist';

            if (user.PASSWORD !== req.body.password) {
                throw 'wrong password'
            }

            //token generator
            const token = jwt.sign({username: req.body.name}, "secret", {expiresIn: "180s"});
            console.log("das ist tooooooken!!!: ", token);
            // const tokenRefresh = jwt.sign({username: req.body.name}, 'newSecretKey', {expiresIn: "30s"});

            res.send({
                success: true,
                msg: 'Token setup.',
                data: token
            });
        })
        .catch(err => {
            console.log("Login, Uncatched Error = ", err);
            res.send({
                success: false,
                msg: 'access user failed',
                err: err
            });
        });
});

/**
 * get all songs
 */
app.get('/songs', async (req, res) => {
    db.get_rows('SELECT * FROM SONGS')
        .then(rows => {
            if (!rows)
                throw 'Access song failed.';
            res.send({
                success: true,
                data: rows
            });
        })
        .catch(err => {
            res.send({
                success: false,
                msg: 'No songs available.',
                err: err
            });
        });
});


/**
 * get songs of playlist x from user
 */
app.get('/songsuser/:playlistID', auth, async (req, res) => {
    try {
        // Aktuell angemeldeter Benutzer
        const user = jwt.decode(req.get('Authorization')).username;
        console.log("app.js, app.get/songsuser: USER = ", user);

        // Playlist die ausgewählt wurde
        const playlist = await db.get_row('SELECT * FROM PLAYLISTS WHERE ID = ?', +req.params.playlistID);

        await db.get_rows('SELECT SONGS.ID, SONGS.TITLE, SONGS.ARTIST, PLAYLIST_CONTAINS.SUPPORTED_BY ' +
            'FROM SONGS ' +
            'JOIN PLAYLIST_CONTAINS ' +
            'ON SONGS.ID = PLAYLIST_CONTAINS.SONG_ID AND PLAYLIST_CONTAINS.PLAYLIST_ID = ? ', playlist.ID)
            .then(rows => {
                if (!rows)
                    throw 'Access playlist with ID ' + playlist.ID + ' failed.';
                res.send({
                    success: true,
                    data: rows
                });
            })
            .catch(err => {
                res.send({
                    success: false,
                    msg: 'No songs available in this playlist.',
                    err: err
                });
            });
    } catch (err) {
        res.send({
            success: false,
            msg: 'You are not authorized for this action or playlist ist not available.',
            err: err
        });
    }

});

/**
 * get song by id
 */
app.get('/song/:id', async (req, res) => {
    // TODO TRY KANN RAUS WENN AUTH GEHT
    try {
        // Aktuell angemeldeter Benutzer
        const user = jwt.decode(req.get('Authorization')).username;
        console.log("app.js, app.get/songsuser: USER = ", user);

        await db.get_row('SELECT PATH FROM SONGS WHERE ID = ?', +req.params.id)
            .then((path) => {
                if (!path) {
                    throw 'No path found for ID ' + req.params.id;
                }
                console.log("Path = ", path);
                const src = fs.createReadStream(path.PATH);
                src.pipe(res);
            })
            .catch((err) => {
                res.send({
                    success: false,
                    msg: 'No such file or directory.',
                    err: err
                });
            });
    } catch (err) {
        res.send({
            success: false,
            msg: 'You are not authorized for this action or playlist ist not available.',
            err: err
        });
    }
});

// TODO Die Playlists sind entweder privat, für Playlist-Mates offen oder für alle User öffentlich.
/**
 * get USERS own playlists
 */
app.get('/playlists', auth, async (req, res) => {
    const token = jwt.decode(req.get('Authorization'));
    console.log("app.js, app.get/playlists: TOKEN = ", token.username);
    const USER = await db.get_row('SELECT * FROM USERS WHERE NAME = ?', token.username);
    console.log("das ist die id des users: ", USER.ID);
    await db.get_rows('SELECT * FROM PLAYLISTS WHERE USER_ID = ?', USER.ID)
        .then(rows => {
            console.log("Das sind die playlists hoffentlich: ", rows);
            if (!rows)
                throw 'Access playlists failed';
            res.send({
                success: true,
                data: rows
            });
        })
        .catch(err => {
            res.send({
                success: false,
                msg: 'Found no playlists.',
                err: err
            });
        });
});
/**
 * get COLLABORATOR playlists
 */
app.get('/playlists/collabs', auth, async (req, res) => {
    const token = jwt.decode(req.get('Authorization'));
    console.log("app.js, app.get/playlists: TOKEN = ", token.username);
    const USER = await db.get_row('SELECT * FROM USERS WHERE NAME = ?', token.username);
    console.log("das ist die id des users: ", USER.ID);
    // const COLLABORATORS = await db.get_rows('SELECT PLAYLIST_ID FROM COLLABORATORS WHERE MATE_ID = ?', USER.ID);
    await db.get_rows('SELECT PLAYLISTS.ID, PLAYLISTS.NAME FROM PLAYLISTS ' +
        'JOIN COLLABORATORS ON PLAYLISTS.ID = COLLABORATORS.PLAYLIST_ID ' +
        'AND MATE_ID = ?', USER.ID)
        .then(rows => {
            console.log("Das sind die playlists hoffentlich: ", rows);
            if (!rows)
                throw 'Access collaborator playlists failed';
            res.send({
                success: true,
                data: rows
            });
        })
        .catch(err => {
            res.send({
                success: false,
                msg: 'Found no collaborator playlists.',
                err: err
            });
        });
});

/**
 * get playlist mates
 */
app.get('/playlistMates', auth, async (req, res) => {
    try {
        console.log("app.js, app.get/playlistMates, Z.386: USER = ", jwt.decode(req.get('Authorization')).username);
        const user = await db.get_row('SELECT ID FROM USERS WHERE NAME = ?', jwt.decode(req.get('Authorization')).username);
        console.log("app.js, app.get/playlistMates, Z.356: USER.ID = ", user.ID);

        await db.get_rows('SELECT USERS.NAME, USERS.SCORE, PLAYLIST_MATES.REQUEST FROM USERS ' +
            'JOIN PLAYLIST_MATES ' +
            'ON PLAYLIST_MATES.USER_ID = ? AND PLAYLIST_MATES.MATE_ID = USERS.ID ORDER BY USERS.NAME ASC', user.ID)
            .then((rows) => {
                console.log("app.js, app.get/playlistMates, Z.394: RESULT = ", rows);
                if (!rows || rows < 1) {
                    throw 'ERROR: No Playlist Mates found for user.';
                }
                res.send({
                    success: true,
                    data: rows
                });
            }).catch((err) => {
                console.log("app.js, app.get/playlistMates, Z.403: ERROR = ", err);
                res.send({
                    success: false,
                    msg: 'Nothing in there, yet.',
                    err: err
                });
            })
    } catch (err) {
        console.log("app.js, app.get/playlistMates, Z.411: ERROR = ", err);
        if (err.message.match('Cannot read property')) {
            return res.send({
                success: false,
                msg: 'You are not authorized for this action.',
                err: err
            });
        }
        res.send({
            success: false,
            msg: 'UNCATCHED Error.',
            err: err
        });
    }

});

app.get('/playlistMates/sharedPlaylists/:mate', auth, async (req, res) => {
    console.log("app.js, app.get/playlistMates/sharedPlaylists, Z.386: USER = ", jwt.decode(req.get('Authorization')).username);
    const user = await db.get_row('SELECT ID FROM USERS WHERE NAME = ?', jwt.decode(req.get('Authorization')).username);
    console.log("app.js, app.get/playlistMates/sharedPlaylists, Z.388: USER.ID = ", user.ID);

    console.log("app.js, app.get/playlistMates/sharedPlaylists, Z.390: MATE = ", req.params.mate);
    const mate = await db.get_row('SELECT ID FROM USERS WHERE NAME = ?', req.params.mate);
    console.log("app.js, app.get/playlistMates/sharedPlaylists, Z.391: MATE.ID = ", mate.ID);

    const countPlaylistsCollabs = await db.get_rows('SELECT COUNT(PLAYLIST_ID) AS countSharedPlaylists ' +
        'FROM COLLABORATORS WHERE USER_ID = ? AND MATE_ID = ?', user.ID, mate.ID)
        .then((rows) => {
            console.log("app.js, app.get/playlistMates, Z.397: RESULT = ", rows[0]);
            if (!rows || rows < 1) {
                return res.send({
                    success: false,
                    data: 'No Collaborators found for Playlist Mate = ' + mate.username
                });
            }
            res.send({
                success: true,
                data: rows[0]
            });
        }).catch((err) => {
            console.log("app.js, app.get/playlistMates, Z.408: ERROR = ", err);
            res.send({
                success: false,
                msg: 'UNEXPECTED ERROR Z.411',
                err: err
            });
        })
});

app.get('/playlistMate/request', auth, async (req, res) => {
    try {
        console.log("app.js, app.get/playlistMates/request, Z.413: USER = ", jwt.decode(req.get('Authorization')).username);
        const user = await db.get_row('SELECT ID FROM USERS WHERE NAME = ?', jwt.decode(req.get('Authorization')).username);
        console.log("app.js, app.get/playlistMates/request: USER.ID = ", user.ID);
        const mateID = await db.get_row('SELECT ID FROM USERS WHERE NAME = ?', req.body.mate);

        await db.get_row('SELECT REQUEST FROM PLAYLIST_MATES ' +
            'WHERE USER_ID = ? AND MATE_ID = ?', user.ID, mateID.ID)
            .then((row) => {
                console.log('app.js, app.post/request Catch: REQUEST = ', row);
                if (row < 1 || row === undefined)
                    throw 'Mate not found';
                res.send({
                    success: true,
                    data: row
                });
            })
            .catch((err) => {
                console.log('app.js, app.post/request Catch: ERROR = ', err);
                res.send({
                    success: false,
                    msg: 'Cannot select REQUEST Value of your mate in table Playlist_Mates.',
                    err: err
                });
            })
    } catch (err) {
        console.log('app.js, app.post/request Catch: ERR = ', err);
    }
});
app.get('/playlistMates/requests', auth, async (req, res) => {
    try {
        console.log("app.js, app.get/playlistMates/request, Z.413: USER = ", jwt.decode(req.get('Authorization')).username);
        const user = await db.get_row('SELECT ID FROM USERS WHERE NAME = ?', jwt.decode(req.get('Authorization')).username);
        // console.log("app.js, app.get/playlistMates/request: USER.ID = ", user.ID);
        // const mateID = await db.get_row('SELECT ID FROM USERS WHERE NAME = ?', req.body.mate);

        await db.get_rows('SELECT USERS.NAME FROM USERS ' +
            'JOIN PLAYLIST_MATES ' +
            'ON PLAYLIST_MATES.MATE_ID = ? AND PLAYLIST_MATES.REQUEST = ?', user.ID, 0)
            .then((rows) => {
                console.log('app.js, app.get/playlistMates/requesteS:  NAMES = ', rows);
                if (rows < 1 || rows === undefined)
                    throw 'No mate requests found';
                res.send({
                    success: true,
                    data: rows
                });
            })
            .catch((err) => {
                console.log('app.js, app.get/playlistMates/requesteS: Catch1: ERROR = ', err);
                res.send({
                    success: false,
                    msg: 'You should take the first step to ask for new Playlist Mates.',
                    err: err
                });
            })
    } catch (err) {
        console.log('app.js, app.get/playlistMates/requesteS: Catch2: ERR = ', err);
        res.send({
            success: false,
            msg: 'You are not allowed.',
            err: err
        });
    }
});

/**
 * get playlist songs by playlist id
 */
// app.get('/playlist/:id', async (req, res) => {
//     // console.log("hallo: ", req.params.id);
//     const token = jwt.decode(req.get("Authorization")).username;
//     const USER = await db.get_row('SELECT * FROM USERS WHERE NAME = ?', token);
//     const SongsOfPlaylist = await db.get_row("SELECT SONG_ID FROM PLAYLIST_CONTAINS WHERE PLAYLIST_CONTAINS.PLAYLIST_ID = ?", +req.params.id);
//     console.log("DAS IST SONGS OF PLAYLIST: ", SongsOfPlaylist);
//     db.get_row("SELECT * FROM SONGS WHERE ID = ?", SongsOfPlaylist.SONG_ID)
//         .then(row => {
//             console.log(row);
//             if (!row)
//                 throw 'playlist does not exist';
//             res.send({
//                 success: true,
//                 data: row
//             });
//         })
//         .catch(err => {
//             console.log(err);
//             res.send({
//                 success: false,
//                 msg: 'access playlist failed',
//                 err: err
//             });
//         });
// });

// ----------------------------POST section----------------------------

/**
 * create new user
 */
app.post('/user', async (req, res) => {
    try {
        console.log("HALLO");
        console.log("req.body.name = ", req.body.name);
        const user = await db.cmd('INSERT INTO USERS (NAME, PASSWORD, SCORE) VALUES (?, ?, ?)', req.body.name, req.body.password, 5);
        await userInit(req);

        res.send({
            success: true,
            msg: 'User registered successfully.',
            data: user
        });
    } catch (err) {
        if (err.message.match('SQLITE_CONSTRAINT')) {
            console.log(err);
            res.send({
                success: false,
                msg: 'user exists already',
                err: err
            });
        } else {
            console.log(err);
            res.send({
                success: false,
                msg: 'access user failed',
                err: err
            });
        }
    }
});

/**
 * create new playlist
 */
app.post('/playlist', auth, async (req, res) => {
    try {
        console.log("app.js, app.post/playlist: body.name = ", req.body.name);
        console.log("app.js, app.post/playlist: token = ", req.get('Authorization'));
        const user = await db.get_row('SELECT ID FROM USERS WHERE NAME = ?', jwt.decode(req.get('Authorization')).username);
        console.log("app.js, app.post/playlist: USER ID = ", user.ID);
        const playlist = await db.cmd('INSERT INTO PLAYLISTS (NAME,USER_ID) VALUES (?, ?)', req.body.name, user.ID);
        console.log("app.js, app.post/playlist: playlist = ", playlist);

        res.send({
            success: true,
            data: playlist
        });

    } catch (err) {
        if (err.message.match('SQLITE_CONSTRAINT')) {
            console.log(err);
            res.send({
                success: false,
                msg: 'playlist exists already',
            });
        } else {
            console.log(err);
            res.send({
                success: false,
                msg: 'access playlist failed',
                err: err
            });
        }
    }
});

app.post('/song/:playlistID', auth, async (req, res) => {
    try {
        // console.log("DOCUMENT WRITE = ", navigator);

        const user = jwt.decode(req.get('Authorization')).username;
        console.log("app.js, app.post/song: USER = ", user);
        const userID = await db.get_row('SELECT ID FROM USERS WHERE NAME = ?', user);

        // Sobald die angemeldete UserID in Verbindung mit dem PlaylistNamen in der db PLAYLISTS gefunden = EIGENE PLAYLIST
        await db.get_row('SELECT NAME FROM PLAYLISTS WHERE ID = ? AND USER_ID = ?', req.params.playlistID, userID.ID);

        console.log("app.js, app.post/song: SONGID = ", req.body.songID);
        // Finde den vorhanden Song, der hinzugefügt werden soll
        const filePath = await db.get_row('SELECT PATH FROM SONGS WHERE ID = ?', req.body.songID);

        // insert song into users playlistID
        await db.cmd('INSERT INTO PLAYLIST_CONTAINS (SONG_ID, PLAYLIST_ID, SUPPORTED_BY) VALUES (?, ?, ?)', req.body.songID, req.params.playlistID, user);
        res.send({
            success: true,
            msg: 'File uploaded successfully ;)',
            path: filePath
        });
        console.log("app.js, app.post/song: KLAPPT AUCH ? = SONG WURDE HINZUGEFÜGT");
    } catch (err) {
        try {
            // Playlist must be from collaborator!!!
            await db.get_row('SELECT USER_ID FROM COLLABORATORS WHERE MATE_ID = ? AND PLAYLIST_ID = ?', req.body.songID, req.params.playlistID);
            // const songID = await db.get_row('SELECT ID FROM SONGS WHERE PATH = ?', filePath);
            const filePath = await db.get_row('SELECT PATH FROM SONGS WHERE ID = ?', req.body.songID);
            console.log("app.js, app.post/song: SONGID COLLA = ", req.body.userID);
            await db.cmd('INSERT INTO PLAYLIST_CONTAINS (SONG_ID, PLAYLIST_ID, SUPPORTED_BY) VALUES (?, ?, ?)', req.body.songID, req.params.playlistID, user);
            res.send({
                success: true,
                msg: 'Recognized that playlist is from COLLABORATORS and inserted song into PLAYLIST_CONTAINS.',
                path: filePath
            });
            console.log("app.js, app.post/song: WÄRE TOLL, WENN ES WIEDER GEKLAPPT HÄTTE. ");
        } catch (e) {
            console.log("app.js, app.post/song: ERROR PLAYLIST KONNTE ÜBERHAUPT NICHT GEFUNDEN WERDEN!", err);
            return res.status(500).send({
                success: false,
                msg: 'Playlist von Mate konnte nicht in COLLABORATORS gefunden werden.',
                err: err
            });
        }
    }
});

/**
 * upload song into global SONGS and users PLAYLIST_CONTAINS
 */                                                                     // , {name: 'nextInput', maxCount: 2}
app.post('/song/global/:playlistID', auth, upload.fields([{name: 'audioFile'}, {name: 'title', maxCount: 1}, {
    name: 'token', maxCount: 1
}, {name: 'artist'}]), async (req, res) => {
    try {
        console.log("app.js, app.post/song: HUHUUUUUU = ", jwt.decode(req.get('Authorization')));
        console.log("app.js, app.post/song: PARAMS = ", req.params);
        console.log("app.js, app.post/song: BODY = ", req.body);
        console.log("app.js, app.post/song: HEADERS = ", req.headers);
        console.log("app.js, app.post/song: TITLE = ", req.body.title);
        console.log("app.js, app.post/song: ARTIST = ", req.body.artist);
        console.log("app.js, app.post/song: FILE = ", req.files);
        console.log("app.js, app.post/song: BODY = ", req.body);
        console.log("app.js, app.post/song: HALLO = ", jwt.decode(req.body["token"]));
        const user = jwt.decode(req.body["token"]).username;

        console.log("app.js, app.post/song: USER = ", user);

        // console.log("app.js, app.post/song, Z.534: TITLE = ", req.body.title);
        //
        // console.log("app.js, app.post/song: BODY FILES = ", req.body.files);

        // File exists?
        // if (Object.keys(req.files).length === 0) {
        //     return res.status(400).send('No files were uploaded.');
        // }

        // save the song
        const song = req.files;
        let filePath;
        // path for saving song on server
        console.log("SHOW ME YOUR FILEPATH = ", song.audioFile[0].originalname);

        // if (OSName === "Windows")
        //     filePath = __dirname + "\\Songs\\" + song.audioFile[0].originalname;
        // else
        console.log("DirNAME: ", __dirname);
        filePath = "./Server/Songs/" + song.audioFile[0].originalname;

        // DAS IST DER WINDOWS FILEPATH. NICHT VERWERFEN BITTE PLEASE^^
        //const filePath = __dirname + "\\Songs\\" + song.audioFile[0].originalname;

        console.log("app.js, app.post/song: FILEPATH = ", filePath);

        const userID = await db.get_row('SELECT ID FROM USERS WHERE NAME = ?', user);
        console.log("app.js, app.post/song: USERID = ", userID.ID);
        const playlistID = req.params.playlistID;
        console.log("app.js, app.post/song: PLAYLISTID = ", playlistID);
        // // insert song into global SONGS
        await db.cmd('INSERT INTO SONGS (TITLE, ARTIST, ADDED_BY, PATH) VALUES (?, ?, ?, ?)', req.body.title, req.body.artist, userID.ID, filePath);
        //
        // // find ID from uploaded song
        const songID = await db.get_row('SELECT ID FROM SONGS WHERE PATH = ?', filePath);
        try {
            //     // Sobald die angemeldete UserID in Verbindung mit dem PlaylistNamen in der db PLAYLISTS gefunden = EIGENE PLAYLIST
            await db.get_row('SELECT NAME FROM PLAYLISTS WHERE ID = ? AND USER_ID = ?', playlistID, userID.ID);
            console.log("app.js, app.post/song: KLAPPT ?  ");
            console.log("app.js, app.post/song: SONGID = ", songID.ID);
            //     // insert song into users playlistID
            await db.cmd('INSERT INTO PLAYLIST_CONTAINS (SONG_ID, PLAYLIST_ID, SUPPORTED_BY) VALUES (?, ?, ?)', songID.ID, playlistID, user);
            //
            const userScore = await db.get_row('SELECT SCORE FROM USERS WHERE ID = ?', userID.ID);
            console.log("app.js, app.post/song: USERSCORE = ", userScore.SCORE);
            //     // TODO UPDATE USER AND ADD 15 SCORE POINTS
            await db.cmd('UPDATE USERS SET SCORE = ? WHERE ID = ?', userScore.SCORE + 15, userID.ID);
            console.log("app.js, app.post/song: USERSCORE = ", userScore.SCORE);

            res.send({
                success: true,
                msg: 'File uploaded successfully ;)',
                path: filePath
            });
            console.log("app.js, app.post/song: KLAPPT AUCH ? = SONG WURDE HINZUGEFÜGT");
        } catch (err) {
            console.log("app.js, app.post/song: ERROR OCCURRED = ", err.message);
            if (err.message.match('SQLITE_CONSTRAINT')) {
                console.log("app.js, app.post/song: ERROR PLAYLISTID NOT FOUND, PLAYLIST COMES FROM MATE = ", err);
                try {
                    // Playlist must be from collaborator!!!
                    await db.get_row('SELECT USER_ID FROM COLLABORATORS WHERE MATE_ID = ? AND PLAYLIST_ID = ?', userID.ID, playlistID);
                    // const songID = await db.get_row('SELECT ID FROM SONGS WHERE PATH = ?', filePath);
                    console.log("app.js, app.post/song: SONGID COLLA = ", songID.ID);
                    await db.cmd('INSERT INTO PLAYLIST_CONTAINS (SONG_ID, PLAYLIST_ID, SUPPORTED_BY) VALUES (?, ?, ?)', songID.ID, playlistID, user);
                    res.send({
                        success: true,
                        msg: 'Recognized that playlist is from COLLABORATORS and inserted song into PLAYLIST_CONTAINS.',
                        path: filePath
                    });
                    console.log("app.js, app.post/song: WÄRE TOLL, WENN ES WIEDER GEKLAPPT HÄTTE. ");
                } catch (e) {
                    console.log("app.js, app.post/song: ERROR PLAYLIST VON MATE KONNTE NICHT IN COLLABORATORS GEFUNDEN WERDEN!", err);
                    return res.status(500).send({
                        success: false,
                        msg: 'Mates Playlist could not found.',
                        err: err
                    });
                }
            }
        }

    } catch (err) {
        if (err.message.match('SQLITE_CONSTRAINT: UNIQUE constraint failed: SONGS.PATH')) {
            console.log('app.js, app.post/song: CATCHED ERROR SONG EXISTS ALREADY = ', err);
            res.send({
                success: false,
                msg: 'Song exists already. Search for the following song to get it ;)\n\n' + req.files.audioFile[0].originalname,
                err: err
            });
        } else {
            console.log("UNCATCHED ERROR = ", err);
            res.send({
                success: false,
                msg: 'access song failed',
                err: err
            });
        }
    }
});

app.post('/playlistMate', auth, async (req, res) => {
    try {
        const user = jwt.decode(req.get('Authorization')).username;
        console.log('app.js, app.post/playlistMate: USER = ', user);
        const userID = await db.get_row('SELECT ID FROM USERS WHERE NAME = ?', user);
        console.log('app.js, app.post/playlistMate: USERID = ', userID.ID);
        console.log('app.js, app.post/playlistMate: MATE = ', req.body.mate);
        const mateID = await db.get_row('SELECT ID FROM USERS WHERE NAME = ?', req.body.mate);
        console.log('app.js, app.post/playlistMate: MATEID = ', mateID.ID);
        // const result = await db.get_row('SELECT USER_ID, MATE_ID FROM PLAYLIST_MATES WHERE USER_ID = ? AND MATE_ID = ?', userID.ID, mateID.ID);
        await db.cmd('INSERT INTO PLAYLIST_MATES (USER_ID, MATE_ID, REQUEST) VALUES (?, ?, ?)', userID.ID, mateID.ID, 1);
        await db.cmd('INSERT INTO PLAYLIST_MATES (USER_ID, MATE_ID, REQUEST) VALUES (?, ?, ?)', mateID.ID, userID.ID, 0);
        // console.log('app.js, app.post/playlistMate: RESULT = ', result);
        res.send({
            success: true,
            msg: 'Playlist Mate request send to ' + req.body.mate + ' successfully.'
        })
    } catch (err) {
        if (err.message.match('SQLITE_CONSTRAINT: UNIQUE constraint failed')) {
            // const user = jwt.decode(req.get('Authorization')).username;
            // console.log('app.js, app.post/playlistMate Catch: USER = ', user);
            // const userID = await db.get_row('SELECT ID FROM USERS WHERE NAME = ?', user);
            // console.log('app.js, app.post/playlistMate Catch: USERID = ', userID.ID);
            // const mateID = await db.get_row('SELECT ID FROM USERS WHERE NAME = ?', req.body.mate);
            //
            // const request = await db.get_row('SELECT REQUEST FROM PLAYLIST_MATES ' +
            //     'WHERE USER_ID = ? AND MATE_ID = ?', mateID.ID, userID.ID);
            // console.log('app.js, app.post/playlistMate Catch: REQUEST = ', request);

            // if (mateID.ID === ) {
            //
            // }


            res.send({
                success: false,
                msg: 'The user -> ' + req.body.mate + ' <- is your Playlist Mate already. Hire another User.'
            })
        } else {
            console.log('app.js, app.post/playlistMate: UNCATCHED ERROR = ', err);

            res.send({
                success: false,
                msg: 'YOU are not authorized for this action.',
                err: err
            })
        }
    }
});

app.post('/collabs/:playlistID', auth, async (req, res) => {
    try {
        const user = jwt.decode(req.get('Authorization')).username;
        console.log('app.js, app.post/collabs: USER = ', user);
        const userID = await db.get_row('SELECT ID FROM USERS WHERE NAME = ?', user);
        console.log('app.js, app.post/collabs: USERID = ', userID.ID);
        console.log('app.js, app.post/collabs: USERID = ', req.body.mate);
        const mateID = await db.get_row('SELECT ID FROM USERS WHERE NAME = ?', req.body.mate);
        console.log('app.js, app.post/collabs: MATEID = ', mateID.ID);
        await db.cmd('INSERT INTO COLLABORATORS (USER_ID, MATE_ID, PLAYLIST_ID) VALUES (?, ?, ?)', userID.ID, mateID.ID, req.params.playlistID);
        res.send({
            success: true,
            msg: 'Collaborator ' + req.body.mate + ' has been added to your account successfully.'
        })
    } catch (err) {
        if (err.message.match('SQLITE_CONSTRAINT: UNIQUE constraint failed')) {
            res.send({
                success: false,
                msg: 'The Playlist Mate -> ' + req.body.mate + ' <- is one of your Collaborators already. Invite another Playlist Mate.'
            })
        } else {
            console.log('app.js, app.post/playlistMate: UNCATCHED ERROR = ', err);

            res.send({
                success: false,
                msg: 'Maybe the user -> ' + req.body.mate + ' <- does not ka.',
                err: err
            })
        }
    }
});

app.post('/playlistMates/request', auth, async (req, res) => {
    try {
        console.log("app.js, app.post/playlistMates/request, Z.844: USER = ", jwt.decode(req.get('Authorization')).username);
        const user = await db.get_row('SELECT ID FROM USERS WHERE NAME = ?', jwt.decode(req.get('Authorization')).username);
        console.log("app.js, app.post/playlistMates/request: USER.ID = ", user.ID);
        console.log("MATE! ", req.body.mate);
        const mateID = await db.get_row('SELECT ID FROM USERS WHERE NAME = ?', req.body.mate);

        const answer = req.body.answer;
        if (!answer && answer !== undefined) {
            try {
                await db.cmd('DELETE FROM PLAYLIST_MATES WHERE USER_ID = ? AND MATE_ID = ?', user.ID, mateID.ID);
                console.log("app.js, app.post/playlistMates/request, Z.853: ERROR = ");
                await db.cmd('DELETE FROM PLAYLIST_MATES WHERE USER_ID = ? AND MATE_ID = ?', mateID.ID, user.ID);
                console.log("app.js, app.post/playlistMates/request, Z.855: ERROR = ");
                return res.send({
                    success: true,
                    msg: 'Decline Playlist Mate Request: Playlist Mates deleted!'
                });
            } catch (err) {
                console.log("app.js, app.post/playlistMates/request, Z.859: ERROR = ", err);
                return res.send({
                    success: false,
                    msg: 'Delete from Playlist Mates failed.',
                    err: err
                });
            }
        }
        await db.cmd('UPDATE PLAYLIST_MATES SET REQUEST = 1 ' +
            'WHERE USER_ID = ? AND MATE_ID = ?', user.ID, mateID.ID)
            .then((row) => {
                console.log('app.js, app.post/request Catch: REQUEST = ', row);
                if (row < 1 || row === undefined) {
                    return res.send({
                        success: false,
                        msg: 'Cannot find such Playlist Mate. Add user as Playlist Mate first!'
                    });
                }
                res.send({
                    success: true,
                    msg: 'User ' + req.body.mate + ' and you are Playlist Mates now.'
                });
            })
            .catch((err) => {
                console.log('app.js, app.post/request Catch: ERROR = ', err);
                res.send({
                    success: false,
                    msg: 'Cannot select REQUEST Value of your mate in table Playlist_Mates.',
                    err: err
                });
            })
    } catch (err) {
        console.log('app.js, app.post/request Catch: ERR = ', err);
    }

});


module.exports = app;