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
        const storage = await chrome.storage.sync.get(['token', 'extensionStatus', 'selectedCategories']);
        if (!storage.extensionStatus || !storage.token) {
            return document.body.classList.add("verification_completed");
        }

        const tabData = await chrome.runtime.sendMessage({ event: "GET_TAB" });
        const text = document.body.innerText;
        const response = await fetch('http://127.0.0.1:5000/api/predict', {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${storage.token}`,
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

        const data = await response.json();

        if ((!storage.selectedCategories.length && data.category_id != 2) || storage.selectedCategories.includes(data.category_id.toString())) {
            return renderWrongPage();
        }

        return document.body.classList.add("verification_completed");
    } catch (error) {
        console.log(error);
    }
}

checkPage();


