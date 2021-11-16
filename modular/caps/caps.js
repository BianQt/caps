"use strict";
const uuid = require("uuid").v4;
const port = process.env.PORT || 8080;

const caps = require("socket.io")(port);

const msgQueue = {
  flowerShop: {
    toPickup: {},
    inTransit: {},
    delivered: {},
  },
  AcmeWidget: {
    toPickup: {},
    inTransit: {},
    delivered: {},
  }
};

caps.on("connection", (socket) => {
  // console.log("Welcome to CAPS io socket server");
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

  socket.on("newOrder-detect", (payload) => {
    console.log("EVENT: ", {
      event: "newOrder",
      time: new Date(),
      payload: payload,
    });
    caps.emit("newOrder", payload);
  });

  socket.on("newOrderMsg", (payload) => {
    // console.log("New Order to pick up");
    const id = uuid();
    if (payload.store === "flower-shop") {
      msgQueue.flowerShop.toPickup[id] = payload.store;
      console.log("after adding New Order to Msg Q >>", msgQueue.flowerShop);
      // socket.emit('added', payload); //To disconnect the vendor
      caps.emit("order", { id: id, payload: msgQueue.flowerShop.toPickup[id] });
    }

    if (payload.store === "Acme-Widget") {
      msgQueue.AcmeWidget.toPickup[id] = payload.store;
      console.log("after adding New Order to Msg Q >>", msgQueue.AcmeWidget);
      // socket.emit('added', payload); //To disconnect the vendor
      caps.emit("order", { id: id, payload: msgQueue.AcmeWidget.toPickup[id] });
    }
  });

  socket.on("inTransitMsg", (payload) => {
    // console.log("New Order to pick up");
    const id = uuid();
    if (payload.store === "flower-shop") {
      msgQueue.flowerShop.inTransit[id] = payload.store;
      console.log("after adding New Order to Msg Q >>", msgQueue.flowerShop);
      socket.emit("added", payload); //To disconnect the vendor
      caps.emit("orderInTransit", {
        id: id,
        payload: msgQueue.flowerShop.inTransit[id],
      });
    }
    if (payload.store === "Acme-Widget") {
      msgQueue.AcmeWidget.inTransit[id] = payload.store;
      console.log("after adding New Order to Msg Q >>", msgQueue.AcmeWidget);
      socket.emit("added", payload); //To disconnect the vendor
      caps.emit("orderInTransit", {
        id: id,
        payload: msgQueue.AcmeWidget.inTransit[id],
      });
    }
  });

  socket.on("deliveredMsg", (payload) => {
    // console.log("New Order to pick up");
    const id = uuid();
    if (payload.store === "flower-shop") {
      msgQueue.flowerShop.delivered[id] = payload.store;
      console.log("after adding New Order to Msg Q >>", msgQueue.flowerShop);
      socket.emit("added", payload); //To disconnect the vendor
      caps.emit("orderDelivered", {
        id: id,
        payload: msgQueue.flowerShop.delivered[id],
      });
    }
    if (payload.store === "Acme-Widget") {
      msgQueue.AcmeWidget.delivered[id] = payload.store;
      console.log("after adding New Order to Msg Q >>", msgQueue.AcmeWidget);
      socket.emit("added", payload); //To disconnect the vendor
      caps.emit("orderDelivered", {
        id: id,
        payload: msgQueue.AcmeWidget.delivered[id],
      });
    }
  });

  //Send all the message to the driver once he connected
  socket.on("getAll", (payload) => {
    console.log(payload);
    if (payload.type === "vendor") {
      Object.keys(msgQueue.flowerShop.inTransit).forEach((id) => {
        socket.emit("orderInTransit", {
          id: id,
          payload: msgQueue.flowerShop.inTransit[id],
        });
      });
      Object.keys(msgQueue.flowerShop.delivered).forEach((id) => {
        socket.emit("orderDelivered", {
          id: id,
          payload: msgQueue.flowerShop.delivered[id],
        });
      });

      Object.keys(msgQueue.AcmeWidget.inTransit).forEach((id) => {
        socket.emit("orderInTransit", {
          id: id,
          payload: msgQueue.AcmeWidget.inTransit[id],
        });
      });
      Object.keys(msgQueue.AcmeWidget.delivered).forEach((id) => {
        socket.emit("orderDelivered", {
          id: id,
          payload: msgQueue.AcmeWidget.delivered[id],
        });
      });
    }
    if (payload.type === "driver") {
      Object.keys(msgQueue.flowerShop.toPickup).forEach((id) => {
        console.log(id);
        socket.emit("order", {
          id: id,
          payload: msgQueue.flowerShop.toPickup[id],
        });
      });

      Object.keys(msgQueue.AcmeWidget.toPickup).forEach((id) => {
        console.log(id);
        socket.emit("order", {
          id: id,
          payload: msgQueue.AcmeWidget.toPickup[id],
        });
      });
    }
  });

  //Delete the message once it recived to the driver
  socket.on("received", (payload) => {
    if (payload.store === "flower-shop") {
      delete msgQueue.flowerShop.toPickup[payload.id];
      delete msgQueue.flowerShop.inTransit[payload.id];
      delete msgQueue.flowerShop.delivered[payload.id];
      console.log("after deleting from Msg Q >>", msgQueue.flowerShop);
    }

    if (payload.store === "Acme-Widget") {
      delete msgQueue.AcmeWidget.toPickup[payload.id];
      delete msgQueue.AcmeWidget.inTransit[payload.id];
      delete msgQueue.AcmeWidget.delivered[payload.id];
      console.log("after deleting from Msg Q >>", msgQueue.AcmeWidget);
    }
  });
});
