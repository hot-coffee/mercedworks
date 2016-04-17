module.exports = function($http) {
    var clientId = '4265370676f743eabb781e15f2228ed5';
    var redirectUri;

    $http.get('api/instagram-redirect-url')
        .success(function(data) {
            redirectUri = data.payload.redirectUri;
            console.log('got redirect uri', redirectUri);
        })
        .error(function(error) {
            console.log('error getting redirect uri:', error);
            redirectUri = null;
        });

    var redirectToInstagram = function () {
        var uri = 'https://api.instagram.com/oauth/authorize/?client_id=' + clientId +
            '&redirect_uri=' + redirectUri + '&response_type=code';
        window.location.replace(uri);
    };

    return {
        buttonPressed: redirectToInstagram
    };
};
