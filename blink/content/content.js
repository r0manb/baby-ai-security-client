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
        } = await chrome.storage.sync.get([
            'token', 
            'extensionStatus', 
            'selectedCategories',
            'neutralCategoryId'
        ]);

        if (!extensionStatus || !token) {
            return document.body.classList.add("verification_completed");
        }
        
        const { apiRoute } = await import(chrome.runtime.getURL("/assets/utils/apiRoutes.js"));
        const tabData = await chrome.runtime.sendMessage({ event: "GET_TAB" });
        const text = document.body.innerText;
        
        const response = await fetch(`${apiRoute}/predict`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: tabData.title,
                url: tabData.url,
                text
            })
        });

        if (!response.ok) {
            return document.body.classList.add("verification_completed");
        }

        const { category_id } = await response.json();

        if ((!selectedCategories.length && category_id != neutralCategoryId) || selectedCategories.includes(category_id.toString())) {
            return renderWrongPage();
        }

        return document.body.classList.add("verification_completed");
    } catch (error) {
        console.log(error);
    }
}

checkPage();


