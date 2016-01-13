angular.module('MercedWorks').factory(
    'instagramFactory', [
        function() {
            debugger;
            var clientId = '4265370676f743eabb781e15f2228ed5';
            var redirectToInstagram = function () {
                var uri = 'https://api.instagram.com/oauth/authorize/?client_id=' + clientId +
                    '&redirect_uri=' + redirectUri + '&response_type=code';
                window.location.replace(uri);
            };

            return {
                buttonPressed: redirectToInstagram
            };
        }
    ]
);