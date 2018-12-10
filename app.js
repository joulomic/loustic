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

/* Shuffle list of values */
function shuffle(array) {
  var tmp, current, top = array.length;
  if(top) while(--top) {
    current = Math.floor(Math.random() * (top + 1));
    tmp = array[current];
    array[current] = array[top];
    array[top] = tmp;
  }
  return array;
}

/* Handling all messenges */
app.post('/webhook', (req, res) => {
  console.log(req.body);
  if (req.body.object === 'page') {
    req.body.entry.forEach((entry) => {
      entry.messaging.forEach((event) => {
        if (event.message){
          console.log(event.message);
        }
        if (event.message && event.message.text) {
          if (event.message.text === 'Music') {
            console.log('Music');
            handleStartYesPostback(event.sender.id);
            //sendVideo(event.sender.id);
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
                var a=[];
                for(var j in data.data.items) {
                  a[j]=j;
                }
                a = shuffle(a);
                for(var i in data.data.items) {
                  console.log('totoooooo');
                  console.log(i==0);
                  var title = data.data["items"][a[i]]["snippet"]["title"];
                  var description = data.data["items"][a[i]]["snippet"]["description"];
                  var thumb = data.data["items"][a[i]]["snippet"]["thumbnails"]["high"]["url"];
                  var url = data.data["items"][a[i]]["id"]["videoId"];
                  console.log(thumb);
                  console.log(url);
                  var message = {
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
                          },{
                          "type":"postback",
                          "title":"Browse more",
                          "payload":"MORE"
                          }
                          ]
                        };
                  if (i == 0) {
                    var elements = [];
                    elements.push(message);
                    console.log(elements);
                  }
                  else if (i <= 4){
                    elements.push(message);
                    console.log(elements);
                  }
                  //msg = Object.assign(msg, message);
                }
                var message = {
                    "attachment": {
                      "type": "template",
                      "payload": {
                        "template_type": "generic",
                        "elements": elements
                    }
                }}};
                console.log(elements);
                sendYTVideo(event.sender.id, message);
               
            });
        }
 
        else if (event.message.quick_reply.payload === "JAZZ") {
            const res = youtube.search.list({
            part: 'snippet',
            channelId: 'UCHziILhb2V5ahNIMSmaOAbQ',
            maxResults: '50',
            //order: 'date',
            q: 'jazz'
            }, function (err, data) {
              if (err) {
                console.error('Error: ' + err);
              }
              if (data) {
                console.log(data.data);
                var a=[];
                for(var j in data.data.items) {
                  a[j]=j;
                }
                a = shuffle(a);
                for(var i in data.data.items) {
                  console.log('totoooooo');
                  console.log(i==0);
                  var title = data.data["items"][a[i]]["snippet"]["title"];
                  var description = data.data["items"][a[i]]["snippet"]["description"];
                  var thumb = data.data["items"][a[i]]["snippet"]["thumbnails"]["high"]["url"];
                  var url = data.data["items"][a[i]]["id"]["videoId"];
                  console.log(thumb);
                  console.log(url);
                  var message = {
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
                          },{
                          "type":"postback",
                          "title":"Browse more",
                          "payload":"MORE"
                          }
                          ]
                        };        
                  if (i == 0) {
                    var elements = [];
                    elements.push(message);
                    console.log(elements);
                  }
                  else if (i <= 4){
                    elements.push(message);
                    console.log(elements);
                  }
                  //msg = Object.assign(msg, message);
                }
                var message = {
                    "attachment": {
                      "type": "template",
                      "payload": {
                        "template_type": "generic",
                        "elements": elements
                    }
                }}};
                console.log(elements);
                sendYTVideo(event.sender.id, message);
              
            });
        }

        else if (event.message.quick_reply.payload === "POPROCK") {
            const res = youtube.search.list({
            part: 'snippet',
            channelId: 'UCHziILhb2V5ahNIMSmaOAbQ',
            maxResults: '50',
            //order: 'date',
            q: 'pop|rock'
            }, function (err, data) {
              if (err) {
                console.error('Error: ' + err);
              }
              if (data) {
                console.log(data.data);
                var a=[];
                for(var j in data.data.items) {
                  a[j]=j;
                }
                a = shuffle(a);
                for(var i in data.data.items) {
                  console.log('totoooooo');
                  console.log(i==0);
                  var title = data.data["items"][a[i]]["snippet"]["title"];
                  var description = data.data["items"][a[i]]["snippet"]["description"];
                  var thumb = data.data["items"][a[i]]["snippet"]["thumbnails"]["high"]["url"];
                  var url = data.data["items"][a[i]]["id"]["videoId"];
                  console.log(thumb);
                  console.log(url);
                  var message = {
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
                          },{
                          "type":"postback",
                          "title":"Browse more",
                          "payload":"MORE"
                          }
                          ]
                        };
                  if (i == 0) {
                    var elements = [];
                    elements.push(message);
                    console.log(elements);
                  }
                  else if (i <= 4){
                    elements.push(message);
                    console.log(elements);
                  }
                  //msg = Object.assign(msg, message);
                }
                var message = {
                    "attachment": {
                      "type": "template",
                      "payload": {
                        "template_type": "generic",
                        "elements": elements
                    }
                }}};
                console.log(elements);
                sendYTVideo(event.sender.id, message);
              
            });
        }

        else if (event.message.quick_reply.payload === "WORLD") {
            const res = youtube.search.list({
            part: 'snippet',
            channelId: 'UCHziILhb2V5ahNIMSmaOAbQ',
            maxResults: '50',
            //order: 'date',
            q: 'world'
            }, function (err, data) {
              if (err) {
                console.error('Error: ' + err);
              }
              if (data) {
                console.log(data.data);
                var a=[];
                for(var j in data.data.items) {
                  a[j]=j;
                }
                a = shuffle(a);
                for(var i in data.data.items) {
                  console.log('totoooooo');
                  console.log(i==0);
                  var title = data.data["items"][a[i]]["snippet"]["title"];
                  var description = data.data["items"][a[i]]["snippet"]["description"];
                  var thumb = data.data["items"][a[i]]["snippet"]["thumbnails"]["high"]["url"];
                  var url = data.data["items"][a[i]]["id"]["videoId"];
                  console.log(thumb);
                  console.log(url);
                  var message = {
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
                          },{
                          "type":"postback",
                          "title":"Browse more",
                          "payload":"MORE"
                          }
                          ]
                        };
                  if (i == 0) {
                    var elements = [];
                    elements.push(message);
                    console.log(elements);
                  }
                  else if (i <= 4){
                    elements.push(message);
                    console.log(elements);
                  }
                  //msg = Object.assign(msg, message);
                }
                var message = {
                    "attachment": {
                      "type": "template",
                      "payload": {
                        "template_type": "generic",
                        "elements": elements
                    }
                }}};
                console.log(elements);
                sendYTVideo(event.sender.id, message);
              
            });
        }

        else if (event.message.quick_reply.payload === "ELECTRO") {
            const res = youtube.search.list({
            part: 'snippet',
            channelId: 'UCHziILhb2V5ahNIMSmaOAbQ',
            maxResults: '50',
            //order: 'date',
            q: 'electro'
            }, function (err, data) {
              if (err) {
                console.error('Error: ' + err);
              }
              if (data) {
                console.log(data.data);
                var a=[];
                for(var j in data.data.items) {
                  a[j]=j;
                }
                a = shuffle(a);
                for(var i in data.data.items) {
                  console.log('totoooooo');
                  console.log(i==0);
                  var title = data.data["items"][a[i]]["snippet"]["title"];
                  var description = data.data["items"][a[i]]["snippet"]["description"];
                  var thumb = data.data["items"][a[i]]["snippet"]["thumbnails"]["high"]["url"];
                  var url = data.data["items"][a[i]]["id"]["videoId"];
                  console.log(thumb);
                  console.log(url);
                  var message = {
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
                          },{
                          "type":"postback",
                          "title":"Browse more",
                          "payload":"MORE"
                          }
                          ]
                        };
                  if (i == 0) {
                    var elements = [];
                    elements.push(message);
                    console.log(elements);
                  }
                  else if (i <= 4){
                    elements.push(message);
                    console.log(elements);
                  }
                  //msg = Object.assign(msg, message);
                }
                var message = {
                    "attachment": {
                      "type": "template",
                      "payload": {
                        "template_type": "generic",
                        "elements": elements
                    }
                }}};
                console.log(elements);
                sendYTVideo(event.sender.id, message);
              
            });
        }

        else if (event.message.quick_reply.payload === "NEW") {
            const res = youtube.search.list({
            part: 'snippet',
            channelId: 'UCHziILhb2V5ahNIMSmaOAbQ',
            maxResults: '50',
            order: 'date',
            //q: 'electro'
            }, function (err, data) {
              if (err) {
                console.error('Error: ' + err);
              }
              if (data) {
                console.log(data.data);
                var a=[];
                for(var j in data.data.items) {
                  a[j]=j;
                }
                a = shuffle(a);
                for(var i in data.data.items) {
                  console.log('totoooooo');
                  console.log(i==0);
                  var title = data.data["items"][a[i]]["snippet"]["title"];
                  var description = data.data["items"][a[i]]["snippet"]["description"];
                  var thumb = data.data["items"][a[i]]["snippet"]["thumbnails"]["high"]["url"];
                  var url = data.data["items"][a[i]]["id"]["videoId"];
                  console.log(thumb);
                  console.log(url);
                  var message = {
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
                          },{
                          "type":"postback",
                          "title":"Browse more",
                          "payload":"MORE"
                          }
                          ]
                        };
                  if (i == 0) {
                    var elements = [];
                    elements.push(message);
                    console.log(elements);
                  }
                  else if (i <= 4){
                    elements.push(message);
                    console.log(elements);
                  }
                  //msg = Object.assign(msg, message);
                }
                var message = {
                    "attachment": {
                      "type": "template",
                      "payload": {
                        "template_type": "generic",
                        "elements": elements
                    }   
                }}}; 
                console.log(elements);
                sendYTVideo(event.sender.id, message);
               
            });
        }

        else if (event.message.quick_reply.payload === "MORE") {
          //freeze(3000);
          handleStartYesPostback(event.sender.id);
        }
        }
        else if (event.postback){
        console.log(event.postback);
        if (event.postback && event.postback.payload === "GREETING") {
          handleGreetingPostback(event.sender.id);
        }
        else if (event.postback.payload === "MORE") {
          //freeze(3000);
          handleStartYesPostback(event.sender.id);
        }
      };
    });
    res.status(200).end();
  });
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
      greeting = "What are you interested in listening to?";
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

function freeze(time) {
    const stop = new Date().getTime() + time;
    while(new Date().getTime() < stop);       
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
  };

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

