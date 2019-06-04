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
    ipcRenderer.on('playlists', (event, arg) => {
        console.log(arg);
        for (var i = 0; i < arg.length; i++) {
            console.log(arg[i].images[0].url);
        $("#playlists").append(
            '<div class="col-12 col-md-6 col-lg-3">' +
				`<img src='${arg[i].images[0].url}' class="img rounded style="width=300px">` +
				'<br>' +
				'<h5 style="text-align: center">' + arg[i].name + '</h5>' +
			'</div>'
        )
        }
    });
    ipcRenderer.on('popular', (event, arg) => {
        console.log(arg);
        for (var i = 0; i < arg.length; i++) {
            console.log(arg[i].images[0].url);
            $("#popular").append(
                '<div class="col-12 col-md-6 col-lg-3">' +
                `<img src='${arg[i].images[0].url}' class="img rounded" style="width=300px">` +
                '<br>' +
                '<h5 style="text-align: center">' + arg[i].name + '</h5>' +
                '</div>'
            )
        }
    });
    ipcRenderer.send('nombre');
}