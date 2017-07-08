$(document).ready(function onReady() {
	$('#youtube').click(function onClick() {
		createOrActivate(YOUTUBE_URL, YOUTUBE_URL_SEARCH_PATTERN);
	});
	$('#twitch').click(function onClick() {
		createOrActivate(TWITCH_URL, TWITCH_URL_SEARCH_PATTERN);
	});
	$('#twitter').click(function onClick() {
		createOrActivate(TWITTER_URL, TWITTER_URL_SEARCH_PATTERN);
	});

	$('img').hover(function mouseIn(){
		$(this).fadeTo('fast', 0.5);
	}, function mouseOut(){
		$(this).fadeTo('fast', 1.0);
	});
});

// if no tab is found with search, create tab with url
function createOrActivate(url, search) {
	chrome.tabs.query({
		url: search
	}, function callback(tabs) {
		if (tabs[0]) { // if there is a tab with this url already open
			// activate the tab
			chrome.tabs.update(tabs[0].id, {
				active: true
			});
		} else {
			// create the tab
			chrome.tabs.create({
				url: url
			});
		}
	});
}
