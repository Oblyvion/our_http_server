const app = require('./app');
const fs = require('fs');
// const http = require('http');

const port = 3000;

app.listen(port, () => {
    console.log(`Server listening on port ${port}!`);
});