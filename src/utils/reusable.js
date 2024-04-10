const Answer = (res, status, message) => {
    res.status(status).json({message});
}

module.exports = Answer; 