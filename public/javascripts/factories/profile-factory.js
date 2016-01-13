angular.module('MercedWorks').factory(
    'profileFactory', [
        '$http',
        function($http){
            return {
                profiles:null,

                getProfiles: function(callback) {
                    if (this.profiles) {
                        callback(null);
                        return;
                    }

                    $http.get('/all-profiles')
                        .success(function(data) {
                            this.profiles = data.payload;
                            callback(null);
                        }.bind(this))
                        .error(function(error) {
                            console.log('Error retrieving profile info', 'error:', err);
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
                            return profile;
                        }
                    }

                    return null;
                }
            };
        }
    ]
);
