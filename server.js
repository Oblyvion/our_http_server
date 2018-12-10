// const http = require('http');
// const url = require('url');

// Konstante für das Modul express
const express = require('express');
const request = require('request');
const app = express();

app.use(express.json());

let users = [
    {id: 1,
    name: 'Zwenjamin'}
];

app.get("/", (req, res) => {
   res.send("Hello you. I'm your first REST API");
});

app.get("/user", (req, res) => {
   res.send(users);
});

app.get("/user/id:", (req, res) => {
   res.send(
       users.find(
           (user) => user.id === +req.params.id
       )
   );
});

app.post("/user", (req, res) => {
  console.log(req.params, req.body);
  const new_user = {
      id: users.length + 1,
      name: req.body.name
  };
  users.push(new_user);
  res.json(new_user);
});

app.get("/proxy", function (req, res) {

    const options = {
        url: 'https://jsonplaceholder.typicode.com/posts',
        method: 'GET',
        headers: {
            'Accept': 'application/json',
        }
    };

    request(options, function (err, output, body) {
        var posts = JSON.parse(body);
        const found = posts.find(
            (p) => p.title.match(/temporibus sit alias/)
        );
        res.json(found);
    });
});

// TODO HURENSOHN!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
console.log('FUCKING ERROROROOROROROROROOROROROROROROOR');
app.listen(3000, '/api', 202, function () {
    console.log("jojojjojoojojooooooooooooooooooooooooooooo");
});

// app.use('/', (req, res) => res.send(header));
// router.('/api', (req, res) => {
//     // const json = JSON.stringify({
//     //     Header: header,
//     // });
//     res.json({
//         Header: header,
//         'TODO': 'Eventuell mal DIREKT mit EXPRESS eine Datenbank erstellen...?'
//     })
// });
// app.use('/api', router);
//
// app.listen(port, () => console.log('Server listen on port: ' + port));


// http.createServer((req, res) => {
//     console.log('My http-Server started....');
//     console.log(req.url);
//
//     const header = 'Hello Server';
//
//     // Root-Page
//     if (req.url === '/') {
//         res.writeHead(200, {'content-type': 'text/plain'});
//         res.end(header);
//     }
//     // API
//     if (req.url === '/api') {
//         res.writeHead(200, {'content-type': 'application/json'});
//         const json = JSON.stringify({
//             Header: header,
//             'TODO': "Eventuell schon mal eine 'kleine' Datenbank erstellen, mh?"
//         });
//         res.end(json);
//     }
//     if (req.url === '/missing') {
//         res.writeHead(404, {'content-type' : 'text/plain'});
//         res.end('Here you can find nothing ;)');
//     }
// }).listen(3000);