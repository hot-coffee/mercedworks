angular.module('MercedWorks').factory(
    'saveEmailFactory', [
        '$http',
        function($http){
            return {
                saveEmail: function(email) {
                    var postData = JSON.stringify({
                        email: email
                    });

                    $http.post('api/save-email', postData)
                        .success(function(data) {
                            console.log('saved email successfully');
                        })
                        .error(function(error) {
                            console.log('Error saving email', 'error:', error);
                        });
                }
            };
        }
    ]
);