const {
    app,
    BrowserWindow
} = require('electron')
const url = require('url')
const path = require('path')
const SpotifyWebApi = require('spotify-web-api-node');
const Request = require("request");
const {
    ipcMain
} = require('electron')

ipcMain.on('access', (event, arg) => {
    setAccessToken();
})

var credentials = {
    clientId: '010fde68a6df41048c87cc0855a2f5ce',
    clientSecret: '22f72271c1ef4536b281b06e87795299',
    redirectUri: 'localhost:'
};

var spotifyApi = new SpotifyWebApi(credentials);

let win

function createWindow() {
    win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true
        }
    })
    win.loadURL(url.format({
        pathname: path.join(__dirname, './views/index.html'),
        protocol: 'file:',
        slashes: true
    }))
}
var token;
function setAccessToken(){
    Request.get("https://warm-lowlands-59615.herokuapp.com/auth", (error, response, body) => {
        if (error) {
            return console.dir(error);
        }
        token = body;
    });
    spotifyApi.setAccessToken(token);
    windowConsultas();
}

function windowConsultas() {
    win.loadURL(url.format({
        pathname: path.join(__dirname, './views/consultas.html'),
        protocol: 'file:',
        slashes: true
    }))
}

app.on('ready', createWindow)