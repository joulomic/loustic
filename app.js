const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const server = app.listen(process.env.PORT || 5000, () => {
  console.log('Express server listening on port %d in %s mode', server.address().port, app.settings.env);
});

/* For Facebook Validation */
app.get('/webhook', (req, res) => {
  if (req.query['hub.mode'] && req.query['hub.verify_token'] === process.env.VERIFICATION_TOKEN) {
    res.status(200).send(req.query['hub.challenge']);
  } else {
    res.status(403).end();
  }
});

/* Handling all messenges */
app.post('/webhook', (req, res) => {
  console.log(req.body);
  if (req.body.object === 'page') {
    req.body.entry.forEach((entry) => {
      entry.messaging.forEach((event) => {
        if (event.message && event.message.text) {
          if (event.message.text === 'Music') {
            sendVideo(event.sender.id);
          }
          else {
            sendMessage(event);
          }
        }
      });
    });
    res.status(200).end();
  }
});

const request = require('request');

function sendMessage(event) {
  let sender = event.sender.id;
  let text = event.message.text;

  request({
    url: 'https://graph.facebook.com/v2.6/me/messages',
    qs: {access_token: process.env.PAGE_ACCESS_TOKEN},
    method: 'POST',
    json: {
      recipient: {id: sender},
      message: {text: text}
    }
  }, function (error, response) {
    if (error) {
        console.log('Error sending message: ', error);
    } else if (response.body.error) {
        console.log('Error: ', response.body.error);
    }
  });
}


function sendVideo(sender) {
    messageData = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [{
                    "title": "Charlotte Grace",
                    "subtitle": "Element #1 of an hscroll",
                    "image_url": "https://i3.ytimg.com/vi/roQb5HIQXB8/hqdefault.jpg",
                    "default_action": {
                      "type": "web_url",
                      "url": "https://www.youtube.com/watch?v=roQb5HIQXB8",
                      "webview_height_ratio": "tall",
                    },
                    "buttons": [{
                        "type": "postback",
                        "url": "https://www.youtube.com/watch?v=roQb5HIQXB8",
                        "title": "Play video"
                    }
                    ],
                }, {
                    "title": "Chilla",
                    "subtitle": "Element #2 of an hscroll",
                    "image_url": "https://i1.ytimg.com/vi/8bz6khgCZ30/hqdefault.jpg",
                    "default_action": {
                      "type": "web_url",
                      "url": "https://youtu.be/8bz6khgCZ30",
                      "webview_height_ratio": "tall",
                    },
                    "buttons": [{
                        "type": "web_url",
                        "url": "https://youtu.be/8bz6khgCZ30",
                        "title": "Postback",
                        "payload": "Payload for second element in a generic bubble",
                    }],
                }]
            }
        }
    };
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token: process.env.PAGE_ACCESS_TOKEN},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error);
        } else if (response.body.error) {
            console.log('Error: ', response.body.error);
        }
    });
}

