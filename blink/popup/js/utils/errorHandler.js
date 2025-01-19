import showNotification from "../components/notification.js";
import EventEmitter from "./EventEmitter.js";

function errorHandler({ error }) {
    const { status, data } = error.response;
    
    if (status === 401){
        EventEmitter.emit('LOGOUT');
    }

    if (data.message && data.message.length) {
        showNotification(data.message, 'error');
    }

    if (Object.keys(data.errors).length) {
        for (const field in data.errors) {
            $(`#form__input-${field} > .form__input-error`).text(data.errors[field][0]);
        }
    }
}

export default errorHandler;