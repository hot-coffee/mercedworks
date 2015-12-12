'use strict';

function JsonSender(serverOptions, payload) {
    this.payload = payload;
    this.options = {
        host: serverOptions.host,
        port: serverOptions.port,
        path: serverOptions.path,
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(payload)
        }
    };

    /**
     *
     * @param callback - args error, data
     */
    this.send = function (callback) {
        var req = http.request(this.options, function(res) {
            res.setEncoding('utf8');
            var data = '';
            res.on('data', function (chunk) {
                console.log('Response: ' + chunk);
                data += chunk;
            }.bind(this));
            
            res.on('error', function (error) {
                console.log('Error failed to post data to:', this.options.host);
                callback(error, null);
            }.bind(this));
            
            res.on('finished', function () {
                console.log('Fished fetching data:', data.toString());
                callback(data, null);
            }.bind(this));

            res.on('close', function () {
                console.log('Closed the connection to:', this.options.host);
                callback(null, null);
            }.bind(this));
        });

        // post the data
        req.write(JSON.stringify(this.payload));
        req.end();
    };
}

module.exports = JsonSender;
