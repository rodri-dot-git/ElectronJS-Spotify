const {
    ipcRenderer
} = require('electron')

let $ = require('jquery')
$(document).ready(function () {
    load();
});

function load(){
    ipcRenderer.on('nombreR', (event, arg) => {
        $("#datos").text(arg.display_name);
        $("#profile").attr("src", arg.images[0].url);
    });
    ipcRenderer.on('playlists', (event, arg) => {
        console.log(arg);
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
        console.log(arg);
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
        console.log(arg);
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
    ipcRenderer.send('nombre');
}