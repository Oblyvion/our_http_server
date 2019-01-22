// const request = require('request');
const express = require('express');
const sqLite = require('sqlite3');
const {celebrate, Joi, isCelebrate} = require('celebrate');
const EscapeHtml = require('escape-html');
const DB = require('./db');
const cors = require('cors');
const basic_auth = require('basic-auth');
const jwt = require('jsonwebtoken');
const os = require('os');
const path = require('path');
const fs = require('fs');
const fileUpload = require('express-fileupload');
let UserData = null;

const app = express();
app.use(express.json());
app.use(cors());
app.use(fileUpload());

// SQLite DB Handler
const db = new DB();
db.create()
    .then(() => console.log('DB created'))
    .catch(err => {
        throw err
    });

// TODO ka, obs gebraucht wird
// // celebrate error middle ware handler
// const errors = () => (err, req, res, next) => {
//     if (isCelebrate(err)) {
//         const error = {
//             success: false,
//             msg: 'Bad Request',
//             err: err.message,
//             validation: {
//                 source: err._meta.source,
//                 keys: [],
//             },
//         };
//
//         if (err.details) {
//             for (let i = 0; i < err.details.length; i += 1) {
//                 const path = err.details[i].path.join('.');
//                 error.validation.keys.push(EscapeHtml(path));
//             }
//         }
//         // return res.status(400).send(error);
//         return res.send(error);
//     }
//     return next(err);
// };
// TODO ENDE

// // Joi validation schemas for celebrate
// const schema_group_get = {
//     params: Joi.object().keys({
//         id: Joi.number().required()
//     })
// };

// const schema_user_post = {
//     params: Joi.keys({
//         name: Joi.string().required()
//     })
// };
const schema_user_post = Joi.object().keys({
    name: Joi.string().alphanum().min(3).max(30).required()
});


const auth = async (req, res, next) => {
    try {
        const token = req.get('Authorization');
        console.log("app.js, auth: TOKEN = " + jwt.decode(token).username);
        const user = await db.get_row('SELECT ID FROM USERS WHERE NAME = ?', jwt.decode(token).username);
        console.log("app.js, auth: USER = " + user.ID);
        if (!user) {
            throw "Invalid Authentication";
        }

        next();
    } catch (err) {
        console.log("hisd: ", err.toString());
        res.set("ERROR: You are not authorized for this action!");
    }
};

async function userInit(req) {
    const standardPlaylistName = 'Your 1. Playlist';
    const standardSongId = 1;
    const userID = await db.get_row('SELECT ID FROM USERS WHERE NAME = ?', req.body.name);
    await db.cmd('INSERT INTO PLAYLISTS (NAME, USER_ID) VALUES (?, ?)', standardPlaylistName, userID.ID);
    const playlistID = await db.get_row('SELECT ID FROM PLAYLISTS WHERE USER_ID = ?', userID.ID);
    await db.cmd('INSERT INTO PLAYLIST_CONTAINS (SONG_ID, PLAYLIST_ID, SUPPORTED_BY) VALUES (?, ?, ?)', standardSongId, playlistID.ID, 'Welcome ' + req.body.name);
}


// ----------------------------GET section----------------------------
/**
 * get app root
 */
app.get('/', (req, res) => {
    res.send('Our Test App');
});

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
 * get all users
 */
app.get('/users', (req, res) => {
    db.get_rows('SELECT * FROM USERS')
        .then(rows => {
            if (!rows)
                throw 'users not found';
            res.send({
                success: true,
                data: rows
            });
        })
        .catch(err => {
            res.send({
                success: false,
                msg: 'access users failed',
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
                throw 'user does not exist';
            res.send({
                success: true,
                data: row
            });
        })
        .catch(err => {
            res.send({
                success: false,
                msg: 'access user failed',
                err: err
            });
        });
});
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

            // console.log("eingabe password = ", req.body.password);
            // console.log("database password = ", user.PASSWORD);
            if (user.PASSWORD !== req.body.password) {
                throw 'wrong password'
            }

            //token generator
            const token = jwt.sign({username: req.body.name}, "secret", {expiresIn: "3600"});

            console.log("das ist tooooooken!!!: ", token);

            res.send({
                success: true,
                data: token
            });
        })
        .catch(err => {
            res.send({
                success: false,
                msg: 'access user failed',
                err: err
            });
            console.log("blbalbl");
        });
});

/**
 * get all songs
 */
app.get('/songs', async (req, res) => {
    db.get_rows('SELECT * FROM SONGS')
        .then(rows => {
            if (!rows)
                throw 'no songs available';
            res.send({
                success: true,
                data: rows
            });
        })
        .catch(err => {
            res.send({
                success: false,
                msg: 'access song failed',
                err: err
            });
        });
});


/**
 * get songs of playlist x from user
 */
app.get('/songsuser/:playlistID', async (req, res) => {
    // Aktuell angemeldeter Benutzer
    const user = jwt.decode(req.get('Authorization')).username;
    console.log("app.js, app.get/songsuser: USER = ", user);

    // Playlist die ausgewählt wurde
    const playlist = await db.get_row('SELECT * FROM PLAYLISTS WHERE ID = ?', +req.params.playlistID);
    // const playlistFrom = await db.get_row('SELECT USER_ID FROM PLAYLISTS WHERE ID = ?', req.params.playlistID);
    console.log("app.js, app.get/songsuser: PLAYLIST_ID = ", req.params.playlistID);
    console.log("app.js, app.get/songsuser: PLAYLIST_ID = ", playlist.ID);
    console.log("app.js, app.get/songsuser: PLAYLIST_NAME = ", playlist.NAME);
    console.log("app.js, app.get/songsuser: PLAYLIST_USER_ID = ", playlist.USER_ID);

    // Inhaber der Playlist
    // const playlistFrom = await db.get_row('SELECT NAME FROM USERS JOIN PLAYLISTS ON USERS.ID = ?', );

    // const songs = await db.get_rows('SELECT * FROM SONGS JOIN PLAYLIST_CONTAINS ON SONGS.ID = PLAYLIST_CONTAINS.SONG_ID' +
    //     ' AND PLAYLIST_CONTAINS.PLAYLIST_ID = ?', playlist.ID);
    const songs = await db.get_rows('SELECT SONGS.TITLE, SONGS.ARTIST, PLAYLIST_CONTAINS.SUPPORTED_BY ' +
        'FROM SONGS ' +
        'JOIN PLAYLIST_CONTAINS ' +
        'ON SONGS.ID = PLAYLIST_CONTAINS.SONG_ID AND PLAYLIST_CONTAINS.PLAYLIST_ID = ? ', playlist.ID)
    // console.log("app.js, app.get/songsuser: SOOOONGS = ", songs);
        .then(rows => {
            if (!rows)
                throw 'no songs available';
            res.send({
                success: true,
                data: rows
            });
        })
        .catch(err => {
            res.send({
                success: false,
                msg: 'access song failed',
                err: err
            });
        });
});

/**
 * get song by id
 */
app.get('/song/:id', (req, res) => {
    db.get_row('SELECT TITLE,ARTIST,ADDED_BY FROM SONGS WHERE ID = ?', +req.params.id)
        .then(row => {
            if (!row)
                throw 'song not found';
            res.send({
                success: true,
                data: row
            });
        })
        .catch(err => {
            res.send({
                success: false,
                msg: 'access song failed',
                err: err
            });
        });
});


/**
 * get USERS playlists from authorized user
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
                throw 'found no playlists';
            res.send({
                success: true,
                data: rows
            });
        })
        .catch(err => {
            res.send({
                success: false,
                msg: 'access playlists failed',
                err: err
            });
        });
});
/**
 * get MATE playlists from authorized user
 */
app.get('/playlists/collabs', auth, async (req, res) => {
    const token = jwt.decode(req.get('Authorization'));
    console.log("app.js, app.get/playlists: TOKEN = ", token.username);
    const USER = await db.get_row('SELECT * FROM USERS WHERE NAME = ?', token.username);
    console.log("das ist die id des users: ", USER.ID);
    const COLLABORATORS = await db.get_rows('SELECT PLAYLIST_ID FROM COLLABORATORS WHERE MATE_ID = ?', USER.ID);
    await db.get_rows('SELECT PLAYLISTS.ID, PLAYLISTS.NAME FROM PLAYLISTS JOIN COLLABORATORS ON PLAYLISTS.ID = COLLABORATORS.PLAYLIST_ID ' +
        'AND MATE_ID = ?', USER.ID)
        .then(rows => {
            console.log("Das sind die playlists hoffentlich: ", rows);
            if (!rows)
                throw 'found no playlists';
            res.send({
                success: true,
                data: rows
            });
        })
        .catch(err => {
            res.send({
                success: false,
                msg: 'access playlists failed',
                err: err
            });
        });
});

app.get('/playlistMates', async (req, res) => {
    console.log("app.js, app.get/playlistMates, Z.352: USER = ", jwt.decode(req.get('Authorization')).username);
    const user = await db.get_row('SELECT ID FROM USERS WHERE NAME = ?', jwt.decode(req.get('Authorization')).username);

    console.log("app.js, app.get/playlistMates, Z.355: USER.ID = ", user.ID);
    await db.get_rows('SELECT USERS.NAME FROM USERS JOIN PLAYLIST_MATES ON PLAYLIST_MATES.USER_ID = ? AND PLAYLIST_MATES.MATE_ID = USERS.ID', user.ID)
        .then((rows) => {
            console.log("app.js, app.get/playlistMates, Z.355: RESULT = ", rows);
            if (!rows || rows < 1) {
                throw 'ERROR: No Playlist Mates found for user ' + user + '.';
            }
            res.send({
                success: true,
                data: rows
            });
        }).
        catch((err) => {
            console.log("app.js, app.get/playlistMates, Z.368: ERROR = ", err);
            res.send({
               success: false,
                msg: 'Nothing in there.',
               err: err
            });
        })
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
        const user = await db.cmd('INSERT INTO USERS (NAME, PASSWORD) VALUES (?, ?)', req.body.name, req.body.password);
        await userInit(req).then(() => {
            console.log("Hat funktioniert");
        });
        // res.header(`Access-Control-Allow-Origin:`, `*`);
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
app.post('/playlist', async (req, res) => {
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

app.post('/song/:playlistID', async (req, res) => {
    try {
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
            msg: 'File uploaded successfully',
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
            console.log("app.js, app.post/song: ERROR PLAYLIST VON MATE KONNTE NICHT IN COLLABORATORS GEFUNDEN WERDEN!", err);
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
 */
app.post('/song/global/:playlistID', async (req, res) => {
    try {
        console.log("app.js, app.post/song: HALLO");
        const user = jwt.decode(req.get('Authorization')).username;
        console.log("app.js, app.post/song: USER = ", user);

        console.log("app.js, app.post/song: TITLE = ", req.body.title);

        console.log("app.js, app.post/song: FILES = ", req.body.files);

        // File exists?
        // if (Object.keys(req.files).length === 0) {
        //     return res.status(400).send('No files were uploaded.');
        // }

        // save the song with key 'filesong'
        const song = req.files.fileSong;
        // path for saving song on server
        const filePath = __dirname + '/Songs/' + song.name;
        console.log("app.js, app.post/song: FILE = ", req.files);
        console.log("app.js, app.post/song: FILEPATH = ", filePath);
        // move song to directory /Server/Songs
        song.mv(filePath, function (err) {
            if (err) {
                console.log("app.js, app.post/song: ERROR = ", err);
                return res.status(500).send(err);
            }
        });

        const userID = await db.get_row('SELECT ID FROM USERS WHERE NAME = ?', user);
        console.log("app.js, app.post/song: USERID = ", userID.ID);
        const playlistID = req.params.playlistID;
        console.log("app.js, app.post/song: PLAYLISTID = ", playlistID);
        // insert song into global SONGS
        await db.cmd('INSERT INTO SONGS (TITLE, ARTIST, ADDED_BY, PATH) VALUES (?, ?, ?, ?)', req.body.title, req.body.artist, userID.ID, filePath);

        // find ID from uploaded song
        const songID = await db.get_row('SELECT ID FROM SONGS WHERE PATH = ?', filePath);
        try {
            // Sobald die angemeldete UserID in Verbindung mit dem PlaylistNamen in der db PLAYLISTS gefunden = EIGENE PLAYLIST
            await db.get_row('SELECT NAME FROM PLAYLISTS WHERE ID = ? AND USER_ID = ?', playlistID, userID.ID);
            console.log("app.js, app.post/song: KLAPPT ?  ");
            console.log("app.js, app.post/song: SONGID = ", songID.ID);
            // insert song into users playlistID
            await db.cmd('INSERT INTO PLAYLIST_CONTAINS (SONG_ID, PLAYLIST_ID, SUPPORTED_BY) VALUES (?, ?, ?)', songID.ID, playlistID, user);
            res.header(`Access-Control-Allow-Origin:`, `*`);
            res.send({
                success: true,
                msg: 'File uploaded successfully',
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
                        msg: 'Playlist von Mate konnte nicht in COLLABORATORS gefunden werden',
                        err: err
                    });
                }
            }
        }

    } catch (err) {
        if (err !== null) {
            console.log('app.js, app.post/song, Z.497: CATCHED ERROR = ', err);
        }
        if (err.message.match('SQLITE_CONSTRAINT: UNIQUE constraint failed: SONGS.PATH')) {
            console.log('app.js, app.post/song: CATCHED ERROR SONG EXISTS ALREADY = ', err);
            res.send({
                success: false,
                msg: 'Song exists already. Do you want this song instead?',
                data: song.name,
                err: err
            });
        } else {                // ERROR MESSAGE, die ich durch Fehler bei INSERT bekam: SQLITE_CONSTRAINT: FOREIGN KEY constraint failed
            console.log("UNCATCHED ERROR = ", err);
            res.send({
                success: false,
                msg: 'access song failed',
                err: err
            });
        }
    }
});

app.post('/playlistMate', async (req, res) => {
    try {
        const user = jwt.decode(req.get('Authorization')).username;
        console.log('app.js, app.post/playlistMate: USER = ', user);
        const userID = await db.get_row('SELECT ID FROM USERS WHERE NAME = ?', user);
        console.log('app.js, app.post/playlistMate: USERID = ', userID.ID);
        console.log('app.js, app.post/playlistMate: MATE = ', req.body.mate);
        const mateID = await db.get_row('SELECT ID FROM USERS WHERE NAME = ?', req.body.mate);
        console.log('app.js, app.post/playlistMate: MATEID = ', mateID.ID);
        // const result = await db.get_row('SELECT USER_ID, MATE_ID FROM PLAYLIST_MATES WHERE USER_ID = ? AND MATE_ID = ?', userID.ID, mateID.ID);
        await db.cmd('INSERT INTO PLAYLIST_MATES (USER_ID, MATE_ID) VALUES (?, ?)', userID.ID, mateID.ID); // TODO creates BAD DUPLICATES!!!
        // console.log('app.js, app.post/playlistMate: RESULT = ', result);
        res.send({
            success: true,
            msg: 'Playlist Mate has been added to your account successfully.'
        })
    } catch (err) {
        if (err.message.match('SQLITE_CONSTRAINT: UNIQUE constraint failed')) {
            res.send({
                success: false,
                msg: 'The user -> ' + req.body.mate + ' <- is your Playlist Mate already. Hire another User.'
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

app.post('/collabs/:playlistID', async (req, res) => {
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

module.exports = app;