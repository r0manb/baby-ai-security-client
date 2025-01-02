import errorHandler from "../utils/errorHandler.js";

class Page {
    constructor() {
        this.isFetching = false;
        this.submitBtn = null;
    }

    static openPage = (url) => {
        const pageUrl = chrome.runtime.getURL(url);
        chrome.tabs.create({ url: pageUrl });
        window.close();
    }

    _getPageTemplate = async (url) => {
        const pageTemplate = await fetch(chrome.runtime.getURL(url));
        const page = await pageTemplate.text();
        return page;
    }

    _submitFormWrapper = async (func) => {
        try {
            if (this.isFetching) return;

            this.setIsFetching(true);
            this.setSubmitBtnDisabled(true);

            return await func();
        } catch (err) {
            errorHandler(err);
        } finally {
            this.setIsFetching(false);
            this.setSubmitBtnDisabled(false);
        }
    }

    setIsFetching = (bool) => this.isFetching = bool;
    setSubmitBtnDisabled = (bool) => this.submitBtn.disabled = bool;

    render = async () => { }
    submitForm = async () => { }
}

export default Page;