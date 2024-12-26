import Page from "./Page.js";
import MenuState from "../utils/MenuState.js";
import EventEmitter from "../utils/EventEmitter.js";
import errorHandler from "../utils/errorHandler.js";
import { authRoute } from "/assets/utils/apiRoutes.js";
import { loginFormValidator } from "../utils/formValidators.js";

class LoginPage extends Page {

    render = async () => {
        MenuState.canOpen = true;
        $('.header__burger').removeClass('disabled');

        const loginPage = await this._getPageTemplate('/popup/templates/login.html');
        $('.body').html(loginPage);

        MenuState.closeMenu();
        $('.menu__profile').text('Регистрация');
        $('.menu__profile').attr('data-redirect-to', "register");
    }

    submitForm = async () => {
        try {
            $(`.form__input > .form__input-error`).text('');

            const email = $('input[name="email"]').val();
            const password = $('input[name="password"]').val();

            const errors = loginFormValidator(email, password);
            if (Object.keys(errors).length) {
                throw { errors };
            }

            const response = await fetch(`${authRoute}/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password })
            });
            const data = await response.json();

            if (!response.ok) {
                throw data;
            }

            chrome.storage.sync.set({
                token: data.token,
                categories: data.categories,
                selectedCategories: [],
                extensionStatus: true,
            });
            chrome.action.setBadgeText({ text: "ON" });

            return EventEmitter.emit("RENDER_MAIN_PAGE");
        } catch (err) {
            errorHandler(err);
        }
    }
}

export default new LoginPage();