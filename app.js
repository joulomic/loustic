const 
  express = require('express'),
  bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
let app = express();
app.use(bodyParser.urlencoded({"extended": false}));
app.use(bodyParser.json());
app.listen((process.env.PORT || 5000));

// Server index page
app.get("/", function (req, res) {
  res.send("Deployed!");
});

// Facebook Webhook
// Used for verification
app.get("/webhook", function (req, res) {
  if (req.query["hub.verify_token"] === process.env.VERIFICATION_TOKEN) {
    console.log("Verified webhook");
    res.status(200).send(req.query["hub.challenge"]);
  } else {
    console.log("Verification failed. The tokens do not match.");
    console.error("Verification failed. The tokens do not match.");
    res.sendStatus(403);
  }
});

// All callbacks for Messenger will be POST-ed here
//app.post("/webhook", jsonParser, function (req, res) {
  // Make sure this is a page subscription
//  if (req.body.object == "page") {
    // Iterate over each entry
    // There may be multiple entries if batched
//    console.log(req.body.entry);
//    req.body.entry.forEach(function(entry) {
      // Iterate over each messaging event
//      entry.messaging.forEach(function(event) {
//        if (event.postback) {
//          processPostback(event);
//        }
//      });
//    });
//
//    res.sendStatus(200);
//  }
//});

// Creates the endpoint for our webhook 
app.post('/webhook', function (req, res) {  
 
  var data = req.body;

  // Checks this is an event from a page subscription
  if (data.object === 'page') {

    // Iterates over each entry - there may be multiple if batched
    data.entry.forEach(function(entry) {

      // Gets the message. entry.messaging is an array, but 
      // will only ever contain one message, so we get index 0
      entry.messaging.forEach(function(event) { 
        if (event.message) {
          console.log("trace:");
          console.log(event);
          processPostback(event);
        }
      })
    });

    // Returns a '200 OK' response to all requests
    res.status(200).send('EVENT_RECEIVED');
  } else {
    // Returns a '404 Not Found' if event is not from a page subscription
    res.sendStatus(404);
  }

});

function processPostback(event) {
  var senderId = event.sender.id;
/*  var payload = event.postback.payload;

  if (payload && payload === "Greeting") {
    // Get user's first name from the User Profile API
    // and include it in the greeting
    request({
      url: "https://graph.facebook.com/v2.6/" + senderId,
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
        name = bodyObj.first_name;
        greeting = "Hi " + name + ". ";
      }
      var message = greeting + "My name is Loustic. Send 'Music' whenever you want to check out our latest videos";
      sendMessage(senderId, {text: message});
//      sendVideo(senderId);
    });
  }
*/
  //     else if (event.message && event.message.text) {
            var text = event.message.text;
            if (text === 'Music') {
                sendMessage(senderId, "toto");
                //continue
            }
  //      }
}

// sends message to user
function sendMessage(recipientId, message) {
  request({
    url: "https://graph.facebook.com/v2.6/me/messages",
    qs: {access_token: process.env.PAGE_ACCESS_TOKEN},
    method: "POST",
    json: {
      recipient: {id: recipientId},
      message: message
          }
  }, function(error, response, body) {
    if (error) {
      console.log("Error sending message: " + response.error);
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
                        "type": "video",
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

