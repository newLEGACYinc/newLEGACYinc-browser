$(document).ready(function onReady() {
	$('#youtube').click(function onClick() {
		chrome.tabs.create({
			url: YOUTUBE_URL
		});
	});
	$('#twitch').click(function onClick(){
		chrome.tabs.create({
			url: TWITCH_URL
		})
	})
});