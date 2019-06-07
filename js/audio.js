const {
	ipcRenderer
} = require('electron')

let $ = require('jquery')
$(document).ready(function () {
	load();
});

function load() {
	ipcRenderer.on('datosAudio', (event, arg) => {
		$("#dance").text(`${(arg.danceability * 100).toString().substring(0,5)}%`);
		$("#energy").text(`${(arg.energy * 100).toString().substring(0,5)}%`);
		$("#tempo").text(`${arg.tempo}`);
		$("#note").text(`${arg.loudness} dB`);
	});
	ipcRenderer.send('songData');
}