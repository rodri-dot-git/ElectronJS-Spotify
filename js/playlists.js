const {
    ipcRenderer
} = require('electron')

let $ = require('jquery')
$(document).ready(function () {
    load();
});

function load(){
    ipcRenderer.send('playlistLoad');
    ipcRenderer.on('nombreP', (event, arg) => {
        $("#datos").text(arg.name);
        $("#profile").attr("src", arg.images[0].url);
        for (var i = 0; i < arg.tracks.items.length; i++) {
            console.log(arg.tracks.items[i]);
            $("#songs").append(
                `<tr>
                    <td> ${arg.tracks.items[i].track.name} </td>
                    <td> ${arg.tracks.items[i].track.album.name} </td>
                    <td> ${arg.tracks.items[i].track.artists[0].name} </td>
                </tr>`
            )
        }
    });
}