const renderWrongPage = async () => {
    const htmlTemplate = await fetch(chrome.runtime.getURL('/wrongpage/index.html'));
    const html = await htmlTemplate.text();
    const cssUrl = chrome.runtime.getURL('/wrongpage/style.css');

    const cssLinkElem = document.createElement('link');
    cssLinkElem.setAttribute('rel', 'stylesheet');
    cssLinkElem.setAttribute('type', 'text/css');
    cssLinkElem.setAttribute('href', cssUrl);

    document.write(html);
    document.head.insertAdjacentElement('beforeend', cssLinkElem);
}

const checkPage = async () => {
    try {
        const {
            token,
            extensionStatus,
            selectedCategories,
            neutralCategoryId
        } = await chrome.storage.local.get([
            'token',
            'extensionStatus',
            'selectedCategories',
            'neutralCategoryId'
        ]);

        if (!extensionStatus || !token) {
            return document.body.classList.add("verification_completed");
        }
        const tabData = await chrome.runtime.sendMessage({ action: "GET_TAB" });
        const text = document.body.innerText;

        const categoryId = await chrome.runtime.sendMessage({
            action: "PREDICT_CATEGORY_ID",
            name: tabData.title,
            url: tabData.url,
            text,
        });

        if ((!selectedCategories.length && categoryId != neutralCategoryId) || selectedCategories.includes(categoryId.toString())) {
            return renderWrongPage();
        }

        return document.body.classList.add("verification_completed");
    } catch (error) {
        console.log(error);
        return document.body.classList.add("verification_completed");
    }
}

checkPage();


