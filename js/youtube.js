var YOUTUBE_USERNAME = 'newLEGACYinc';
var YOUTUBE_NOTIFICATION_ID = 'YouTube';
var YOUTUBE_URL = 'http://youtube.com/user/newLEGACYinc/videos';
var youTubeRequestUrl = 'http://gdata.youtube.com/feeds/api/users/' + YOUTUBE_USERNAME + '/uploads?alt=json';

function youtubeListener(alarm) {
	if (alarm.name !== 'youtube')
		return;
	console.log('Running YouTube alarm');
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function onReadyStateChange() {
		// if YouTube request is ready
		if (xhr.readyState == 4) {
			var json = JSON.parse(xhr.responseText);
			var feed = json.feed;
			var entries = feed.entry;
			chrome.storage.sync.get('youtube_last_notified', function(data) {
				var lastNotified = data.youtube_last_notified;
				console.log("lastNotified = " + lastNotified);
				var newVideos = [];

				if (lastNotified !== undefined) {
					for (var i in entries) {
						var entry = entries[i];
						var published = moment(entry.published.$t).unix();
						console.log('published = ' + published);
						if (lastNotified > published) // old video
							break;
						// entry is a new video
						console.log('entry is a new video!');
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
						title: 'newLEGACYinc',
						message: messageString,
						iconUrl: 'img/youtube_notification.png',
						items: items
					}
					chrome.notifications.create(YOUTUBE_NOTIFICATION_ID, notificationOptions, function onCreate() {
						console.log('YouTube notification created');
					});

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
	xhr.open('GET', youTubeRequestUrl, true);
	xhr.send();
}