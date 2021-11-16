"use strict";
const faker = require("faker");
const io = require("socket.io-client");

let host = "http://localhost:8080";

const capsConnection = io.connect(host);

capsConnection.on("delivered", (order) => {
  setTimeout(() => {
    console.log(`VENDOR: Thank you for delivring ${order.orderId}`);
    console.log("EVENT", { event: "delivered", time: new Date(), order });
  }, 500);
});

capsConnection.on("newOrder", (newOrder) => {
  console.log("==============================");
  let customerOrder = {
    store: "flower",
    orderID: faker.datatype.uuid(),
    customer: faker.name.findName(),
    address: faker.address.streetAddress(),
    orderType: newOrder.type,
    messageBody: `You have new order to deliver ${newOrder.type}`,
  };

  let messageBody = {
    messageBody: `You have new order to deliver ${newOrder.type}`,
  };

  console.log(messageBody);
  capsConnection.emit("pickup-detect", customerOrder);
  
  setTimeout(() => {
    capsConnection.emit("newOrderMsg", messageBody);
  }, 500);

  capsConnection.on("added", () => {
    capsConnection.disconnect();
  });
});

