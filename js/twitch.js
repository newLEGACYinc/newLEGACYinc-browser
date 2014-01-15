var twitchRequestUrl = "https://api.twitch.tv/kraken/streams/" + TWITCH_USERNAME + "?client_id=" + TWITCH_CLIENT_ID;

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
	if (alarm.name !== "twitch")
		return;
	chrome.storage.sync.get('twitch_notify', function got(data) {
		var notify = data.twitch_notify;
		if (notify) {
			twitchCheck(alarm);
		}
	});
};

function twitchCheck(alarm) {
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function() {
		// if request is ready
		if (xhr.readyState == 4) {
			var json = JSON.parse(xhr.responseText);
			if (json.stream != null) {
				// stream is online
				chrome.browserAction.setIcon({
					path: 'img/newLEGACYinc_38_online.png'
				});
				if (!notified) {
					serveTwitchNotification(json.stream);
					notified = true;
				}
			} else {
				// stream is not online
				notified = false;
				chrome.browserAction.setIcon({
					path: 'img/newLEGACYinc_38.png'
				});
				chrome.notifications.clear(TWITCH_NOTIFICATION_ID, function() {});
			}
		};
	};
	xhr.open("GET", twitchRequestUrl, true);
	xhr.send();
}

/**
 * Displays the stream online Twitch.tv notification
 * @param {Object} stream
 */
function serveTwitchNotification(stream) {
	console.log("Serving twitch notification");
	var opt = {
		type: "basic",
		title: "newLEGACYinc",
		message: "Live on Twitch!",
		contextMessage: "Playing: " + stream.game,
		iconUrl: "img/twitch_notification.png",
	};

	chrome.notifications.create(TWITCH_NOTIFICATION_ID, opt, function(id) {
		console.log("Successfully created " + TWITCH_NOTIFICATION_ID + " notification");
	});

	chrome.notifications.onClicked.addListener(function(id) {
		if (id == TWITCH_NOTIFICATION_ID) {
			chrome.notifications.clear(TWITCH_NOTIFICATION_ID, function() {
				chrome.tabs.create({
					'url': TWITCH_URL
				});
			});
		}
	});
}