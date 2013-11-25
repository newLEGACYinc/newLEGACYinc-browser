var opt = {
    type: "basic",
    title: "Primary Title",
    message: "Primary message to display",
    iconUrl: "imgs/notification.png"
};

chrome.notifications.create("id1", opt, function(id){
    console.log("Successfully created id1");
});