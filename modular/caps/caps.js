"use strict";
const uuid = require('uuid').v4;
const port = process.env.PORT || 8080;

const caps = require("socket.io")(port);


const msgQueue = {
  orders: {},
};

caps.on("connection", (socket) => {
  console.log("Welcome to CAPS io socket server");
  console.log("CONNECTED", socket.id);

  socket.on("pickup-detect", (payload) => {
    console.log("EVENT", { event: "pickup", time: new Date(), payload });
    caps.emit("pickup", payload);
  });

  socket.on("in-transit-detect", (payload) => {
    console.log("EVENT", { event: "in-transit", time: new Date(), payload });
    caps.emit("in-transit", payload);
  });

  socket.on("delivered-detect", (payload) => {
    console.log("EVENT", { event: "delivered", time: new Date(), payload });
    caps.emit("delivered", payload);
  });

  socket.on('newOrder-detect' , (payload)=>{
    console.log('EVENT: ', {event : 'newOrder',time : new Date(), payload : payload});

    caps.emit('newOrder',payload)
});


socket.on('newOrderMsg', (payload) => {
  console.log("New Order to pick up");
  const id = uuid();

  msgQueue.orders[id] = payload;

  console.log("after adding New Order to Msg Q >>", msgQueue);

  socket.emit('added', payload);

  caps.emit('order', { id: id, payload: msgQueue.orders[id] });
});

//Send all the message to the driver once he connected
socket.on("getAll", () => {
  Object.keys(msgQueue.orders).forEach((id) => {
    socket.emit("message", { id, messageBody: msgQueue.orders[id] });
  });
});

//Delete the message once it recived to the driver
socket.on("received", (id) => {
  delete msgQueue.orders[id];
});

});
