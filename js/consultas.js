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
    });
    ipcRenderer.send('nombre');
}