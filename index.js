const express = require('express');
const app = express();
const fs = require('fs');
const crypto = require('crypto');
var accounts = fs.readFileSync(__dirname + '/accounts.json');

function assign(nonce) {
  let assignments = JSON.parse(fs.readFileSync(__dirname + '/assignments.json'));
  assignments['REGISTER'].push(nonce);

  let activity = {
    type: 'FOUND',
    nonce: nonce,
    timestamp: new Date()
  }

  fs.writeFileSync(__dirname + '/activity/' + nonce, JSON.stringify(activity, 0, 2));

  let address = nonce.split('.')[0];
  if (assignments[address]) {
    assignments[address].push(nonce);
    fs.writeFileSync(__dirname + '/assignments.json', JSON.stringify(assignments, 0, 2));
    return 'SUCCESSFUL: Acoin registered and assigned.';
  } else {
    fs.writeFileSync(__dirname + '/assignments.json', JSON.stringify(assignments, 0, 2));
    return 'WARNING: Acoin registered but not assigned, address could not be found.';
  }
}

app.post('/register/:nonce', (request, response) => {
  let nonce = request.params.nonce;
  if (crypto.createHash('sha256').update(nonce).digest('hex').slice(0, 7) === '0000000') {
    let noncefile = fs.readdirSync(__dirname + '/activity');
    let nonceregister = JSON.parse(fs.readFileSync(__dirname + '/assignments.json')).REGISTER;
    if (noncefile.includes(nonce) || nonceregister.includes(nonce)) {
      setTimeout(() => {
        response.status(400).send('UNAUTHORIZED: Acoin is registered already!');
      }, 5000)
    } else {
      response.send(assign(nonce));
    }
    nonce = nonce.split('.');
  }
})

require('http').createServer(app).listen(80);