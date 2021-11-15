'use strict';

const faker = require("faker");
const io = require('socket.io-client');
const host = 'http://localhost:8080';
const socket = io.connect(host);

setInterval(() => {
  let order = {
    store: "1-206-flowers",
    orderId: faker.random.uuid(),
    customer: faker.name.findName(),
    address: faker.address.streetAddress(),
  };
  socket.emit("pickup-detect", order);
}, 5000);
