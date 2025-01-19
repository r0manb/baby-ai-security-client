import Page from "./Page.js";
import MenuState from "../utils/MenuState.js";
import EventEmitter from "../utils/EventEmitter.js";
import { authRoute, popupTemplatesRoute } from "../../../utils/apiRoutes.js";
import { loginFormValidator } from "../utils/formValidators.js";
import $request from "../../../utils/requestHandler.js";

class LoginPage extends Page {

    render = async () => {
        MenuState.setCanOpen(true);
        $('.header__burger').removeClass('disabled');

        const loginPage = await this._getPageTemplate(`${popupTemplatesRoute}/login.html`);
        $('.body').html(loginPage);

        this.submitBtn = document.querySelector('.form__submit');

        MenuState.closeMenu();
        $('.menu__profile').text('Регистрация');
        $('.menu__profile').attr('data-redirect-to', "register");
    }

    submitForm = async () => {
        this._submitFormWrapper(async () => {
            $(`.form__input > .form__input-error`).text('');

            const email = $('input[name="email"]').val();
            const password = $('input[name="password"]').val();

            const errors = loginFormValidator(email, password);
            if (errors) {
                throw errors;
            }

            const { data } = await $request.post(`${authRoute}/login`, {
                email,
                password
            });

            chrome.storage.local.set({
                token: data.token,
                categories: data.categories.list,
                neutralCategoryId: data.categories.neutral_category_id,
                selectedCategories: [],
                extensionStatus: true,
            });
            chrome.action.setBadgeText({ text: "ON" });

            return EventEmitter.emit("RENDER_MAIN_PAGE");
        })
    }
}

export default new LoginPage();