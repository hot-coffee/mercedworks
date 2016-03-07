'use strict';

var _ = require('underscore');
var Logger = require('gruew-logger');

module.exports = {
    invalidateInterval: 3600*1000,
    cache: {},

    makeInvalidateDate: function () {
        return new Date(Date.now() + this.invalidateInterval);
    },

    isCacheValid: function (key) {
        if (!this.hasItem(key) || !this.cache[key].date) {
            return false;
        }

        var timeRemaining = this.cache[key].date - Date.now();
        var readableTime = timeRemaining/1000/60;
        if (timeRemaining > 0) {
            Logger.log(
                'Cache valid for: ' + key + ' time remaining: ' + readableTime.toString() + ' mins',
                __filename,
                false,
                false
            );

            return true;
        }

        Logger.log(
            'Cache invalid for: ' + key + ' time invalid: ' + readableTime.toString() + ' mins',
            __filename,
            false,
            false
        );

        this.resetCache(key);
        return false;
    },

    addItem: function (key, value) {
        var invalidDate = this.makeInvalidateDate();
        this.cache[key] = {
            item: value,
            date: invalidDate
        };
    },
    
    removeItem: function (key) {
        if (this.hasItem(key)) {
            delete this.cache.key;
        }
    },

    hasItem: function (key) {
        return _.has(this.cache, key);
    },

    getItem: function (key) {
        if (this.isCacheValid(key) && this.hasItem(key)) {
            Logger.log('Retrieved from cache: ' + key, __filename, false, false);
            return this.cache.key;
        }

        Logger.log('Item not in cache: ' + key, __filename, false, false);
        return null;
    },

    resetCache: function(key) {
        delete this.cache[key];
    }
};
