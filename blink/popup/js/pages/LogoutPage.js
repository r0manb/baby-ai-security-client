import Page from "./Page.js";
import EventEmitter from "../utils/EventEmitter.js";
import { authRoute } from "../../../utils/apiRoutes.js";
import $request from "../../../utils/requestHandler.js";

class LogoutPage extends Page {

    submitForm = async () => {
        this._submitFormWrapper(async () => {
            await $request.post(`${authRoute}/logout`)

            chrome.storage.local.clear();
            chrome.action.setBadgeText({ text: "" });
            
            return EventEmitter.emit('RENDER_LOGIN_PAGE');
        })

    }
}

export default new LogoutPage();