const  {createClient} = require('redis');

const redisClient = createClient({
    url: process.env.REDIS_URL
});
redisClient.on("error", (err) => console.log('Redis Error: ', err));

async function connect() {
    await redisClient.connect();
}

async function get(key) {
    const raw = await redisClient.get(`idempotency:${key}`);
    return raw ? JSON.parse(raw) : null;
}

async function markProcessing(key) {
    const value = JSON.stringify({status: 'PROCESSING', statusCode: null, responseBody: null});
    await redisClient.set(`idempotency:${key}`, value, {EX: 86400});
}

async function markCompleted(key, statusCode, responseBody) {
    const value = JSON.stringify({status: 'COMPLETED', statusCode, responseBody});
    await redisClient.set(`idempotency:${key}`, value, {EX: 86400});
}

module.exports = {
    connect,get, markProcessing, markCompleted
};