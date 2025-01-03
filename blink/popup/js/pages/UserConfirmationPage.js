import Page from "./Page.js";
import MenuState from "../utils/MenuState.js";
import EventEmitter from "../utils/EventEmitter.js";
import { authRoute } from "/assets/utils/apiRoutes.js";
import { confirmationFormValidator } from "../utils/formValidators.js";

class UserConfirmationPage extends Page {

    render = async () => {
        MenuState.setCanOpen(false);
        const authPage = await this._getPageTemplate('/popup/templates/auth.html');
        $('.body').html(authPage);
        this.submitBtn = document.querySelector('.form__submit');
    }

    submitForm = async () => {
        this._submitFormWrapper(async () => {
            $(`.form__input > .form__input-error`).text('');

            const { token } = await chrome.storage.sync.get('token');
            if (!token) return EventEmitter.emit('RENDER_LOGIN_PAGE');

            const password = $('input[name="password"]').val();

            const errors = confirmationFormValidator(password);
            if (Object.keys(errors).length) {
                throw { errors };
            }

            const response = await fetch(`${authRoute}/user_confirmation`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ password })
            });
            const data = await response.json();

            if (!response.ok) {
                if (response.status == 401) EventEmitter.emit('LOGOUT');
                throw data;
            }

            chrome.storage.sync.set({
                categories: data.categories.list,
                neutralCategoryId: data.categories.neutral_category_id
            });

            return EventEmitter.emit('RENDER_MAIN_PAGE');
        });
    }
}

export default new UserConfirmationPage();