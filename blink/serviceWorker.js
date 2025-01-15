chrome.storage.local.get(['extensionStatus']).then(({ extensionStatus }) => {
    chrome.action.setBadgeText({ text: extensionStatus ? "ON" : "" });
})

chrome.runtime.onMessage.addListener(function (req, sender, res) {
    if (req.event == "GET_TAB") {
        res({
            title: sender.tab.title,
            url: sender.tab.url
        });
    }
});