const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const {google} = require('googleapis');
const CircularJSON = require('circular-json');
var youtube = google.youtube({
   version: 'v3',
   auth: "AIzaSyDoTv0uLjo42lMy7mlvgECfEx7t2e2Of38"
});


/*youtube.search.list({
    part: 'snippet',
    q: 'your search query'
  }, function (err, data) {
    if (err) {
      console.error('Error: ' + err);
    }
    if (data) {
      console.log(data)
    }
});*/

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
        if (event.message){
          console.log(event.message.quick_reply.payload);
        }
        if (event.message && event.message.text) {
          if (event.message.text === 'Music') {
            sendVideo(event.sender.id);
          }
          else if (event.message.quick_reply.payload === "START_YES") {
            handleStartYesPostback(event.sender.id);
          }
          else if (event.message.quick_reply.payload === "START_NO") {
            sendMessage(event, "Alright, just text me 'Music' whenever you feel like discovering music later on!");
          }
          else if (event.message.quick_reply.payload === "HIPHOP") {
            const res = youtube.search.list({ 
            part: 'snippet',
            channelId: 'UCHziILhb2V5ahNIMSmaOAbQ',
            maxResults: '50',
            //order: 'date',
            q: 'rap'
            }, function (err, data) {
              if (err) {
                console.error('Error: ' + err);
              } 
              if (data) {
                console.log(data.data);
              
                var json = {}; 
 
                for(var i in data.data.items) {
                  console.log('totoooooo');
                  var title = data.data["items"][i]["snippet"]["title"];
                  var description = data.data["items"][i]["snippet"]["description"];
                  var thumb = data.data["items"][i]["snippet"]["thumbnails"]["url"];
                  var url = data.data["items"][i]["id"];
                  var item = data.items[i];
                  var message = {
                    "attachment": {
                      "type": "template",
                      "payload": {
                        "template_type": "generic",
                        "elements": [{
                          "title": title,
                          "subtitle": description,
                          "image_url": thumb,
                          "default_action": {
                            "type": "web_url",
                            "url": "https://www.youtube.com/watch?v="+url,
                            "webview_height_ratio": "tall",
                          },
                          "buttons": [{
                            "type": "web_url",
                            "url": "https://www.youtube.com/watch?v="+url,
                            "title": "Play video"
                          }
                          ],
                        }
                      ]
                    }
                  }};
                  var json = json.concat(message);
                }
                sendYTVideo(event.sender.id, json);
              } 
            });
          }
        }
        else if (event.postback && event.postback.payload === "GREETING") {
          handleGreetingPostback(event.sender.id);
        }
        
        /*
        else if (event.postback && event.postback.payload === "START_NO") {
          sendMessage(event, "Alright, just text me 'Music' whenever you feel like discovering music later on!");
        }
        else if (event.postback && event.postback.payload === "START_YES") {
          handleStartYesPostback(event.sender.id);
        }
        else if (event.postback && event.postback.payload === "HIPHOP") { 
          youtube.search.list({
          part: 'snippet',
          q: 'rap'
          }, function (err, data) {
            if (err) {
              console.error('Error: ' + err);
            }
            if (data) {
              console.log(data)
            }
          });
        }
        */

      });
    });
    res.status(200).end();
  }
});

const request = require('request');

function sendMessage(event, msg) {
  let sender = event.sender.id;
  let text = msg; //event.message.text;

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

function handleGreetingPostback(sender_psid){
  request({
    url: "https://graph.facebook.com/v2.6/" + sender_psid,
    qs: {
      access_token: process.env.PAGE_ACCESS_TOKEN,
      fields: "first_name"
    },
    method: "GET"
  }, function(error, response, body) {
    var greeting = "";
    if (error) {
      console.log("Error getting user's name: " +  error);
    } else {
      var bodyObj = JSON.parse(body);
      const name = bodyObj.first_name;
      greeting = "Hi " + name + ". ";
    }
    const message = greeting + "Would you like to discover our best videos now?";
    const greetingPayload = {
      "text": message,
      "quick_replies":[
        {
          "content_type":"text",
          "title":"Yes!",
          "payload": "START_YES"
        },
        {
          "content_type":"text",
          "title":"No, thanks.",
          "payload": "START_NO"
        }
      ]
    };
    callSendAPI(sender_psid, greetingPayload);
  });
}

function handleStartYesPostback(sender_psid){
  request({
    url: `https://graph.facebook.com/v2.6/me/messages/${sender_psid}`,
    qs: {
      access_token: process.env.PAGE_ACCESS_TOKEN,
      fields: "first_name"
    },
    method: "GET"
  }, function(error, response, body) {
    var greeting = "";
    if (error) {
      console.log("Error getting user's name: " +  error);
    } else {
      var bodyObj = JSON.parse(body);
      const name = bodyObj.first_name;
      greeting = "What are you interesting in listening?";
    }
    const message = greeting;
    const greetingPayload = {
      "text": message,
      "quick_replies":[
        {
          "content_type":"text",
          "title":"New!",
          "payload": "NEW"
        },
        {
          "content_type":"text",
          "title":"Pop/Rock",
          "payload": "POPROCK"
        },
        {
          "content_type":"text",
          "title":"World",
          "payload": "WORLD"
        },
        {
          "content_type":"text",
          "title":"Hip hop",
          "payload": "HIPHOP"
        },
        {
          "content_type":"text",
          "title":"Jazz",
          "payload": "JAZZ"
        },
        {
          "content_type":"text",
          "title":"Electro",
          "payload": "ELECTRO"
        }
      ]
    };
    callSendAPI(sender_psid, greetingPayload);
  });
}

function sendYTVideo(sender, messageData) {
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
                        "type": "web_url",
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
                        "title": "Play video",
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

function callSendAPI(sender_psid, response) {
  // Construct the message body
  console.log('message to be sent: ', response);
  let request_body = {
    "recipient": {
      "id": sender_psid
    },
    "message": response
  }

  // Send the HTTP request to the Messenger Platform
  request({
    "url": 'https://graph.facebook.com/v2.6/me/messages',
    "qs": { "access_token": process.env.PAGE_ACCESS_TOKEN },
    "method": "POST",
    "json": request_body
  }, (err, res, body) => {
    console.log("Message Sent Response body:", body);
    if (err) {
      console.error("Unable to send message:", err);
    }
  });
}

