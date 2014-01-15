function save() {
	var hitbox_notify = $('#hitbox').prop('checked');
	var youTube_notify = $('#youtube').prop('checked');
	var twitch_notify = $('#twitchtv').prop('checked');
	chrome.storage.sync.set({
		'hitbox_notify': hitbox_notify,
		'youtube_notify': youTube_notify,
		'twitch_notify': twitch_notify
	}, function done() {});
}

function load() {
	chrome.storage.sync.get('hitbox_notify', function got(data){
		var notify = data.hitbox_notify;
		$('#hitbox').prop('checked', notify);
	})
	chrome.storage.sync.get('youtube_notify', function got(data) {
		var notify = data.youtube_notify;
		$('#youtube').prop('checked', notify);
	});
	chrome.storage.sync.get('twitch_notify', function got(data) {
		var notify = data.twitch_notify;
		$('#twitchtv').prop('checked', notify);
	})
}

$(document).ready(function onReady() {
	load();
	$('#form').submit(function onSubmit(event) {
		event.preventDefault();
		save();
	});
});