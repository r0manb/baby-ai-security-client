import Page from "./Page.js";
import MenuState from "../utils/MenuState.js";
import EventEmitter from "../utils/EventEmitter.js";
import { popupTemplatesRoute } from "../../../utils/apiRoutes.js";

class MainPage extends Page {

    render = async () => {
        const {
            token,
            extensionStatus,
            selectedCategories,
            categories,
            neutralCategoryId
        } = await chrome.storage.local.get([
            'token',
            'extensionStatus',
            'selectedCategories',
            'categories',
            'neutralCategoryId'
        ]);
        if (!token) return EventEmitter.emit('RENDER_LOGIN_PAGE');

        MenuState.setCanOpen(true);
        $('.header__burger').removeClass('disabled');

        const mainPage = await this._getPageTemplate(`${popupTemplatesRoute}/main.html`);
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

        if (!extensionStatus) setButtonStatus(false);

        $(".turnblock__button").on("click", function () {
            chrome.storage.local.get(['extensionStatus'])
                .then(res => {
                    chrome.storage.local.set({ extensionStatus: !res.extensionStatus });
                    setButtonStatus(!res.extensionStatus);
                    chrome.action.setBadgeText({ text: !res.extensionStatus ? "ON" : "" });
                })
        });

        const settingsBody = document.querySelector('.settings > .menu__tab-content');
        for (const catId in categories) {
            if (catId == neutralCategoryId) continue;

            const categoryLabel = document.createElement('label');
            categoryLabel.classList.add('settings__param');
            categoryLabel.innerHTML = `
                ${categories[catId]}
                <input type="checkbox" class="settings__checkbox" data-category-id=${catId}>
                <span></span>`
            settingsBody.appendChild(categoryLabel);
        }
        selectedCategories.forEach(cat => {
            $(`input[data-category-id=${cat}]`).attr('checked', 'checked');
        });

        $(".settings__opener").on("click", function () {
            $('.settings').toggleClass('active');
        });
        $(".history__opener").on("click", function () {
            Page.openPage('/infopages/history.html');
        });

        $(".settings__checkbox").change(function () {
            chrome.storage.local.get(['selectedCategories'])
                .then(res => {
                    if (this.checked) {
                        chrome.storage.local.set({
                            selectedCategories: [
                                ...res.selectedCategories,
                                $(this).attr('data-category-id')
                            ]
                        });
                    } else {
                        const currentCheckBoxId = $(this).attr('data-category-id')
                        chrome.storage.local.set({
                            selectedCategories: res.selectedCategories.filter(item => item != currentCheckBoxId)
                        });
                    }
                });
        });

        MenuState.closeMenu();
        $('.menu__profile').text('Выйти');
        $('.menu__profile').attr('data-redirect-to', "logout");
    }
}

export default new MainPage();