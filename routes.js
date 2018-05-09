
var cors = require('cors');
var request = require('request')
var Promise = require('promise')

//return the auth token
function authen(app, req, cb) {
    link = encodeURI("http://localhost:3000")
    code = req.query.code
   
    tmp = clientID + ":" + clientSecret
    tmp = Buffer.from(tmp).toString('base64')
    app.post(
        spotifyAUTH = "https://accounts.spotify.com/api/token",
        {
            form: {
                'grant_type': "authorization_code",
                'code': code,
                'redirect_uri': link
            },
            headers: {
                'Authorization': 'Basic ' + tmp,
                'Content-type': 'application/x-www-form-urlencoded',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true
            }
        },
        function (error, response, body) {
            if (!error && response.statusCode == 200) {
                token = JSON.parse(body).access_token
                cb(token)
            }
            else {
                cb(error)
            }
        }
    );
}

//parsing reddit 
function parsingURL(app, para, url) {
    if (para["after"] != null) {
        url = url + "&after=" + para["after"]
        console.log(url)
    }
    var tmp = new Promise(
        function (resolve, reject) {
            app.get(url,
                function (err, response, body) {
                    if (err) return reject(err)
                    try {
                        resolve(body)
                    } catch (err) {
                        reject(err)
                    }
                })
        }
    )
    return tmp
}

//return spotify playlist
function getPlaylistObj(app, UID, PID, token) {
    var tmpURL = "https://api.spotify.com/v1/users/" + UID + "/playlists/" + PID;
    //console.log(tmpURL)
    var tmp = new Promise(
        function (resolve, reject) {
            app.get(
                tmpURL,
                {
                    headers: {
                        'Authorization': 'Bearer ' + token,
                    }
                },
                function (err, response, body) {
                    console.log(err)
                    console.log(body)
                    if (err) return reject(err)
                    try {
                        if (response.statusCode == 200) resolve(body)
                        else reject(err)
                    } catch (err) {
                        reject(err)
                    }
                })
        }
    )
    return tmp
}



//getting user permit
function getUserPermit(app) {
   
    redirectLink = ""
    var query = "http://127.0.0.1:5500/index.html"
    query = encodeURI(query);
    url = "https://accounts.spotify.com/authorize/?client_id=" + clientID + "&response_type=code&redirect_uri=" + query
    var tmp = new Promise(
        function (resolve, reject) {
            app.get(
                url,
                function (err, response, body) {
                    if (err) return reject(err)
                    try {
                        if (response.statusCode == 200) resolve(body)
                        else reject(body)
                    } catch (err) {
                        reject(err)
                    }
                })
        }
    )
    return tmp
}

// play
function playMusic(app, accessToken, playlistUrl) {
    spotifyPlay = "https://api.spotify.com/v1/me/player/play"
    console
    bodyObj = { "context_uri": playlistUrl }
    var tmp = new Promise(
        function (resolve, reject) {
            app.put(
                {
                    url: spotifyPlay,
                    headers: {
                        'Authorization': 'Bearer ' + accessToken
                    },
                    body: JSON.stringify(bodyObj),
                    method: "PUT"
                },
                function (err, response, body) {
                    if (err) return reject(err)
                    try {
                        if (response.statusCode == 204) resolve(body)
                        else reject(err)
                    } catch (err) {
                        reject(err)
                    }
                }
            )
        }
    )
    return tmp
}

//get player info
function getPlayerInfo(app, accessToken) {
    spotifyPlayerInfo = "https://api.spotify.com/v1/me/player"
    var tmp = new Promise(function (resolve, reject) {
        app.get(
            {
                url: spotifyPlayerInfo,
                headers: {
                    'Authorization': 'Bearer ' + accessToken
                }
            },
            function(err,response,body) {
                console.log(body)
                if (err) reject(err)
                try {
                    if (response.statusCode == 200) resolve(body)
                    else reject(err)
                } catch (err) {
                    reject(err)
                }
            }
        )
    })
    return tmp
}

// pause 
function pauseMusic(app, accessToken) {
    spotifyPlay = "https://api.spotify.com/v1/me/player/pause"
    var tmp = new Promise(
        function (resolve, reject) {
            app.put(
                {
                    url: spotifyPlay,
                    headers: {
                        'Authorization': 'Bearer ' + accessToken
                    },
                    method: "PUT"
                },
                function (err, response, body) {
                    if (err) return reject(err)
                    try {
                        if (response.statusCode == 202) resolve(body)
                        else reject(err)
                    } catch (err) {
                        reject(err)
                    }
                }
            )
        }
    )
    return tmp
}




module.exports = {
    authen: authen,
    parsingURL: parsingURL,
    getPlaylistObj: getPlaylistObj,
    getUserPermit: getUserPermit,
    playMusic: playMusic,
    pauseMusic: pauseMusic,
    getPlayerInfo: getPlayerInfo
}
