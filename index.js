var express = require('express');
const request = require('request')
const route = require('./routes')
var querystring = require('querystring');

var app = express();
var redis = require('redis');
var client = redis.createClient(); //creates a new client


//get authen
app.get('/', function (req, res) {
  route.authen(request, req, function (token) {
    link = "http://127.0.0.1:5500/index.html?"
    console.log(token)

    uid = "1000"

    client.set(uid, token);

    //then another request to return to the webpage 
    res.redirect(link +
      querystring.stringify({
        UID: uid
      }));
  })
});

//get permit
app.get('/permit', function (req, res) {
  //console.log(res)
  link = encodeURI("http://localhost:3000")

  var scope = 'user-read-private user-read-email streaming user-modify-playback-state user-read-playback-state';
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: clientID,
      scope: scope,
      redirect_uri: link
    }));
})

app.get('/play', function (req, res) {
  console.log("play music is called =   ", req.url)
  playlistUrl = req.query.playListURL
  UID = req.query.UID
  client.get(UID, function (err, reply) {
    accessToken = reply
    route.playMusic(request, accessToken, playlistUrl).then(function (response) {
      console.log("play")
      res.send("play")
    }).catch(function (err) {
      console.log("from promise" + reply)
      res.send("cant play")
    })
  })
})

// getting player info
app.get('/info', function (req, res) {
  
  UID = req.query.UID
  console.log(UID)
  client.get(UID, function (err, reply) {
    accessToken = reply
    route.getPlayerInfo(request, accessToken).then(function (response) {
      console.log(response + "    ")
      res.status(200);
      res.send(response)
    }).catch(function (err) {
      console.log(err)
      res.status(404);
      res.send(err)
    })
  })
})

// pause player
app.get('/pause', function (req, res) {
  UID = req.query.UID
  client.get(UID, function (err, reply) {
    accessToken = reply
    route.pauseMusic(request, accessToken).then(function (response) {
      console.log("pause")
      res.send("pause")
    }).catch(function (err) {
      console.log(reply)
      res.send("cant pause")
    })
  })
})

//parse url
app.get('/parse', function (req, res) {
  //Get parameter
  startingURL = req.query.url
  //call route
  console.log(startingURL)
  parameter = { "after": req.query.after }
  route.parsingURL(request, parameter, startingURL).then(function (response) {
    tmp = JSON.parse(response);
    res.send(tmp)
  }).catch(function (err) {
    console.log(err)
    res.json(err)
  })
});

//parse spotify playlist
app.get('/spotify', function (req, res) {
  //console.log(req.query)
  //Get parameter
  uid = req.query.uid
  pid = req.query.pid
  frontUid = req.query.frontUID
  client.get(frontUid, function (err, reply) {
    token = reply
    route.getPlaylistObj(request, uid, pid, token).then(function (response) {
      tmp = JSON.parse(response);
      console.log(response)
      res.send(tmp)
    }).catch(function (err) {
      console.log(err)
      res.send(err)
    })
  });
})

//listen 
var server = app.listen(3000, function () {
  console.log('Listening on port %d', server.address().port);
});

//reddis
client.on('connect', function () {
  console.log('reddis database is connected');
});