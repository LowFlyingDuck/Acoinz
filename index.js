const express = require('express');
const app = express();
const fs = require('fs');
var accounts = fs.readFileSync(__dirname + 'accounts.json');

app.post('/register/:nonce', (request, response) => {
  let nonce = request.params.nonce;
  nonce = nonce.split('.');
  if (nonce.length === 2) {

  }
})

require('http').createServer(app).listen(80);