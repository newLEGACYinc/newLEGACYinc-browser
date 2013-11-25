// http://developer.chrome.com/extensions/notifications.html#type-NotificationOptions
var opt = {
	type : "basic",
	title : "newLEGACYinc",
	message : "Test message",
	contextMessage : "This is more message",
	iconUrl : "imgs/notification.png",
};

chrome.notifications.create("id1", opt, function(id) {
	console.log("Successfully created id1");
});