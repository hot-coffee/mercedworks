angular.module('MercedWorks').factory(
    'profileFactory', [
        '$http',
        function($http){
            return {
                profiles:null,

                getProfiles: function(callback) {
                    if (this.profiles) {
                        console.log('profiles already fetched');
                        callback(null);
                        return;
                    }

                    $http.get('api/all-profiles')
                        .success(function(data) {
                            console.log('profiles fetched');
                            this.profiles = data.payload;
                            callback(null);
                        }.bind(this))
                        .error(function(error) {
                            console.log('Error retrieving profile info', 'error:', error);
                            callback(error);
                        });
                },

                profileForId: function (profileId) {
                    if (!this.profiles) {
                        return null;
                    }

                    for (var i=0; i < this.profiles.length; i++) {
                        var profile = this.profiles[i];
                        if (profileId === profile._id) {
                            console.log('found profile', profileId);
                            return profile;
                        }
                    }

                    return null;
                }
            };
        }
    ]
);
