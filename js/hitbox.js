var hitbox = {
	requestUrl: 'http://api.hitbox.tv/media',
	notified: false,
	check: function check(alarm) {
		var hitbox = this.hitbox;
		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function onReady() {
			if (xhr.readyState == 4) {
				var json = JSON.parse(xhr.responseText);
				var liveChannels = json.livestream;
				for (var i in liveChannels) {
					var channel = liveChannels[i];
					var user = channel['media_user_name'];
					if (user === HITBOX_USERNAME) {
						// stream is online
						chrome.browserAction.setIcon({
							path: 'img/newLEGACYinc_38_online.png'
						});
						if (!hitbox.notified) {
							hitbox.serveNotification(channel);
							hitbox.notified = true;
						}
					}
				}

				// stream is offline
				hitbox.notified = false;
				chrome.browserAction.setIcon({
					path: 'img/newLEGACYinc_38.png'
				});
				chrome.notifications.clear(HITBOX_NOTIFICATION_ID, function() {});
			}
		}
		xhr.open('GET', this.hitbox.requestUrl, true);
		xhr.send();
	},
	serveNotification: function serveNotification(channel) {
		var opt = {
			type: "basic",
			title: "newLEGACYinc",
			message: "Live on hitbox.tv!",
			contextMessage: "Playing: " + channel['category_name'],
			iconUrl: "img/newLEGACYinc.png",
		};

		chrome.notifications.create(HITBOX_NOTIFICATION_ID, opt, function onCreate() {});

		chrome.notifications.onClicked.addListener(function(id) {
			if (id == HITBOX_NOTIFICATION_ID) {
				chrome.notifications.clear(HITBOX_NOTIFICATION_ID, function onClear() {
					chrome.tabs.create({
						'url': HITBOX_URL
					});
				});
			}
		});
	},
	listener: function listener(alarm) {
		var check = this.hitbox.check;
		if (alarm.name !== 'hitbox')
			return;
		chrome.storage.sync.get('hitbox_notify', function got(data) {
			var notify = data.hitbox_notify;
			if (notify) {
				check(alarm);
			}
		});
	}
}