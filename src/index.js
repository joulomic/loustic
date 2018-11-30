     require('dotenv').config({ path: 'variables.env' });
const express = require('express');
    const bodyParser = require('body-parser');

    const app = express();
   const verifyWebhook = require('./verify-webhook');
    const messageWebhook = require('./message-webhook');
const PORT = process.env.PORT || 5000;

    app.get('/', verifyWebhook);
    app.post('/', messageWebhook);
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    app.listen(PORT, () => console.log('Express server is listening on port 5000'));
