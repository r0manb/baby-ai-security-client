const emailValidator = (email) => {
    const errors = [];

    if (!email.length) {
        errors.push('Обязательное поле');
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
        errors.push('Некорректная почта');
    }

    return errors;
}
const passwordValidator = (password, min = -1) => {
    const errors = [];

    if (!password.length) {
        errors.push('Обязательное поле');
    }

    if (min != -1 && password.length < min) {
        const wordEnding = min % 10 == 1 && min % 100 != 11
            ? 'а'
            : (min % 10 >= 2 && min % 10 <= 4
                && (n % 100 < 10
                    || min % 100 >= 20) ? 'а' : 'ов');

        errors.push(`Пароль должен быть минимум из ${min} символ${wordEnding}`);
    }

    return errors;
}
const confirmPasswordValidator = (password, confirmPassword) => {
    const errors = [];

    if (!confirmPassword.length) {
        errors.push('Обязательное поле');
    }
    if (password != confirmPassword){
        errors.push('Пароли не совпадают');
    }

    return errors;
}



export const loginFormValidator = (email = '', password = '') => {
    const errors = {};

    const emailErrors = emailValidator(email);
    const passwordErrors = passwordValidator(password);

    if (emailErrors.length) errors.email = emailErrors;
    if (passwordErrors.length) errors.password = passwordErrors;

    return errors;
}

export const registerFormValidator = (email = '', password = '', confirmPassword = '') => {
    const errors = {};

    const emailErrors = emailValidator(email);
    const passwordErrors = passwordValidator(password, 6);
    const passwordConfirmErrors = confirmPasswordValidator(password, confirmPassword);

    if (emailErrors.length) errors.email = emailErrors;
    if (passwordErrors.length) errors.password = passwordErrors;
    if (passwordConfirmErrors.length) errors.password_confirm = passwordConfirmErrors;

    return errors;
}

export const confirmationFormValidator = (password = '') => {
    const errors = {};

    const passwordErrors = passwordValidator(password);

    if (passwordErrors.length) errors.password = passwordErrors;

    return errors;
}