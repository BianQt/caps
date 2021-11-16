'use strict';

const faker = require("faker");
const io = require('socket.io-client');
const host = 'http://localhost:8080';
const socket = io.connect(host);

setInterval(() => {
  let order = {
    store: 'Acme-Widget'
};
  socket.emit("newOrder-detect", order);
}, 5000);
