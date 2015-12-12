var express = require('express');
var router = express.Router();

router.get('/got-token', function(req, res, next) {
    res.render('got-token', { title: 'Got Token' });
});

module.exports = router;
