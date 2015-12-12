'use strict';


function InstagramController() {
    this.$button = $("#login-button");
    this.instagramRediredUri = '';
    this.clientId = '4265370676f743eabb781e15f2228ed5';
    this.redirectUri = 'http://localhost:3333/got-token';

    this.init = function () {
        this.$button.on('click', this.buttonPressed.bind(this));
    };

    this.buttonPressed = function (elm) {
        console.log('button pressed');
        this.redirectToInstagram();
    };

    this.redirectToInstagram = function () {
        var uri = 'https://api.instagram.com/oauth/authorize/?client_id=' + this.clientId +
            '&redirect_uri=' + this.redirectUri + '&response_type=code';
        window.location.replace(uri);
    };
}

var ic = new InstagramController();
ic.init();