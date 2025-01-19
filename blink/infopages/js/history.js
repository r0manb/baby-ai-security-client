import Pagination from "./components/Pagination.js";
import { formatDateAndTime } from "./utils/dateHandlers.js";
import { userRoute } from "../../utils/apiRoutes.js";
import $request from "../../utils/requestHandler.js";

const window_href = new URL(window.location.href);

function goToPage(page) {
    window_href.searchParams.set('page', page);
    window.history.pushState({}, '', window_href);
    fetchHistory(page);
}

window.addEventListener('popstate', (e) => {
    window.location.replace(e.target.location.href);
});

async function fetchHistory(page) {
    try {
        const tableBody = document.querySelector('.information__history > tbody');
        tableBody.innerHTML = '';

        const { categories } = await chrome.storage.local.get(['categories']);

        const { data } = await $request.get(`${userRoute}/history?page=${page}`);
        const { total_count, items_on_page, history } = data;

        tableBody.innerHTML = '';
        for (const tableElem of history) {
            const tr = document.createElement('tr');
            const category = categories[tableElem.category_id];
            const createdAt = formatDateAndTime(tableElem.created_at);
            tr.innerHTML = `
                <td><a href="${tableElem.url}" title="${tableElem.name}">${tableElem.name}</a></td>
                <td><p title="${category}">${category}</p></td>
                <td><p title="${createdAt}">${createdAt}</p></td>
            `;
            tableBody.appendChild(tr);
        }

        if (!history.length) {
            tableBody.innerHTML = '<p class="information__message clear">Здесь пока что пусто.</p>';
        }

        return { totalCount: total_count, itemsOnPage: items_on_page }
    } catch (error) {
        console.log(error);
    }
}


const startPage = Number(window_href.searchParams.get('page'));
const { totalCount, itemsOnPage } = await fetchHistory(startPage);
const totalPages = Math.ceil(totalCount / itemsOnPage);

if (startPage < totalPages) {
    const pagination = new Pagination(totalPages, 3, startPage + 1);

    pagination.render(document.querySelector('.information'));
    pagination.onChange(e => {
        const page = Number(window_href.searchParams.get('page'));
        if (e.target.value - 1 != page) {
            goToPage(e.target.value - 1);
        }
    });
}