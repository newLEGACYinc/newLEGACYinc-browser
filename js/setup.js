// This is called when the app or chrome is installed / updated
chrome.runtime.onInstalled.addListener(function(details) {
	if (details.reason == 'installed')
		chrome.storage.sync.set({
			'youtube_last_notified' : moment().unix()
		}, function() {
			console.log("Set last notified");
		});
});
