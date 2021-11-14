"use strict";

const events = require("../event.pool");
const faker = require("faker");

events.on("pickup", (order) => {
  console.log("EVENT", { event: "pickup", time: new Date(), order });
});

events.on("delivered", (order) => {
  setTimeout(() => {
    console.log(`VENDOR: Thank you for delivring ${order.orderId}`);
    console.log("EVENT", { event: "delivered", time: new Date(), order });
  }, 500);
  
});

setInterval(() => {
  let order = {
    store: "1-206-flowers",
    orderId: faker.random.uuid(),
    customer: faker.name.findName(),
    address: faker.address.streetAddress(),
  };
  events.emit("pickup-detect", order);
}, 5000);
