var twitch = {
	requestUrl: 'https://api.twitch.tv/kraken/streams/' + TWITCH_USER_ID,

	/*
	 * False if user has not been notified that newLEGACYinc is online.
	 * This is stored as a local variable, so its status will not persist between browser sessions.
	 */
	notified: false,

	/**
	 * This function is called every time an alarm goes off
	 * @param {Object} alarm The alarm that went off
	 */
	listener: function listener(alarm) {
		var twitch = this.twitch;
		if (alarm.name !== "twitch")
			return;
		chrome.storage.sync.get('twitch_notify', function got(data) {
			var notify = data.twitch_notify;
			if (notify) {
				twitch.check(alarm);
			}
		});
	},

	check: function check(alarm) {
		var twitch = this;
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
					if (!twitch.notified) {
						twitch.serveNotification(json.stream);
						twitch.notified = true;
					}
				} else {
					// stream is not online
					twitch.notified = false;
					chrome.browserAction.setIcon({
						path: 'img/newLEGACYinc_38.png'
					});
					chrome.notifications.clear(TWITCH_NOTIFICATION_ID, function() {});
				}
			};
		};
		xhr.open("GET", twitch.requestUrl, true);
		xhr.setRequestHeader('Client-ID', TWITCH_CLIENT_ID);
		xhr.setRequestHeader('Accept', 'application/vnd.twitchtv.v5+json');
		xhr.send();
	},

	/**
	 * Displays the stream online Twitch.tv notification
	 * @param {Object} stream
	 */
	serveNotification: function notify(stream) {
		var opt = {
			type: "basic",
			title: "newLEGACYinc",
			message: "Live on Twitch!",
			contextMessage: "Playing: " + stream.game,
			iconUrl: "img/twitch_notification.png",
		};

		chrome.notifications.create(TWITCH_NOTIFICATION_ID, opt, function onCreate(id) {});

		chrome.notifications.onClicked.addListener(function listener(id) {
			if (id == TWITCH_NOTIFICATION_ID) {
				chrome.notifications.clear(TWITCH_NOTIFICATION_ID, function() {
					chrome.tabs.create({
						'url': TWITCH_URL
					});
				});
			}
		});
	}
}
