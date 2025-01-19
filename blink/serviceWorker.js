import { apiRoute } from "./utils/apiRoutes.js";
import $request from "./utils/requestHandler.js";

chrome.storage.local.get(['extensionStatus']).then(({ extensionStatus }) => {
    chrome.action.setBadgeText({ text: extensionStatus ? "ON" : "" });
})

chrome.runtime.onMessage.addListener((req, sender, res) => {
    if (req.action == "GET_TAB") {
        res({
            title: sender.tab.title,
            url: sender.tab.url
        });
    }
    else if (req.action == "PREDICT_CATEGORY_ID") {
        predictCategoryId({
            name: req.name,
            url: req.url,
            text: req.text
        }, res);

        return true;
    }

});

async function predictCategoryId(body, res) {
    const { data } = await $request.post(`${apiRoute}/predict`, body);
    res(data.category_id);
}