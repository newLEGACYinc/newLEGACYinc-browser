// This is called when the app or chrome is installed / updated
chrome.runtime.onInstalled.addListener(function onInstalled(details) {
	if (details.reason == 'install')
		chrome.storage.sync.set({
			'youtube_last_notified': moment().unix(),
			'youtube_notify': true,
			'twitch_notify': true
		}, function() {
			console.log("Set initial settings");
		});
});