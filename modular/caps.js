"use strict";

const events = require("./event.pool");
require('./vendor/vendor');
require('./driver/driver')

events.on("pickup-detect", (payload) => {
events.emit('pickup', payload);
});

events.on("in-transit-detect", (payload) => {
events.emit('in-transit',payload);
});

events.on("delivered-detect", (payload) => {
events.emit('delivered',payload);
});
