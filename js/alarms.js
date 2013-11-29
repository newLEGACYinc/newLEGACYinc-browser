/**
 * Twitch 
 */
chrome.alarms.create("twitch", {
	when : Date.now(),
	periodInMinutes : 1
});
chrome.alarms.onAlarm.addListener(twitchListener);

/**
 * YouTube 
 */
chrome.alarms.create("youtube", {
	when : Date.now(),
	periodInMinutes : 5
});
chrome.alarms.onAlarm.addListener(youtubeListener);