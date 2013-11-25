/**
 * Twitch 
 */
chrome.alarms.create("twitch", {
	when : Date.now(),
	periodInMinutes : 1
});
chrome.alarms.onAlarm.addListener(twitchListener);

chrome.alarms.create("youtube", {
	when : Date.now(),
	periodInMinutes : 5
});