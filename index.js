const express = require('express');
const morgan = require('morgan');
const winston = require('winston');

const { format } = winston;

const app = new express();

const PORT = 3000;

// logger
const logger = winston.createLogger({
    level: 'http',
    format: format.combine(format.colorize(), format.timestamp(), format.printf(msg => { return `${msg.timestamp} [${msg.level}] ${msg.message}`; })),
    transports: [new winston.transports.Console()],
});

const morganMiddleware = morgan(
    ':method :url :status :res[content-length] - :response-time ms',
    {
        stream: {
            write: (message) => logger.http(message.trim()),
        }
    }
);

// middleware
app.use(morganMiddleware);

// routes
app.get('/', (req, res) => {
    logger.info('test log');
    res.send('hello world get request response');
});
app.get('/user', (req, res) => {
    logger.warn('test log - warn level');
    res.send('user endpoint');
});

// listen
app.listen(PORT, () => {
    console.log('App is listening on port ', PORT);
});
