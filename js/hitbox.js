var hitboxRequestUrl = "http://api.hitbox.tv/media";
var hitboxNotified = false;

function hitboxListener(alarm) {
	if (alarm.name !== 'hitbox')
		return;
	chrome.storage.sync.get('hitbox_notify', function got(data) {
		var notify = data.hitbox_notify;
		if (notify) {
			hitboxCheck(alarm);
		}
	});
}

function hitboxCheck(alarm) {
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
					if (!hitboxNotified) {
						serveHitboxNotification(channel);
						hitboxNotified = true;
					}
				}
			}

			// stream is offline
			notified = false;
			chrome.browserAction.setIcon({
				path: 'img/newLEGACYinc_38.png'
			});
			chrome.notifications.clear(HITBOX_NOTIFICATION_ID, function() {});
		}
	}
	xhr.open('GET', hitboxRequestUrl, true);
	xhr.send();
}

function serveHitboxNotification(channel) {
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
}