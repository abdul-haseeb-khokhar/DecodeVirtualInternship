const store = new Map();

function get(key) {
    return store.get(key) || null;
}

function markProcessing(key) {
    store.set(key, { status: 'PROCESSING', statusCode: null, responseBody : null });
}

function markCompleted(key, statusCode, responseBody) {
    store.set(key, { status: 'COMPLETED', statusCode, responseBody});
}

module.exports = {
    get, markProcessing, markCompleted
};