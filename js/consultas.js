const {
    ipcRenderer
} = require('electron')

let $ = require('jquery')
$(document).ready(function () {
    nombre();
});

function nombre(){
    var obj
    ipcRenderer.on('nombreR', (event, arg) => {
        $("#datos").text(arg.display_name);
        $("#profile").attr("src", arg.images[0].url);
    });
    ipcRenderer.send('nombre');
}