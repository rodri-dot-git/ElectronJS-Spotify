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

Request.post('https://accounts.spotify.com/api/token&grant_type=authorization_code&code=AQCViE9MDRCq6c7t3s9BHE_BY5Mz2OpwRCVejCSPnRhz2VwXK2F0AxeCa6m_PEm1GyLbWZvBS79sl8pK0D_6YosgNrmIgcLjRknZSrIihaajsU5F_YAeTvYrkuoQECCiY_s-FWpeA7Lvh-vIsJyFM7rahjcFNqmcBVN2T0t4K-3uj_gbHtO4EFOxT3U4C_p5BzJbeQBdgX96Tt7ScNXsjTEcru4SqlhdJJ2D96km7gpMttSz8YeMPVG0ads_P30IF4TRZ9hRiITDs1bbTlah0tGoCSoa28Py5PHGuIza6UwV2tL4KccAOuiUNI_ChvkNVVZoKTfJ15rMGi1Wg9wreAIeUdkabAICtBZOMDxD2UXJfK4HazWf&redirect_uri=http%3A%2F%2Fwarm-lowlands-59615.herokuapp.com%2Fcallback', {
    auth: {
        user: '010fde68a6df41048c87cc0855a2f5ce',
        pass: '22f72271c1ef4536b281b06e87795299'
    }
},
function (error, response, body) {
    if (!error && response.statusCode == 200) {
        console.log('body:', body);
    } else {
        console.log('error', error, response && response.statusCode);
    }
});

var token = 'aToken';
function setAccessToken(){
    Request.get("https://warm-lowlands-59615.herokuapp.com/auth", (error, response, body) => {
        if (error) {
            console.dir(error);
        }
        console.log(body);
        const options = {
            responseType: 'string',
            json: true,
            method: 'POST',
            uri: 'https://accounts.spotify.com/api/token',
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic MDEwZmRlNjhhNmRmNDEwNDhjODdjYzA4NTVhMmY1Y2U6MjJmNzIyNzFjMWVmNDUzNmIyODFiMDZlODc3OTUyOTk='
            },
            body: {
                'grant_type': 'authorization_code',
                'code': body,
                'redirect_uri': 'http://warm-lowlands-59615.herokuapp.com/callback'
            }
        }
        RequestP(options).then((data) => {
            //spotifyApi.setAccessToken(data)
            console.log(data);
        })
        .catch((error)=>{
            console.log(error);
        });
    });
    setTimeout(() => {
        getNombre();
        windowConsultas();
    }, 1000);
}
var user;
function getNombre(){
    spotifyApi.getMe()
        .then(function (data) {
            //console.log('Some information about the authenticated user', data.body);
            user = data.body;
            console.log('fin funcion')
        }, function (err) {
            console.log('Something went wrong! Nombre', err);
        });
}
function windowConsultas() {
    win.loadURL(url.format({
        pathname: path.join(__dirname, './views/consultas.html'),
        protocol: 'file:',
        slashes: true
    }))
}

ipcMain.on('nombre', (event, arg) => {
    return user;
})

app.on('ready', createWindow)