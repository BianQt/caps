"use strict";

const supertest = require("supertest");

const port = process.env.PORT || 8080;

const caps = require("socket.io")(port);

let payload = {
  store: "1-206-flowers",
  orderID: "4959e85d-1e95-48f9-bbd0-25e588e05b77",
  customer: "Edgar Barton",
  address: "10808 Gutkowski Heights",
};

jest.useFakeTimers();

describe("caps test", () => {
 
  it("pickup-detect", () => {
    expect(caps.emit("pickup-detect", payload)).toEqual(true);
  });

  it("in-transit-detect", () => {
    expect(caps.emit("in-transit-detect", payload)).toEqual(true);
  });

  it("delivered-detect", () => {
    expect(caps.emit("delivered-detect", payload)).toEqual(true);
  });
});

describe("vendor test", () => {
  require("../modular/vendor/vendor");
  it("ready to pickup", () => {
    expect(caps.emit("pickup-detect", payload)).toEqual(true);
  });
  it("delivered", () => {
    expect(caps.emit("delivered", payload)).toEqual(true);
  });
});

describe("driver test", () => {
  require("../modular/driver/driver");
  it("driver-pickup", () => {
      
    expect(caps.emit("pickup", payload)).toEqual(true);
  });

  it("in-transit", () => {
    expect(caps.emit("pickup-detect", payload)).toEqual(true);
  });

  it("delivered", () => {
    expect(caps.emit("delivered", payload)).toEqual(true);
  });
});
