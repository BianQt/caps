"use strict";

const io = require('socket.io-client');
 
let host = 'http://localhost:8080';

const socket = io.connect(host);


socket.on("pickup", (order) => {
  setTimeout(() => {
    console.log(`DRIVER: picked up ${order.orderId}`);
    socket.emit("in-transit-detect", order);
  }, 1000);
});

socket.on("in-transit", (order) => {
  setTimeout(() => {
    socket.emit("delivered-detect", order);
  }, 3000);
});

socket.on("delivered", (order) => {
  console.log(`delivered up ${order.orderId}`);
});

socket.on('newOrder' , (payload)=>{
  CapsNameSpace.emit('newOrder',payload)
});
