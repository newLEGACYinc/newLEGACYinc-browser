var TWITCH_USERNAME = "newLEGACYinc";
var NOTIFICATION_ID = 'twitch';

var requestUrl = "https://api.twitch.tv/kraken/streams/" + TWITCH_USERNAME + "?client_id=" + TWITCH_CLIENT_ID;
var streamUrl = "http://www.twitch.tv/" + TWITCH_USERNAME;

var xhr = new XMLHttpRequest();
xhr.onreadystatechange = function() {
	// if request is ready
	if (xhr.readyState == 4) {
		var json = JSON.parse(xhr.responseText);
		if (json.stream != null) {
			serveNotification(json.stream);
		}
	};
};
xhr.open("GET", requestUrl, true);
xhr.send();

function serveNotification(stream) {
	var opt = {
		type : "basic",
		title : "newLEGACYinc",
		message : "Stream online!",
		contextMessage : "This is more message",
		iconUrl : "img/notification.png",
	};

	chrome.notifications.create(NOTIFICATION_ID, opt, function(id) {
		console.log("Successfully created " + NOTIFICATION_ID);
	});
}
