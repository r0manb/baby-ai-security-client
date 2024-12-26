class Page {
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

    render = async () => { }
    submitForm = async () => { }
}

export default Page;