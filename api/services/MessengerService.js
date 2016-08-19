const request = require('request');
const PAGE_ACCESS_TOKEN  = sails.config.messenger['pageAccessToken'];
 
 
module.exports = {
	callSendAPI: callSendAPI,
	callSettingAPI: callSettingAPI
};


/*
 * Call the Send API. The message data goes in the body. If successful, we'll
 * get the message id in a response
 *
 */
function callSendAPI(messageData) {
  request({
    uri: 'https://graph.facebook.com/v2.6/me/messages',
    qs: { access_token: PAGE_ACCESS_TOKEN },
    method: 'POST',
    json: messageData

  }, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var recipientId = body.recipient_id;
      var messageId = body.message_id;

      if (messageId) {
        console.log("Successfully sent message with id %s to recipient %s",
          messageId, recipientId);
      } else {
      console.log("Successfully called Send API for recipient %s",
        recipientId);
      }
    } else {
      console.log(response.error);
    }
  });
}

function callSettingAPI(settingData) {
  request({
    uri: 'https://graph.facebook.com/v2.6/me/thread_settings',
    qs: { access_token: PAGE_ACCESS_TOKEN },
    method: 'POST',
    json: settingData

  }, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      console.log(settingData);
      console.log('setting success');
    } else {
      console.log(response.error);
    }
  });
}
