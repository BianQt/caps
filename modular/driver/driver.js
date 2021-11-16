"use strict";

const io = require('socket.io-client');
 
let host = 'http://localhost:8080';

const socket = io.connect(host);

socket.emit('getAll',{type: 'driver'});

socket.on('order' , (message)=>{
  console.log(`New Message : You have new order to deliver from ${message.payload}`);
  socket.emit('received', {id:message.id,store:message.payload});
})

socket.on("pickup", (order) => {
  setTimeout(() => {
    // console.log(`DRIVER: picked up ${order.orderId}`);
    socket.emit("inTransitMsg", {store:order.store});
    socket.emit("in-transit-detect", order);
  }, 3000);
});

socket.on("in-transit", (order) => {
  setTimeout(() => {
    socket.emit("deliveredMsg", {store:order.store});
    socket.emit("delivered-detect", order);
  }, 3000);
});

socket.on("delivered", (order) => {
  // console.log(`delivered up ${order.orderId}`);
});

// socket.on('newOrder' , (payload)=>{
//   CapsNameSpace.emit('newOrder',payload)
// });

