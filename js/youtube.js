var youtube = {
	requestUrl: 'http://gdata.youtube.com/feeds/api/users/' + YOUTUBE_USERNAME + '/uploads?alt=json',
	listener: function listener(alarm) {
		var youtube = this.youtube;
		if (alarm.name !== 'youtube')
			return;
		chrome.storage.sync.get('youtube_notify', function got(data) {
			var notify = data.youtube_notify;
			if (notify) {
				youtube.check(alarm);
			}
		})
	},
	check: function check(alarm) {
		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function onReadyStateChange() {
			// if YouTube request is ready
			if (xhr.readyState == 4) {
				var json = JSON.parse(xhr.responseText);
				var feed = json.feed;
				var entries = feed.entry;
				chrome.storage.sync.get('youtube_last_notified', function(data) {
					var lastNotified = data.youtube_last_notified;
					var newVideos = [];

					if (lastNotified !== undefined) {
						for (var i in entries) {
							var entry = entries[i];
							var published = moment(entry.published.$t).unix();
							if (lastNotified > published) // old video
								break;
							// entry is a new video
							newVideos.push(entry);
						}
					}

					// set last notified variable
					chrome.storage.sync.set({
						'youtube_last_notified': moment().unix()
					});

					if (newVideos.length > 0) {
						// set message string
						var messageString = 'New video';
						var items = [];
						for (var i in newVideos) {
							var video = newVideos[i];
							items.push({
								'title': video.title.$t,
								'message': video.content.$t
							});
						}
						var notificationOptions = {
							type: 'list',
							title: YOUTUBE_USERNAME,
							message: messageString,
							iconUrl: 'img/youtube_notification.png',
							items: items
						}
						chrome.notifications.create(YOUTUBE_NOTIFICATION_ID, notificationOptions, function onCreate() {	});

						chrome.notifications.onClicked.addListener(function onClicked(id) {
							if (id == YOUTUBE_NOTIFICATION_ID) {
								chrome.notifications.clear(YOUTUBE_NOTIFICATION_ID, function() {
									chrome.tabs.create({
										'url': YOUTUBE_URL
									});
								});
							}
						});
					}
				});
			};
		};
		xhr.open('GET', this.requestUrl, true);
		xhr.send();
	}
}