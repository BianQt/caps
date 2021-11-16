'use strict';
const io = require('socket.io-client');
const uuid = require('uuid').v4;

let host = 'http://localhost:8080';

const capsConnection = io.connect(host);

const msgQueue = {
    orders: {}
};

capsConnection.on('connection',socket=>{
    console.log("CONNECTED to queue-server", socket.id);

    socket.on('newOrderMsg',payload=>{
        console.log('New Order to pick up');
        const id = uuid();

        msgQueue.orders[id] = payload;

        console.log('after adding New Order to Msg Q >>', msgQueue);

        socket.emit('added',payload);

        capsConnection.emit('order',{id:id, payload: msgQueue.orders[id]})
    });

    //Send all the message to the driver once he connected
    socket.on('getAll' , ()=>{
        Object.keys(msgQueue.orders).forEach( id =>{
            socket.emit('message' , {id , messageBody : msgQueue.orders[id]});
        })
    });

    //Delete the message once it recived to the driver
    socket.on('received' , (id)=>{
        delete msgQueue.orders[id];
    });

})