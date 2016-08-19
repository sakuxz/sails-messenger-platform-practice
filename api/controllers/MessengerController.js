 const config = sails.config.messenger;
 const callSendAPI = MessengerService.callSendAPI;
 const callSettingAPI = MessengerService.callSettingAPI;
 const msAct = require('./MessengerActionController');

 // App Secret can be retrieved from the App Dashboard
 const APP_SECRET = (process.env.MESSENGER_APP_SECRET) ?
   process.env.MESSENGER_APP_SECRET :
   config['appSecret'];

 // Arbitrary value used to validate a webhook
 const VALIDATION_TOKEN = (process.env.MESSENGER_VALIDATION_TOKEN) ?
   (process.env.MESSENGER_VALIDATION_TOKEN) :
   config['validationToken'];

 // Generate a page access token for your page from the App Dashboard
 const PAGE_ACCESS_TOKEN = (process.env.MESSENGER_PAGE_ACCESS_TOKEN) ?
   (process.env.MESSENGER_PAGE_ACCESS_TOKEN) :
   config['pageAccessToken'];

 // URL where the app is running (include protocol). Used to point to scripts and
 // assets located at this address.
 const SERVER_URL = (process.env.SERVER_URL) ?
   (process.env.SERVER_URL) :
   config['serverURL'];

 if (!(APP_SECRET && VALIDATION_TOKEN && PAGE_ACCESS_TOKEN && SERVER_URL)) {
   console.error("Missing config values");
   process.exit(1);
 }


module.exports = {
	webhookGet: async (req, res) => {
		if (req.query['hub.mode'] === 'subscribe' &&
	      req.query['hub.verify_token'] === VALIDATION_TOKEN) {
	    console.log("Validating webhook");
	    res.status(200).send(req.query['hub.challenge']);
	    
	    sails.config.messenger.settings.forEach((e, i) => callSettingAPI(e) );
	  } else {
	    console.error("Failed validation. Make sure the validation tokens match.");
	    res.sendStatus(403);
	  }
	},

	webhookPost: async (req, res) => {
		var data = req.body;

	  // Make sure this is a page subscription
	  if (data.object == 'page') {
	    // Iterate over each entry
	    // There may be multiple if batched
	    data.entry.forEach(function(pageEntry) {
	      var pageID = pageEntry.id;
	      var timeOfEvent = pageEntry.time;
	      // Iterate over each messaging event
	      pageEntry.messaging.forEach(function(messagingEvent) {
	        if (messagingEvent.optin) {
	          msAct.receivedAuthentication(messagingEvent);
	        } else if (messagingEvent.message) {
            console.log(messagingEvent);
	          msAct.receivedMessage(messagingEvent); 
	        } else if (messagingEvent.delivery) {
	          msAct.receivedDeliveryConfirmation(messagingEvent);
	        } else if (messagingEvent.postback) {
	          msAct.receivedPostback(messagingEvent);
	        } else if (messagingEvent.read) {
	          msAct.receivedMessageRead(messagingEvent);
	        } else if (messagingEvent.account_linking) {
	          msAct.receivedAccountLink(messagingEvent);
	        } else {
	          console.log("Webhook received unknown messagingEvent: ", messagingEvent);
	        }
	      });
	    });

	    // Assume all went well.
	    //
	    // You must send back a 200, within 20 seconds, to let us know you've
	    // successfully received the callback. Otherwise, the request will time out.
	    res.ok();
	  }
	},

	authorize: async (req, res) => {
		var accountLinkingToken = req.query['account_linking_token'];
	  var redirectURI = req.query['redirect_uri'];

	  // Authorization Code should be generated per user by the developer. This will
	  // be passed to the Account Linking callback.
	  var authCode = "1234567890";

	  // Redirect users to this URI on successful login
	  var redirectURISuccess = redirectURI + "&authorization_code=" + authCode;

	  res.render('authorize', {
	    accountLinkingToken: accountLinkingToken,
	    redirectURI: redirectURI,
	    redirectURISuccess: redirectURISuccess
	  });
	},
};
