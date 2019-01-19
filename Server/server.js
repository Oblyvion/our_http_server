const app = require('./app');
const https = require('https');
const fs = require('fs');

const port = 3000;
const options = {
    key: fs.readFileSync('./Server/Signature/our_http_server.key'),
    cert: fs.readFileSync('./Server/Signature/certificate.cert')
};

https.createServer(options, (req, res) => {
    res.writeHead(200);
}).listen(port);