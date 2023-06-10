const response = (statusCode, ...items) => {
    res.json(statusCode, {
        payload: items.length > 1 ? items : items[0],
        message,
    });
};

module.exports = response