const response = (statusCode, data, message, res) => {
    res.json(statusCode, 
        {
            payload: data,
            message,
        },
    )
}

module.exports = response