var TWITCH_USERNAME = "newLEGACYinc";
//var TWITCH_USERNAME = "TSM_TheOddOne";
var TWITCH_NOTIFICATION_ID = 'twitch';

var twitchRequestUrl = "https://api.twitch.tv/kraken/streams/" + TWITCH_USERNAME + "?client_id=" + TWITCH_CLIENT_ID;
var streamUrl = "http://www.twitch.tv/" + TWITCH_USERNAME;

/*
 * False if user has not been notified that newLEGACYinc is online.
 * This is stored as a local variable, so its status will not persist between browser sessions.
 */
var notified = false;

/**
 * This function is called every time an alarm goes off
 * @param {Object} alarm The alarm that went off
 */
function twitchListener(alarm) {
	console.log("Alarm run");
	if (alarm.name !== "twitch")
		return;
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function() {
		// if request is ready
		if (xhr.readyState == 4) {
			console.log("twitch request response");
			var json = JSON.parse(xhr.responseText);
			console.log(json);
			if (json.stream != null) {
				// stream is online
				if (!notified) {
					serveTwitchNotification(json.stream);
					notified = true;
				}
			} else {
				// stream is not online
				notified = false;
				chrome.notifications.clear(TWITCH_NOTIFICATION_ID, function(){});
			}
		};
	};
	xhr.open("GET", twitchRequestUrl, true);
	xhr.send();
};

/**
 * Displays the stream online Twitch.tv notification
 * @param {Object} stream
 */
function serveTwitchNotification(stream) {
	console.log("Serving twitch notification");
	var opt = {
		type : "basic",
		title : "newLEGACYinc",
		message : "Live on Twitch.tv!",
		contextMessage : "Playing: " + stream.game,
		iconUrl : "img/twitch_notification.png",
	};

	chrome.notifications.create(TWITCH_NOTIFICATION_ID, opt, function(id) {
		console.log("Successfully created " + TWITCH_NOTIFICATION_ID + " notification");
	});

	chrome.notifications.onClicked.addListener(function(id) {
		if (id == TWITCH_NOTIFICATION_ID) {
			chrome.notifications.clear(TWITCH_NOTIFICATION_ID, function() {
				chrome.tabs.create({
					'url' : streamUrl
				});
			});
		}
	});
}
