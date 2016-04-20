'use strict';

const _ = require('underscore');


module.exports = function(profileData) {
    const firstName = _.has(profileData, 'firstName') ? profileData.firstName : null;
    const lastName = _.has(profileData, 'lastName') ? profileData.lastName : null;
    const occupation = _.has(profileData, 'occupation') ? profileData.occupation : null;
    const type = _.has(profileData, 'type') ? profileData.type : null;
    const link = _.has(profileData, 'link') ? profileData.link : null;
    const pic = _.has(profileData, 'pic') ? profileData.pic : null;
    const userPic = _.has(profileData, 'userPic') ? profileData.userPic : null;
    const caption = _.has(profileData, 'caption') ? profileData.caption : null;
    const interview = _.has(profileData, 'interview') ? profileData.interview : null;
    const business = _.has(profileData, 'business') ? profileData.business : null;
    const date = _.has(profileData, 'date') ? profileData.date : null;
    const pics = _.has(profileData, 'pics') ? profileData.pics : null;
    const userName = _.has(profileData, 'userName') ? profileData.userName : null;
    const dateCreated = _.has(profileData, 'dateCreated') ? profileData.dateCreated : null;
    const likeCount = _.has(profileData, 'likeCount') ? profileData.likeCount : null;
    
    return {
        firstName: firstName,
        lastName: lastName,
        occupation: occupation,
        type: type,
        link: link,
        pic: pic,
        userPic: userPic,
        caption: caption,
        interview: interview,
        business: business,
        date: date,
        pics: pics,
        userName: userName,
        dateCreated: dateCreated,
        likeCount: likeCount
    };
};
