"use strict";

const io = require('socket.io-client');
 
let host = 'http://localhost:8080';

const socket = io.connect(host);


socket.on("delivered", (order) => {
  setTimeout(() => {
    console.log(`VENDOR: Thank you for delivring ${order.orderId}`);
    console.log("EVENT", { event: "delivered", time: new Date(), order });
  }, 500);
  
});


