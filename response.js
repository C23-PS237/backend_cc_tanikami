const response = (statusCode, data, message, res) => {
    res.json(statusCode,
        {
            payload: data[0],
            message,
        },
    )
}

module.exports = response