// const request = require('request');
const express = require('express');
const sqLite = require('sqlite3');
const {celebrate, Joi, isCelebrate} = require('celebrate');
const EscapeHtml = require('escape-html');
const DB = require('./db');
const cors = require('cors');

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
 * get all songs
 */
app.get('/songs', (req, res) => {
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
 * get all playlists
 */
app.get('/playlists', (req, res) => {
    db.get_rows('SELECT * FROM PLAYLISTS')
        .then(rows => {
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
 * get playlist by id
 */
app.get('/playlist/:id', (req, res) => {
    db.get_row('SELECT NAME,USER_ID FROM PLAYLISTS WHERE ID = ?', +req.params.id)
        .then(row => {
            if (!row)
                throw 'playlist does not exist';
            res.send({
                success: true,
                data: row
            });
        })
        .catch(err => {
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
        const users = await db.get_row('SELECT MAX(ID) + 1 AS NEXT_ID FROM USERS');
        console.log(`created ${users.NEXT_ID}`);
        await db.cmd('INSERT INTO USERS (ID, NAME, PASSWORD) VALUES (?, ?, ?)', [users.NEXT_ID, req.body.username, req.body.password]);
        const user = await db.get_row('SELECT * FROM USERS WHERE ID = ?', [+ users.NEXT_ID]);
        console.log(user);
        res.header('Access-Control-Allow-Origin:', "*");
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
        const playlist = await db.cmd('INSERT INTO PLAYLISTS (NAME,USER_ID) VALUES (?, ?)', "Test POSTPlaylist", 1);

        res.send({
            success: true,
            data: playlist
        });

    } catch (err) {
        res.send({
            success: false,
            msg: 'access playlist failed',
            err: err
        });
    }
});
/**
 * create new song
 */
app.post('/song', async (req, res) => {
    try {
        const song = await db.cmd('INSERT INTO SONGS (TITLE,ARTIST,ADDED_BY) VALUES (?, ?, ?)',
            "TestArtist POSTSong", "TestTitle POSTSong", 1);

        res.send({
            success: true,
            data: song
        });

    } catch (err) {
        res.send({
            success: false,
            msg: 'access song failed',
            err: err
        });
    }
});

module.exports = app;