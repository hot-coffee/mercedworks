angular.module('mercedWorks').factory(
    'instagramFactory',
    function() {
        console.log('in instagram factory');
        var clientId = '4265370676f743eabb781e15f2228ed5';
        var redirectUri = 'http://localhost:3333/got-instagram-token';
        var redirectToInstagram = function () {
            var uri = 'https://api.instagram.com/oauth/authorize/?client_id=' + clientId +
                '&redirect_uri=' + redirectUri + '&response_type=code';
            window.location.replace(uri);
        };

        return {
            buttonPressed: redirectToInstagram
        };
    }
);