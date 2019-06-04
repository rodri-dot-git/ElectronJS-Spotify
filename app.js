const {
    app,
    BrowserWindow
} = require('electron')
const url = require('url')
const path = require('path')
const SpotifyWebApi = require('spotify-web-api-node');
const Request = require("request");
const RequestP = require("request-promise");
const {
    ipcMain
} = require('electron');
const electron = require('electron');
const storage = require('electron-localstorage');

const plotly = require('plotly')('rodridlc', 'exfsPaKn3ZoaQBfQB0YK');
function plot(tracks) {
    var ids = [];
    var names = [];
    tracks.items.forEach(song => {
        ids.push(song.track.id);
        names.push(song.track.name)
    });
    spotifyApi.getAudioFeaturesForTracks(ids).then((data) => {
        var x = [];
        var y = [];
        for (let i = 0; i < data.body.audio_features.length; i++) {
            y.push(data.body.audio_features[i].danceability);
            x.push(names[i]);
        }
        var data = [
            {
                x: x,
                y: y,
                type: "bar"
            }
        ];
        var graphOptions = { filename: "basic-bar", fileopt: "overwrite" };
        plotly.plot(data, graphOptions, function (err, msg) {
            console.log(msg);
        })
    })
    .catch((error) => {
        console.log(error);
    })
}

ipcMain.on('access', (event, arg) => {
    setAccessToken();
})

var credentials = {
    clientId: '010fde68a6df41048c87cc0855a2f5ce',
    clientSecret: '22f72271c1ef4536b281b06e87795299',
    redirectUri: 'localhost:'
};

var spotifyApi = new SpotifyWebApi(credentials);

function createWindow() {
    win.loadURL(url.format({
        pathname: path.join(__dirname, './views/index.html'),
        protocol: 'file:',
        slashes: true
    }))
}
var token

function setAccessToken() {
    Request.get("https://warm-lowlands-59615.herokuapp.com/auth", (error, response, body) => {
        if (error) {
            console.dir(error + "error en get");
        }
        const options = {
            method: 'POST',
            json: true,
            uri: 'https://accounts.spotify.com/api/token',
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic MDEwZmRlNjhhNmRmNDEwNDhjODdjYzA4NTVhMmY1Y2U6MjJmNzIyNzFjMWVmNDUzNmIyODFiMDZlODc3OTUyOTk='
            },
            form: {
                grant_type: 'authorization_code',
                code: body,
                redirect_uri: 'http://warm-lowlands-59615.herokuapp.com/callback'
            }
        }
        if (token !== '') {
            spotifyApi.setAccessToken(token);
            setTimeout(() => {
                getNombre();
                windowConsultas();
            }, 500);
        } else {
            RequestP(options).then((data) => {
                    spotifyApi.setAccessToken(data.access_token)
                    spotifyApi.setRefreshToken(data.refresh_token);
                    storage.setItem('access_token', data.access_token);
                    getNombre();
                })
                .catch((error) => {
                    console.log(error + 'en requestP');
                });
            setTimeout(() => {
                windowConsultas();
            }, 500);
        }

    });
}
var user;

function getNombre() {
    spotifyApi.getMe()
        .then(function (data) {
            user = data.body;
        }, function (err) {
            console.log('Something went wrong! Nombre', err);
            storage.clear();
            createWindow();
        });
}

function windowConsultas() {
    win.loadURL(url.format({
        pathname: path.join(__dirname, './views/consultas.html'),
        protocol: 'file:',
        slashes: true
    }))
}

function windowAudio() {
    win.loadURL(url.format({
        pathname: path.join(__dirname, './views/audiofeatures.html'),
        protocol: 'file:',
        slashes: true
    }))
}

function windowPlaylist() {
    win.loadURL(url.format({
        pathname: path.join(__dirname, './views/playlists.html'),
        protocol: 'file:',
        slashes: true
    }))
}
var id;
ipcMain.on('playlistShow', (event, arg) => {
    windowPlaylist();
    id = arg;
});

ipcMain.on('playlistLoad', (event, arg) => {
    spotifyApi.getPlaylist(id).then((data) => {
        event.reply('nombreP', data.body);
        plot(data.body.tracks);
    })
    .catch((error) => {
        console.log(error);
    })
});

ipcMain.on('topSongs', (event, arg) => {
    event.reply('nombreS', user);
    spotifyApi.getMyTopTracks({
            time_range: 'long_term'
        })
        .then((data) => {
                event.reply('topTSongs', data.body.items);
            },
            function (err) {
                console.log("Something went wrong!", err);
            });
});
var ids;
ipcMain.on('songShow', (event, arg) => {
    windowAudio();
    ids=arg;
});

ipcMain.on('songData', (event, arg) => {
    spotifyApi.getAudioFeaturesForTrack(ids).then((data) => {
            event.reply('datosAudio', data.body);
        },
        function (err) {
            console.log("Something went wrong!", err);
        });
});

ipcMain.on('clear', (event, arg) => {
    storage.clear();
});

ipcMain.on('nombre', (event, arg) => {
    var date = new Date();
    date.setHours(date.getHours() - 7);
    event.reply('nombreR', user);
    spotifyApi.getUserPlaylists().then((data) => {
            event.reply('playlists', data.body.items);
        })
        .catch((error) => {
            console.log(error);
        });
    spotifyApi.getFeaturedPlaylists({
            limit: 15,
            offset: 0,
            country: 'MX',
            timestamp: date
        })
        .then(function (data) {
            event.reply('popular', data.body.playlists.items)
        }, function (err) {
            console.log("Something went wrong!", err);
        });
    spotifyApi.getNewReleases({
        limit: 10,
        offset: 0,
        country: 'MX'
    })
    .then(function (data) {
        event.reply('new', data.body.albums.items);
    }, function (err) {
        console.log("Something went wrong!", err);
    });
    spotifyApi.getMyTopTracks({
        time_range: 'long_term'
    })
    .then((data) => {
        event.reply('topTracks', data.body.items);
    },
    function (err) {
        console.log("Something went wrong!", err);
    });
    spotifyApi.getMyTopArtists({
            time_range: 'long_term'
        })
        .then((data) => {
                event.reply('topArtists', data.body.items);
            },
            function (err) {
                console.log("Something went wrong!", err);
            });
});

let win
var dimensions
app.on('ready', () => {
    var screenElectron = electron.screen;
    var mainScreen = screenElectron.getPrimaryDisplay();
    dimensions = mainScreen.size;
    win = new BrowserWindow({
        width: 800,
        height: 600,
        frame: false,
        titleBarStyle: 'hidden',
        webPreferences: {
            nodeIntegration: true
        }
    })
    token = storage.getItem('access_token');
    if (token.length > 2) {
        setAccessToken();
        win.maximize();
    } else {
        createWindow()
        win.maximize();
    }
});