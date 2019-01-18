// const request = require('request');
const express = require('express');
const sqLite = require('sqlite3');
const {celebrate, Joi, isCelebrate} = require('celebrate');
const EscapeHtml = require('escape-html');
const DB = require('./db');
const cors = require('cors');
const basic_auth = require('basic-auth');
const jwt = require('jsonwebtoken');

let UserData = null;

const app = express();
app.use(express.json());
app.use(cors());

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
        const user = basic_auth(req);
        console.log("User: " + user);
        if (!user || !user.name || !user.pass) {
            throw "Invalid Basic Auth";
        }

        const auth = await db.get_row('SELECT PASSWORD FROM USERS WHERE NAME = ?', user.name);

        //console.log("user pass: "+user.pass);
        //console.log("auth password: "+auth.PASSWORD);
        if (auth.PASSWORD !== user.pass) {
            throw "Invalid Password!";
        }
        next();
    } catch (err) {
        console.log(err.toString());
        res.set("WWW-Authenticate", "Basic real-Authorization Required");
        //error_handler(res, 'Authorization Required', err);
    }
};

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
            console.log("jwt");
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
                throw 'song not found';
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
 * get all playlists from authorized user
 */
app.get('/playlists', async (req, res) => {
    const token = jwt.decode(req.get("Authorization")).username;
    //console.log("das ist username generiert aus token:" ,token);
    const USER = await db.get_row('SELECT * FROM USERS WHERE NAME = ?', token);
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
 * get playlist songs by playlist id
 */
app.get('/playlist/:id', async (req, res) => {
    // console.log("hallo: ", req.params.id);
    const token = jwt.decode(req.get("Authorization")).username;
    const USER = await db.get_row('SELECT * FROM USERS WHERE NAME = ?', token);
    const SongsOfPlaylist = await db.get_row("SELECT SONG_ID FROM PLAYLIST_CONTAINS WHERE PLAYLIST_CONTAINS.PLAYLIST_ID = ?", +req.params.id);
    console.log("DAS IST SONGS OF PLAYLIST: ", SongsOfPlaylist);
    db.get_row("SELECT * FROM SONGS WHERE ID = ?", SongsOfPlaylist.SONG_ID)
        .then(row => {
            console.log(row);
            if (!row)
                throw 'playlist does not exist';
            res.send({
                success: true,
                data: row
            });
        })
        .catch(err => {
            console.log(err);
            res.send({
                success: false,
                msg: 'access playlist failed',
                err: err
            });
        });
});

// ----------------------------POST section----------------------------
/**
 * create new user
 */
app.post('/user', async (req, res) => {
    try {
        const user = await db.cmd('INSERT INTO USERS (NAME, PASSWORD) VALUES (?, ?)', req.body.name, req.body.password);
        // res.header(`Access-Control-Allow-Origin:`, `*`);
        res.send({
            success: true,
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
        const playlist = await db.cmd('INSERT INTO PLAYLISTS (NAME,USER_ID) VALUES (?, ?)', req.body.name, req.body.user_id);

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
/**
 * create new song
 */
app.post('/song', async (req, res) => {
    try {
        const song = await db.cmd('INSERT INTO SONGS (TITLE,ARTIST,ADDED_BY) VALUES (?, ?, ?)',
            req.body.title, req.body.artist, req.body.added_by);

        res.send({
            success: true,
            data: song
        });

    } catch (err) {
        if (err.message.match('SQLITE_CONSTRAINT')) {
            console.log(err);
            res.send({
                success: false,
                msg: 'song exists already',
            });
        } else {
            console.log(err);
            res.send({
                success: false,
                msg: 'access song failed',
                err: err
            });
        }
    }
});

module.exports = app;