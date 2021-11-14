"use strict";
const events = require("../event.pool");

events.on("pickup", (order) => {
  setTimeout(() => {
    console.log(`DRIVER: picked up ${order.orderId}`);
    events.emit("in-transit", order);
  }, 1000);
});

events.on("in-transit", (order) => {
  console.log("EVENT", { event:'in-transit',time:new Date(), order });
  setTimeout(() => {
    events.emit("delivered-detect", order);
  }, 3000);
});

events.on("delivered", (order) => {
  console.log(`delivered up ${order.orderId}`);
});
