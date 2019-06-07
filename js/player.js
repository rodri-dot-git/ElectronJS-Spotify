const {
	ipcRenderer
} = require('electron')
let $ = require('jquery')
$(document).ready(function () {
	load();
	$("#logout").click(function () {
		logout();
	});
	$("#btnPP").click(function playOrPause() {
		if ($("#btnPP").text() == "pause") pause();
		else play();
	});
	$("#btnPrevious").click(function previous() {
		ipcRenderer.send('next', false);
		setTimeout(() => {
			load();
		}, 800)
	});
	$("#btnNext").click(function next() {
		ipcRenderer.send('next', true);
		setTimeout(() => {
			load();
		}, 800);
	});
	$("#vol").on('input', function vol() {
		ipcRenderer.send('volume', $(this).val());
	})
});

function load() {
	ipcRenderer.on('playingTrack', (event, arg) => {
		console.log(arg);
		$("#name").text(arg.item.name);
		$("#artist").text(arg.item.album.artists[0].name);
		if (arg.is_playing) $("#btnPP").text("pause");
		else $("#btnPP").text("play_arrow");
		$("#songI").attr("src", arg.item.album.images[0].url);
	});
	ipcRenderer.send('player');
}

function pause() {
	$("#btnPP").text("play_arrow");
	ipcRenderer.send('play', false);
}

function play(){
	$("#btnPP").text("pause");
	ipcRenderer.send('play', true);
}