const {
    ipcRenderer
} = require('electron')

let $ = require('jquery')
$(document).ready(function () {
    nombre();
});

function nombre(){
    var obj = ipcRenderer.send('nombre');
    console.log(obj)
    $("#datos").text(obj.display_name);
}