angular.module('MercedWorks').factory(
    'configFactory',
    function() {
        debugger;
        //var serverUrl = 'http://localhost:3333/';
        var serverUrl = 'http://ec2-54-200-241-144.us-west-2.compute.amazonaws.com/';

        return {
            serverUrl: serverUrl,
            makePath: function(inputPath) {
                return serverUrl + inputPath;
            }
        };
    }
);