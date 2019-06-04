const {
    ipcRenderer
} = require('electron')

let $ = require('jquery')
$(document).ready(function () {
    load();
});

function load() {
    ipcRenderer.on('datosAudio', (event, arg) => {
        $("#dance").text(`${(arg.danceability * 100)}%`);
        $("#energy").text(`${(arg.energy * 100)}%`);
        $("#tempo").text(`${arg.tempo}`);
        $("#note").text(`${arg.loudness} dB`);
    });
    ipcRenderer.send('songData');
}