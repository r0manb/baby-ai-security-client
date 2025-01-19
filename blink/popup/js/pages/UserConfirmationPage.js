import Page from "./Page.js";
import MenuState from "../utils/MenuState.js";
import EventEmitter from "../utils/EventEmitter.js";
import { authRoute, popupTemplatesRoute } from "../../../utils/apiRoutes.js";
import { confirmationFormValidator } from "../utils/formValidators.js";
import $request from "../../../utils/requestHandler.js";
import "../../../assets/libs/axios/axios.min.js";

class UserConfirmationPage extends Page {

    render = async () => {
        MenuState.setCanOpen(false);
        const authPage = await this._getPageTemplate(`${popupTemplatesRoute}/auth.html`);
        $('.body').html(authPage);
        this.submitBtn = document.querySelector('.form__submit');
    }

    submitForm = async () => {
        this._submitFormWrapper(async () => {
            $(`.form__input > .form__input-error`).text('');

            const { token } = await chrome.storage.local.get('token');
            if (!token) return EventEmitter.emit('RENDER_LOGIN_PAGE');

            const password = $('input[name="password"]').val();

            const errors = confirmationFormValidator(password);
            if (errors) {
                throw errors;
            }

            const { data } = await $request.post(`${authRoute}/user_confirmation`, {
                password
            });

            chrome.storage.local.set({
                categories: data.categories.list,
                neutralCategoryId: data.categories.neutral_category_id
            });

            return EventEmitter.emit('RENDER_MAIN_PAGE');
        });
    }
}

export default new UserConfirmationPage();