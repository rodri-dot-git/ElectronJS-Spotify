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
    $("#Load").hide();
});

function login(){
    // open('http://warm-lowlands-59615.herokuapp.com/login', 'chrome');
    require("electron").shell.openExternal('http://warm-lowlands-59615.herokuapp.com/login');
    $("#Load").show();
    $("#sLogin").hide();
}
function auth(){
    ipcRenderer.send('access');
}