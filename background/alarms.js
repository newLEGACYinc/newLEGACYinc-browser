/**
 * Twitch 
 */
chrome.alarms.create("twitch_alarm", {
	when : Date.now(),
	periodInMinutes : 1
});
chrome.alarms.onAlarm.addListener(twitchListener);