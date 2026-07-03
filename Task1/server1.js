const express = require('express');
const os = require('os');
const { createClient } = require('redis');

const app = express();
const PORT = process.env.PORT;

const redisClient = createClient({ url: 'redis://127.0.0.1:6379' });
redisClient.on('error', (err) => console.log('Redis error', err));

async function startServer() {
    await redisClient.connect();

    app.get('/',async (req, res) => {
        
        const hitCount = await redisClient.incr('hitCount');
        console.log(`Hit count: ${hitCount}`);

        res.json({
            message: 'Hello from server',
            instance: `PID ${process.pid} on port ${PORT}`,
            hostname: os.hostname(),
            hitCount,
        });
    });

    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}, (PID ${process.pid})`);
    })

}

startServer();