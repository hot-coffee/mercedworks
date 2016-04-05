'use strict';

const _ = require('underscore');


module.exports = function(profileData) {
    var firstName = _.has(profileData, 'firstName') ? profileData.firstName : null;
    var lastName = _.has(profileData, 'lastName') ? profileData.lastName : null;
    var occupation = _.has(profileData, 'occupation') ? profileData.occupation : null;
    var type = _.has(profileData, 'type') ? profileData.type : null;
    var link = _.has(profileData, 'link') ? profileData.link : null;
    var pic = _.has(profileData, 'pic') ? profileData.pic : null;
    var userPic = _.has(profileData, 'userPic') ? profileData.userPic : null;
    var caption = _.has(profileData, 'caption') ? profileData.caption : null;
    var interviews = _.has(profileData, 'interviews') ? profileData.interviews : null;
    var business = _.has(profileData, 'business') ? profileData.business : null;
    var date = _.has(profileData, 'date') ? profileData.date : null;
    var pics = _.has(profileData, 'pics') ? profileData.pics : null;

    return {
        firstName: firstName,
        lastName: lastName,
        occupation: occupation,
        type: type,
        link: link,
        pic: pic,
        userPic: userPic,
        caption: caption,
        interviews: interviews,
        business: business,
        date: date,
        pics: pics
    };
};
