const {
    ipcRenderer
} = require('electron')

let $ = require('jquery')
$(document).ready(function () {
    $("#login").click(function () {
        login();
    });
    $("#auth").click(function () {
        auth();
    });
});

function login(){
    open('http://warm-lowlands-59615.herokuapp.com/login', 'chrome');
}
function auth(){
    ipcRenderer.send('access');
}