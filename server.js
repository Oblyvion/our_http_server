const http = require('http');
const url = require('url');
// Konstante für das Modul express
const express = require('express');

http.createServer((req, res) => {
    console.log('My http-Server started....');
    console.log(req.url);

    const header = 'Hello Server';

    // Root-Page
    if (req.url === '/') {
        res.writeHead(200, {'content-type': 'text/plain'});
        res.end(header);
    }
    // API
    if (req.url === '/api') {
        res.writeHead(200, {'content-type': 'application/json'});
        const json = JSON.stringify({
            Header: header,
            'TODO': "Eventuell schon mal eine 'kleine' Datenbank erstellen, mh?"
        });
        res.end(json);
    }
    if (req.url === '/missing') {
        res.writeHead(404, {'content-type' : 'text/plain'});
        res.end('Here you can find nothing ;)');
    }
}).listen(3000);