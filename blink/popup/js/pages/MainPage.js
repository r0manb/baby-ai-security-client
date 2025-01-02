import Page from "./Page.js";
import MenuState from "../utils/MenuState.js";
import EventEmitter from "../utils/EventEmitter.js";

class MainPage extends Page {

    render = async () => {
        const storage = await chrome.storage.sync.get([
            'token',
            'extensionStatus',
            'selectedCategories',
            'categories'
        ]);
        if (!storage.token) return EventEmitter.emit('RENDER_LOGIN_PAGE');

        MenuState.setCanOpen(true);
        $('.header__burger').removeClass('disabled');

        const mainPage = await this._getPageTemplate('/popup/templates/main.html');
        $('.body').html(mainPage);

        const setButtonStatus = (status) => {
            const turnBlockStatus = $('.turnblock__status');
            if (status) {
                $('.turnblock__button').addClass('active');
                $(turnBlockStatus).addClass('active');
                $(turnBlockStatus).text('Активно');
            } else {
                $('.turnblock__button').removeClass('active');
                $(turnBlockStatus).removeClass('active');
                $(turnBlockStatus).text('Не активно');
            }
        }

        if (!storage.extensionStatus) setButtonStatus(false);

        $(".turnblock__button").on("click", function () {
            chrome.storage.sync.get(['extensionStatus']).then(res => {
                chrome.storage.sync.set({ extensionStatus: !res.extensionStatus });
                setButtonStatus(!res.extensionStatus);
                chrome.action.setBadgeText({ text: !res.extensionStatus ? "ON" : "" });
            })
        });

        const settingsBody = document.querySelector('.settings > .menu__tab-content');
        for (const catId in storage.categories) {
            if (catId == 2) continue;

            const categoryLabel = document.createElement('label');
            categoryLabel.classList.add('settings__param');
            categoryLabel.innerHTML = `
                ${storage.categories[catId]}
                <input type="checkbox" class="settings__checkbox" data-category-id=${catId}>
                <span></span>`
            settingsBody.appendChild(categoryLabel);
        }
        storage.selectedCategories.forEach(cat => {
            $(`input[data-category-id=${cat}]`).attr('checked', 'checked');
        });

        $(".settings__opener").on("click", function () {
            $('.settings').toggleClass('active');
        });
        $(".history__opener").on("click", function () {
            Page.openPage('/infopages/history.html');
        });

        $(".settings__checkbox").change(function () {
            chrome.storage.sync.get(['selectedCategories']).then(res => {
                if (this.checked) {
                    chrome.storage.sync.set({
                        selectedCategories: [
                            ...res.selectedCategories,
                            $(this).attr('data-category-id')
                        ]
                    });
                } else {
                    const currentCheckBoxId = $(this).attr('data-category-id')
                    chrome.storage.sync.set({
                        selectedCategories: res.selectedCategories.filter(item => item != currentCheckBoxId)
                    });
                }
            })
        });

        MenuState.closeMenu();
        $('.menu__profile').text('Выйти');
        $('.menu__profile').attr('data-redirect-to', "logout");
    }
}

export default new MainPage();