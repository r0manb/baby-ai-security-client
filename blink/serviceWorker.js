chrome.storage.sync.get(['extensionStatus']).then(res => {
    chrome.action.setBadgeText({ text: res.extensionStatus ? "ON" : "" });
})

chrome.runtime.onMessage.addListener(function(req, sender, res) {
    if (req.event == "GET_TAB") {
        res({
            title: sender.tab.title,
            url: sender.tab.url
        });
     }
});