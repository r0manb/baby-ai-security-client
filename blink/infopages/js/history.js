import { userRoute } from "../../assets/utils/apiRoutes.js";

async function fetchHistory() {
    try {
        const storage = await chrome.storage.sync.get(['token', 'categories']);
        const response = await fetch(`${userRoute}/history`, {
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