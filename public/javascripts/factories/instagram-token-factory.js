angular.module('MercedWorks').factory(
    'instagramTokenFactory', [
        '$http',
        function($http) {
            console.log('in instagram token factory');
            this.tokenText = 'Getting the Token';
            this.uriKey = 'code';
            this.instagramKey = null;

            this.getCode = function () {
                var currentUri = window.location.search;
                if (!currentUri) {
                    console.log('No uri to find the key in...shucks');
                    return;
                }

                var codeIndex = currentUri.indexOf(this.uriKey);
                if (codeIndex === -1) {
                    console.log(this.uriKey, 'not in the current uri:', currentUri);
                    return;
                }

                var start = codeIndex + this.uriKey.length + 1;
                this.instagramKey = currentUri.substring(start, currentUri.length);
                console.log('the key is', this.instagramKey, "let's write it!!");
                this.saveCode();
            };

            this.saveCode = function () {
                if (!this.instagramKey || this.instagramKey === '') {
                    console.log('There is no key to save!!! Going to quit now');
                    return;
                }

                var payload = {
                    key: this.instagramKey,
                    redirectUri: 'http://localhost:3333/got-token'
                };

                var self = this;
                $.ajax({
                    url: '/save-token',
                    type: 'post',
                    contentType: 'application/json; charset=utf-8',
                    dataType: 'json',
                    data: JSON.stringify(payload),
                    success: self.handleSuccessfulResponse.bind(self),
                    error: self.handleFailedResponse.bind(self)
                });
            };

            this.handleSuccessfulResponse = function (response) {
                if (response.error) {
                    this.showError(response.error);
                    return;
                }

                console.log('Successfully got a response:', response.payload);
                this.showSuccess();
            };

            this.handleFailedResponse = function (payload) {
                this.showError(payload.toString());
            };

            this.showError = function (errorMessage) {
                this.$tokenText.text('Failed to get the token. Here is the Error: ' + str(errorMessage));
            };

            this.showSuccess = function () {
                this.$tokenText.text('Got the Token!!!');
            };
        }
    ]
);