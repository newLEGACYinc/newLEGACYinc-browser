var TWITCH_USERNAME = "newLEGACYinc";
//var TWITCH_USERNAME = "TSM_TheOddOne";
var NOTIFICATION_ID = 'twitch';

var requestUrl = "https://api.twitch.tv/kraken/streams/" + TWITCH_USERNAME + "?client_id=" + TWITCH_CLIENT_ID;
var streamUrl = "http://www.twitch.tv/" + TWITCH_USERNAME;
var notified = false;

chrome.alarms.create("twitch_alarm", {
	when : Date.now(),
	periodInMinutes : 1
});

chrome.alarms.onAlarm.addListener(function(alarm) {
	console.log("Alarm run");
	if (alarm.name === "twitch_alarm") {
		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function() {
			// if request is ready
			if (xhr.readyState == 4) {
				var json = JSON.parse(xhr.responseText);
				console.log(json);
				if (json.stream != null) {
					if (!notified) {
						serveNotification(json.stream);
						notified = true;
					}
				} else {
					notified = false;
				}
			};
		};
		xhr.open("GET", requestUrl, true);
		xhr.send();
	}
});

function serveNotification(stream) {
	var opt = {
		type : "basic",
		title : "newLEGACYinc",
		message : "Live on Twitch.tv!",
		contextMessage : "Playing: " + stream.game,
		iconUrl : "img/twitch_notification.png",
	};

	chrome.notifications.create(NOTIFICATION_ID, opt, function(id) {
		console.log("Successfully created " + NOTIFICATION_ID + " notification");
	});

	chrome.notifications.onClicked.addListener(function(id) {
		if (id == NOTIFICATION_ID) {
			chrome.notifications.clear(NOTIFICATION_ID, function() {
				chrome.tabs.create({
					'url' : streamUrl
				});
			});
		}
	});
}
