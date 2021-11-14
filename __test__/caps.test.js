"use strict";

const supertest = require("supertest");
const events = require("../modular/event.pool");

let payload = {
  store: "1-206-flowers",
  orderID: "4959e85d-1e95-48f9-bbd0-25e588e05b77",
  customer: "Edgar Barton",
  address: "10808 Gutkowski Heights",
};

jest.useFakeTimers();

describe("caps test", () => {
  require("../modular/caps");
  it("pickup-detect", () => {
    expect(events.emit("pickup-detect", payload)).toEqual(true);
  });

  it("in-transit-detect", () => {
    expect(events.emit("in-transit-detect", payload)).toEqual(true);
  });

  it("delivered-detect", () => {
    expect(events.emit("delivered-detect", payload)).toEqual(true);
  });
});

describe("vendor test", () => {
  require("../modular/vendor/vendor");
  it("ready to pickup", () => {
    expect(events.emit("pickup-detect", payload)).toEqual(true);
  });
  it("delivered", () => {
    expect(events.emit("delivered", payload)).toEqual(true);
  });
});

describe("driver test", () => {
  require("../modular/driver/driver");
  it("driver-pickup", () => {
      
    expect(events.emit("pickup", payload)).toEqual(true);
  });

  it("in-transit", () => {
    expect(events.emit("pickup-detect", payload)).toEqual(true);
  });

  it("delivered", () => {
    expect(events.emit("delivered", payload)).toEqual(true);
  });
});
