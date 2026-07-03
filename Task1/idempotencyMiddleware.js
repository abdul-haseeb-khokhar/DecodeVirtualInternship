const idempotencyStore = require('./idempotencyStore');

function idempotency(req, res, next) {
    console.log('Idempotency middleware is running');
    const key = req.headers['idempotency-key'];

    if (!key) {
        return res.status(400).json({message: 'Idempotency key is required'});
    }

    const existing = idempotencyStore.get(key);

    if(existing) {
        if(existing.status === 'COMPLETED') {
            return res.status(existing.statusCode).json(existing.responseBody);
        }

        return res.status(409).json({message: "Request is already being processed"});
    }

    idempotencyStore.markProcessing(key);
    req.idempotencyKey = key;

    next();
}

module.exports = idempotency;