var SpotifyWebApi = require('spotify-web-api-node');

var spotifyApi = new SpotifyWebApi({
    clientId: '010fde68a6df41048c87cc0855a2f5ce',
    clientSecret: '22f72271c1ef4536b281b06e87795299'
});

main();

async function main() {
    await spotifyApi.clientCredentialsGrant().then(
        function (data) {
            console.log('The access token is ' + data.body['access_token']);
            spotifyApi.setAccessToken(data.body['access_token']);
        },
        function (err) {
            console.log('Something went wrong!', err);
        }
    );
}
