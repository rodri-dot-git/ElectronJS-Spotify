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
        event.reply('nombreP', data.body)
    })
    .catch((error) => {
        console.log(error);
    })
});

ipcMain.on('nombre', (event, arg) => {
    event.reply('nombreR', user);
    spotifyApi.getUserPlaylists().then((data) => {
            event.reply('playlists', data.body.items);
        })
        .catch((error) => {
            console.log(error);
        });
    spotifyApi.getFeaturedPlaylists({
            limit: 10,
            offset: 0,
            country: 'MX',
            timestamp: Date.now
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
});

let win
var dimensions
app.on('ready', () => {
    var screenElectron = electron.screen;
    var mainScreen = screenElectron.getPrimaryDisplay();
    dimensions = mainScreen.size;
    win = new BrowserWindow({
        width: dimensions.width,
        height: dimensions.height,
        frame: true,
        titleBarStyle: 'hidden',
        webPreferences: {
            nodeIntegration: true
        }
    })
    token = storage.getItem('access_token');
    if (token !== '') {
        setAccessToken();
        win.maximize();
    } else {
        createWindow()
        win.maximize();
    }
});