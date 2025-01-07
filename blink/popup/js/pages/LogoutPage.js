import Page from "./Page.js";
import EventEmitter from "../utils/EventEmitter.js";

class LogoutPage extends Page {

    submitForm = async () => {
        chrome.storage.sync.clear();
        chrome.action.setBadgeText({ text: "" });
        return EventEmitter.emit('RENDER_LOGIN_PAGE');
    }
}

export default new LogoutPage();