var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var morganLogger = require('morgan');
var logger = require('gruew-logger');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cors = require('cors');
var debug = require('debug')('mercedworks:server');
var RequestHandler = require('./routes/request-handler');
var config = require('./utils/config');



function App() {
    this.run = function () {
        if (process.argv.length > 2 && process.argv[2] === 'fetchmedia') {
            const InstagramController = require('./controllers/instagram-controller');
            var igController = new InstagramController();
            igController.fetchRecentMedia(function (error, media) {
                if (error) {
                    logger.log(['Failed to fetch media with error:', error], __filename, true);
                    return;
                }

                logger.log(['Got media:', media], __filename, false);
            });
        } else if (process.argv.length > 2 && process.argv[2] === 'hash') {
            const firstName = 'melissa';
            const lastName = 'eisner';
            console.log(firstName, lastName);
            const md5Hasher = require('./utils/md5-hasher');
            console.log(md5Hasher.hashName(firstName, lastName));
        } else if (process.argv.length > 2 && process.argv[2] === 'createusers') {
            const userCreator = require('./utils/user-creator');
            userCreator();
        } else if (process.argv.length > 2 && process.argv[2] === 'mediafetch') {
            var instagramFetchController = require('./controllers/instagram-fetch-controller');
            jsonFile = require('jsonfile');

            params = jsonFile.readFileSync(config.filePaths.instagramParamsPath);
            instagramFetchController(params.code);
        } else {
            this.startServer();
        }
    };

    this.startServer = function() {
        var app = express();

        // view engine setup
        app.set('views', path.join(__dirname, 'views'));
        app.set('view engine', 'jade');

        // uncomment after placing your favicon in /public
        //app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
        app.use(morganLogger('dev'));
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended: false }));
        app.use(cookieParser());
        app.use(express.static('public'));
        app.use(cors());

        // catch 404 and forward to error handler
        //app.use(function(req, res, next) {
        //    var err = new Error('Not Found');
        //    err.status = 404;
        //    next(err);
        //});

        // error handlers

        // development error handler
        // will print stacktrace
        if (app.get('env') === 'development') {
            app.use(function(err, req, res, next) {
                res.status(err.status || 500);
                res.render('error', {
                    message: err.message,
                    error: err
                });
            });
        }

        // production error handler
        // no stacktraces leaked to user
        app.use(function(err, req, res, next) {
            res.status(err.status || 500);
            res.render('error', {
                message: err.message,
                error: {}
            });
        });

        var requestHandler = new RequestHandler();

        // gets
        app.get('/', requestHandler.index.bind(requestHandler));
        app.get('/partials/:name', requestHandler.partials.bind(requestHandler));
        app.get('/got-instagram-token', requestHandler.index.bind(requestHandler));
        app.get('/api/all-profiles', requestHandler.allProfiles.bind(requestHandler));
        app.get('/api/instagram-redirect-url', requestHandler.instagramRedirectUrl.bind(requestHandler));
        app.get('/fetch-instagram-media', requestHandler.fetchInstagramMedia.bind(requestHandler));
        app.get('/api/profiles', requestHandler.profiles.bind(requestHandler));

        // posts
        app.post('/api/save-email', requestHandler.saveEmail.bind(requestHandler));

        var port = config.port;
        var server = app.listen(port, function () {
            logger.log(
                ['mercedworks server running on port:', port],
                __filename,
                false
            );
        });

        server.on('error', this.onError);
    };

    this.onError = function(error) {
        if (error.syscall !== 'listen') {
            throw error;
        }

        var bind = typeof config.port === 'string'
            ? 'Pipe ' + config.port
            : 'Port ' + config.port;

        // handle specific listen errors with friendly messages
        switch (error.code) {
            case 'EACCES':
                console.error(bind + ' requires elevated privileges');
                process.exit(1);
                break;
            case 'EADDRINUSE':
                console.error(bind + ' is already in use');
                process.exit(1);
                break;
            default:
                throw error;
        }
    };
}

module.exports = App;
