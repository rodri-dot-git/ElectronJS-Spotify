const {
    ipcRenderer
} = require('electron')
const io = require('socket.io-client')
let $ = require('jquery')
$(document).ready(function () {
    $("#login").click(function () {
        login();
    });
    $("#logout").click(function () {
        logout();
    });
    $("#auth").click(function () {
        auth();
    });
    $("#Load").hide();
});
$(function () {
    const socket = io('http://warm-lowlands-59615.herokuapp.com');
    socket.emit('conn');
    socket.on('TokenArrived', (data) => {
        console.log('token arrived', data);
        auth();
    });
    socket.on('test', (data) => {
        console.log(data);
    });
});

function login() {
    require("electron").shell.openExternal('http://warm-lowlands-59615.herokuapp.com/login');
    $("#Load").hide();
    $("#sLogin").hide();
}

function auth() {
    ipcRenderer.send('access');
}

function logout() {
    ipcRenderer.send('clear');
}