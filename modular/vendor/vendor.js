"use strict";
const faker = require("faker");
const io = require("socket.io-client");

let host = "http://localhost:8080";

const capsConnection = io.connect(host);

capsConnection.emit('get_all',{type: 'vendor'});

capsConnection.on("orderInTransit", (message) => {
  console.log(
    `New Message : Your order ${message.id} has been picked up and it's in the transit state`
  );
  capsConnection.emit("received", { id: message.id, store: message.payload });
});

capsConnection.on("orderDelivered", (message) => {
  console.log(
    `New Message : Your order ${message.id} has been delivered`
  );
  capsConnection.emit("received", { id: message.id, store: message.payload });
});


capsConnection.on("delivered", (order) => {
  setTimeout(() => {
    // console.log(`VENDOR: Thank you for delivring ${order.orderId}`);
    // console.log("EVENT", { event: "delivered", time: new Date(), order });
  }, 500);
});

capsConnection.on("newOrder", (newOrder) => {
  let customerOrder = {
    store: newOrder.store,
    orderID: faker.datatype.uuid(),
    customer: faker.name.findName(),
    address: faker.address.streetAddress(),
    messageBody: `You have new order to deliver from ${newOrder.store}`,
  };

  let message = {
    store: newOrder.store,
    messageBody: `You have new order to deliver ${newOrder.store}`,
  };

  // console.log(message);
  capsConnection.emit("pickup-detect", customerOrder);

  setTimeout(() => {
    capsConnection.emit("newOrderMsg", message);
  }, 500);

  capsConnection.on("added", () => {
    capsConnection.disconnect();
  });
});
