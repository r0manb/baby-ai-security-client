import showNotification from '../components/notification.js'

function errorHandler(error) {
    if (error.message && error.message.length) {
        showNotification(error.message, 'error');
    }

    if (Object.keys(error.errors).length) {
        for (const field in error.errors) {
            $(`#form__input-${field} > .form__input-error`).text(error.errors[field][0]);
        }
    }
}

export default errorHandler;