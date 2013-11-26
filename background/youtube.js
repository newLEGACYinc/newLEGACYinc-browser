var YOUTUBE_USERNAME = "newLEGACYinc";
var youTubeRequestUrl = "http://gdata.youtube.com/feeds/api/users/" + YOUTUBE_USERNAME + "/uploads?alt=json";

function youtubeListener(alarm){
	if (alarm.name !== "youtube")
		return;
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function() {
		// if request is ready
		if (xhr.readyState == 4) {
			var json = JSON.parse(xhr.responseText);
			
		};
	};
	xhr.open("GET", youTubeRequestUrl, true);
	xhr.send();
}