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
    ipcRenderer.on('nombreS', (event, arg) => {
        $("#datos").text(arg.display_name);
        $("#profile").attr("src", arg.images[0].url);
    });
    ipcRenderer.on('topTSongs', (event, arg) => {
        for (var i = 0; i < arg.length; i++) {
            $("#toptracks").append(
                '<div class="col-12 col-md-6 col-lg-3">' +
                `<input type="image" src='${arg[i].album.images[1].url}' onclick="showSong('${arg[i].id}');" class="img-fluid rounded" style="width=300px">` +
                '<br>' +
                '<h5 style="text-align: center">' + arg[i].name + '</h5>' +
                '</div>'
            )
        }
    });
    ipcRenderer.send('topSongs');
}

function logout() {
    ipcRenderer.send('clear');
}