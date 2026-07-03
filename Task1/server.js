const express = require('express');
const idempotency = require('./idempotencyMiddleware');
const idempotencyStore = require('./idempotencyStore');

const app = express();
require('dotenv').config();

app.use(express.json());


let orderid = 0;
const orders = [];

app.post('/orders', idempotency,async (req, res) => {
    console.log('Post order is running');
    orderid++;

    const order = {
        id: orderid,
        item: req.body.item,
        price: req.body.price,
        date: new Date().toISOString()
    }

    orders.push(order);

    const responseBody = { message: 'Order created successfully',
        order,
        instance: `PID ${process.pid} on port ${process.env.PORT}` };

    await idempotencyStore.markCompleted(req.idempotencyKey, 201, responseBody);

    res.status(201).json(responseBody);

});

app.get('/orders', (req, res) => {
    console.log("Get orders is running");
    res.status(200).json(orders);
});

async function startServer() {
    await idempotencyStore.connect();
    app.listen(process.env.PORT, () => {
        console.log(`Server is running on port ${process.env.PORT}`);
    });
}

startServer();