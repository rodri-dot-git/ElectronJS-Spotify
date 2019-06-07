const {
	ipcRenderer
} = require('electron')

let $ = require('jquery')
$(document).ready(function () {
	load();
	$("#logout").click(function () {
		logout();
	});
});

function load() {
	ipcRenderer.on('nombreR', (event, arg) => {
		$("#datos").text(arg.display_name);
		$("#profile").attr("src", arg.images[0].url);
	});
	ipcRenderer.on('playlists', (event, arg) => {
		for (var i = 0; i < arg.length; i++) {
			$("#playlists").append(
				'<div class="col-12 col-md-6 col-lg-3">' +
				`<input type="image" onclick="showPlaylist('${arg[i].id}');" src='${arg[i].images[0].url}' class="img rounded" style="width: 300px">` +
				'<br>' +
				'<h5 style="text-align: center">' + arg[i].name + '</h5>' +
				'</div>'
			)
		}
	});
	ipcRenderer.on('popular', (event, arg) => {
		for (var i = 0; i < arg.length; i++) {
			$("#popular").append(
				'<div class="col-12 col-md-6 col-lg-3">' +
				`<input type="image" onclick="showPlaylist('${arg[i].id}');" src='${arg[i].images[0].url}' class="img rounded" style="width: 300px">` +
				'<br>' +
				'<h5 style="text-align: center">' + arg[i].name + '</h5>' +
				'</div>'
			)
		}
	});
	ipcRenderer.on('new', (event, arg) => {
		for (var i = 0; i < arg.length; i++) {
			$("#album").append(
				'<div class="col-12 col-md-6 col-lg-3">' +
				`<img src='${arg[i].images[1].url}' class="img rounded" style="width=300px">` +
				'<br>' +
				'<h5 style="text-align: center">' + arg[i].name + '</h5>' +
				'</div>'
			)
		}
	});
	ipcRenderer.on('topTracks', (event, arg) => {
		for (var i = 0; i < arg.length; i++) {
			$("#toptracks").append(
				'<div class="col-12 col-md-6 col-lg-3">' +
				`<img src='${arg[i].album.images[1].url}' class="img rounded" style="width=300px">` +
				'<br>' +
				'<h5 style="text-align: center">' + arg[i].name + '</h5>' +
				'</div>'
			)
		}
	});
	ipcRenderer.on('recent', (event, arg) => {
		for (var i = 0; i < arg.length; i++) {
			$("#recent").append(
				'<div class="col-12 col-md-6 col-lg-3">' +
				`<img src='${arg[i].track.album.images[1].url}' class="img rounded" style="width=300px">` +
				'<br>' +
				'<h5 style="text-align: center">' + arg[i].track.name + '</h5>' +
				'</div>'
			)
		}
	});
	ipcRenderer.on('topArtists', (event, arg) => {
		for (var i = 0; i < arg.length; i++) {
			$("#topartists").append(
				'<div class="col-12 col-md-6 col-lg-3">' +
				`<img src='${arg[i].images[1].url}' class="img rounded" style="width: 300px; height: 300px;">` +
				'<br>' +
				'<h5 style="text-align: center">' + arg[i].name + '</h5>' +
				'</div>'
			)
		}
	});
	ipcRenderer.send('nombre');
}

function logout() {
	ipcRenderer.send('clear');
}