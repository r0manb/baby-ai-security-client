import Page from "./Page.js";
import MenuState from "../utils/MenuState.js";
import EventEmitter from "../utils/EventEmitter.js";
import showNotification from "../components/notification.js";
import { authRoute } from "/assets/utils/apiRoutes.js";
import { registerFormValidator } from "../utils/formValidators.js";

class RegisterPage extends Page {

    render = async () => {
        MenuState.canOpen = true;
        $('.header__burger').removeClass('disabled');

        const registerPage = await this._getPageTemplate('/popup/templates/register.html');
        $('.body').html(registerPage);

        this.submitBtn = document.querySelector('.form__submit');

        MenuState.closeMenu();
        $('.menu__profile').text('Войти');
        $('.menu__profile').attr('data-redirect-to', "login");
    }

    submitForm = async () => {
        this._submitFormWrapper(async () => {
            $(`.form__input > .form__input-error`).text('');

            const email = $('input[name="email"]').val();
            const password = $('input[name="password"]').val();
            const passwordConfirm = $('input[name="password_confirm"]').val();

            const errors = registerFormValidator(email, password, passwordConfirm);
            if (Object.keys(errors).length) {
                throw { errors };
            }

            const response = await fetch(`${authRoute}/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    password,
                    password_confirm: passwordConfirm
                })
            });
            const data = await response.json();

            if (!response.ok) {
                throw data;
            }

            showNotification(data.message, 'success');
            return EventEmitter.emit('RENDER_LOGIN_PAGE');
        })
    }
}

export default new RegisterPage();