chrome.storage.sync.get(['history']).then(res => {
    const tableBody = document.querySelector('.information__history > tbody');

    for (const tableElem of res.history) {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><p>${tableElem.title}</p></td>
            <td><p>${tableElem.category}</p></td>
            <td><a href="${tableElem.url}">${tableElem.url}</a></td>
        `
        tableBody.appendChild(tr);
    }
});