var YOUTUBE_USERNAME = "newLEGACYinc";
var youTubeRequestUrl = "http://gdata.youtube.com/feeds/api/users/" + YOUTUBE_USERNAME + "/uploads?alt=json";

function youtubeListener(alarm) {
	if (alarm.name !== "youtube")
		return;
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
				if (!lastNotified)
					return;
				for (var i in entries) {
					var entry = entries[i];
					var published = moment(entry.published.$t).unix();
					if (lastNotified > published) // old video
						break;
					// entry is a new video
					console.log("entry is a new video!");
					newVideos.append(entry);
				}

				chrome.storage.sync.set({
					'youtube_last_notified': moment().unix()
				});
			});
		};
	};
	xhr.open("GET", youTubeRequestUrl, true);
	xhr.send();
}