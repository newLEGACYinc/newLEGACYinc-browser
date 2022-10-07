import { initializeApp } from "./js/firebase-app.js";
import { getMessaging, onBackgroundMessage } from './js/firebase-messaging-sw.js';
import { getToken } from "./js/firebase-messaging.js";

const firebaseConfig = {
    apiKey: "AIzaSyAirkUx2JFn2g0ERFdnc76aHW2idWTbRfM",
    authDomain: "nl-notification-server.firebaseapp.com",
    projectId: "nl-notification-server",
    storageBucket: "nl-notification-server.appspot.com",
    messagingSenderId: "1061978312341",
    appId: "1:1061978312341:web:e67c155df9c70b8de1159c"
};

const vapidKey = "BLLgtEIQGYCO-BnoQHonXCJBfxQwtXxLOcE9kDKiqis6eOEF6JzbEd5RCaVjb5fGTL_jmjCJYGoeGnoHkBjUj8Y";

const serverURL = "http://notify.newlegacyinc.tv"

const firebaseApp = initializeApp(firebaseConfig);
const messaging = getMessaging(firebaseApp);

onBackgroundMessage(messaging, (payload) => {
    console.log('[background.js] Received background message ', payload);

    if (payload.data.title.toLowerCase() == "youtube")
        var options = {
            type: "basic",
            title: payload.data.title,
            message: payload.data.body,
            iconUrl: "img/youtube_notification.png"
        }
    else if (payload.data.title.toLowerCase() == "twitch")
        var options = {
            type: "basic",
            title: payload.data.title,
            message: payload.data.body,
            iconUrl: "img/twitch_notification.png"
        }

    chrome.notifications.create(payload.data.title.toLowerCase(), options);

    chrome.notifications.onClicked.addListener(function listener(id) {
        if (id == 'youtube') {
            chrome.notifications.clear('youtube', function () {
                chrome.tabs.create({
                    'url': payload.data.url
                });
            });
        } else if (id == 'twitch') {
            chrome.notifications.clear('twitch', function () {
                chrome.tabs.create({
                    'url': 'https://www.twitch.tv/newLEGACYinc'
                });
            });
        }
    });
});

chrome.runtime.onInstalled.addListener(function onInstalled(details) {
    getToken(messaging, {
        vapidKey,
        serviceWorkerRegistration: self.registration,
    }).then((currentToken) => {
        if (currentToken) {
            console.log('Token registered.');
            chrome.storage.sync.get('auth_token', function (data) {
                if (details.reason !== 'install') {
                    fetch(serverURL + "/unsubscribe-twitch/" + data.auth_token, {
                        method: "POST"
                    }).then(res => {
                        console.log("Request complete! response:", res.status)
                    });
                    fetch(serverURL + "/unsubscribe-youtube/" + data.auth_token, {
                        method: "POST"
                    }).then(res => {
                        console.log("Request complete! response:", res.status)
                    });
                }
            })
            chrome.storage.sync.set({
                'auth_token': currentToken
            })
        } else {
            console.log('No registration token available. Request permission to generate one.');
        }
    }).catch((err) => {
        console.log('An error occurred while retrieving token. ', err);
    });
    if (details.reason == 'install') {
        chrome.storage.sync.set({
            'youtube_notify': true,
            'twitch_notify': true
        }, function onSetup() {
            console.log("Set initial settings");
        });
        console.log('installed');
    }
});

chrome.storage.onChanged.addListener(function (changes) {
    chrome.storage.sync.get('auth_token', function (data) {
        if ("youtube_notify" in changes) {
            console.log(changes.youtube_notify);
            if (changes.youtube_notify.newValue == true && changes.youtube_notify.oldValue == false) {
                fetch(serverURL + "/subscribe-youtube/" + data.auth_token, {
                    method: "POST"
                }).then(res => {
                    console.log("Request complete! response:", res.status)
                });
            } else if (changes.youtube_notify.newValue == false && changes.youtube_notify.oldValue == true) {
                fetch(serverURL + "/unsubscribe-youtube/" + data.auth_token, {
                    method: "POST"
                }).then(res => {
                    console.log("Request complete! response:", res.status)
                });
            }
        }
    })
});

chrome.storage.onChanged.addListener(function (changes) {
    chrome.storage.sync.get('auth_token', function (data) {
        if ("twitch_notify" in changes) {
            console.log(changes.twitch_notify);
            if (changes.twitch_notify.newValue == true && changes.twitch_notify.oldValue == false) {
                fetch(serverURL + "/subscribe-twitch/" + data.auth_token, {
                    method: "POST"
                }).then(res => {
                    console.log("Request complete! response:", res.status)
                });
            } else if (changes.twitch_notify.newValue == false && changes.twitch_notify.oldValue == true) {
                fetch(serverURL + "/unsubscribe-twitch/" + data.auth_token, {
                    method: "POST"
                }).then(res => {
                    console.log("Request complete! response:", res.status)
                });
            }
        }
    })
});

chrome.storage.onChanged.addListener(function (changes) {
    chrome.storage.sync.get(['auth_token', 'twitch_notify', 'youtube_notify'], function (data) {
        if ("auth_token" in changes) {
            console.log(changes.auth_token);
            if (data.twitch_notify == true) {
                fetch(serverURL + "/subscribe-twitch/" + data.auth_token, {
                    method: "POST"
                }).then(res => {
                    console.log("Request complete! response:", res.status)
                });
            }
            if (data.youtube_notify == true) {
                fetch(serverURL + "/subscribe-youtube/" + data.auth_token, {
                    method: "POST"
                }).then(res => {
                    console.log("Request complete! response:", res.status)
                });
            }
        }
    })
})

chrome.alarms.create("twitch", {
    when: Date.now(),
    periodInMinutes: 5
});

chrome.alarms.onAlarm.addListener(function listener(alarm) {
    if (alarm.name !== "twitch")
        return;
    chrome.storage.sync.get('twitch_notify', function got(data) {
        var notify = data.twitch_notify;
        if (notify) {
            fetch(serverURL + "/status", {
                method: "GET",
                headers: {
                    'Accept': 'application/json'
                },
            }).then(res => res.json())
                .then(data => {
                    console.log(data.stream_status)
                    if (data.stream_status.trim() !== "Offline") {
                        chrome.action.setIcon({ path: 'img/newLEGACYinc_38_online.png' });
                    } else {
                        chrome.action.setIcon({ path: 'img/newLEGACYinc_38.png' });
                    }
                });
        }
    });
});

chrome.runtime.onStartup.addListener(function onStartup() {
    chrome.storage.sync.get('auth_token', function (data) {
        getToken(messaging, {
            vapidKey,
            serviceWorkerRegistration: self.registration,
        }).then((currentToken) => {
            if (currentToken !== data.auth_token)
                chrome.storage.sync.set({
                    'auth_token': currentToken
                })
        })
    })
})