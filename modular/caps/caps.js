"use strict";

const port = process.env.PORT || 8080;

const caps = require("socket.io")(port);

caps.on("connection", (socket) => {
    console.log('CONNECTED', socket.id);
  console.log("Welcome to CAPS io socket server");

  socket.on("pickup-detect", (payload) => {
    console.log("EVENT", { event: "pickup", time: new Date(), payload});
    caps.emit("pickup", payload);
  });

  socket.on("in-transit-detect", (payload) => {
    console.log("EVENT", { event:'in-transit',time:new Date(), payload });
    caps.emit("in-transit", payload);
  });

  socket.on("delivered-detect", (payload) => {
    console.log("EVENT", { event: "delivered", time: new Date(), payload });
    caps.emit("delivered", payload);
  });
});
