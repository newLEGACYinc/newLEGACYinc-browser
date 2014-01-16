// hitbox
chrome.alarms.create('hitbox', {
	when: Date.now(),
	periodInMinutes: 1
});
chrome.alarms.onAlarm.addListener(hitbox.listener);

// Twitch
chrome.alarms.create("twitch", {
	when: Date.now(),
	periodInMinutes: 1
});
chrome.alarms.onAlarm.addListener(twitch.listener);

// YouTube
chrome.alarms.create("youtube", {
	when: Date.now(),
	periodInMinutes: 5
});
chrome.alarms.onAlarm.addListener(youtube.listener);