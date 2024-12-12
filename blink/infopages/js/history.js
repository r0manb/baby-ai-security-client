async function fetchHistory() {
    try {
        const storage = await chrome.storage.sync.get(['token', 'categories']);
        const response = await fetch('http://127.0.0.1:5000/api/user/history', {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${storage.token}`,
                "Content-Type": "application/json",
            }
        });

        const data = await response.json();
        const tableBody = document.querySelector('.information__history > tbody');

        for (const tableElem of data) {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><p>${tableElem.name}</p></td>
                <td><p>${storage.categories[tableElem.category_id]}</p></td>
                <td><a href="${tableElem.url}">${tableElem.url}</a></td>
            `;
            tableBody.appendChild(tr);
        }

    } catch (error) {
        console.log(error);
    }
}

fetchHistory();