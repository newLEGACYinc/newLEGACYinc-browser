$(document).ready(function onReady() {
	$('#youtube').click(function onClick() {
		chrome.tabs.create({
			url: YOUTUBE_URL
		});
	});
});