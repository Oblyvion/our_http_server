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
   res.send("Hier soll die MainPage entstehen!");
});

app.get("/Page1", (req, res) => {
    res.send("Hier soll die PlaylistSongsPage entstehen!");
});

app.get("/Page2", (req, res) => {
    res.send("Hier soll die GoToUsersPage entstehen!");
});

app.get("/Page3", (req, res) => {
    res.send("Hier soll die SearchForUsersPage entstehen!");
});

app.get("/Page4", (req, res) => {
    res.send("Hier soll die MyFriendsPage entstehen!");
});

app.get("/Page5", (req, res) => {
    res.send("Hier soll die MyAccountPage entstehen!");
});

app.listen(3000, () => {
    console.log("SERVER listening on port 3000");
});