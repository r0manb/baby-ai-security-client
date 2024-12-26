import {
    Page,
    LoginPage,
    RegisterPage,
    UserConfirmationPage,
    MainPage,
    LogoutPage
} from "/popup/js/pages/index.js";

import EventEmitter from '/popup/js/utils/EventEmitter.js';
import MenuState from '/popup/js/utils/MenuState.js'



EventEmitter.on('RENDER_LOGIN_PAGE', LoginPage.render);
EventEmitter.on('RENDER_REGISTER_PAGE', RegisterPage.render);
EventEmitter.on('RENDER_CONFIRMPASS_PAGE', UserConfirmationPage.render);
EventEmitter.on('RENDER_MAIN_PAGE', MainPage.render);
EventEmitter.on('LOGOUT', LogoutPage.submitForm);

const eventsFuncList = {
    '*[data-redirect-to="register"]': {
        func: function () {
            EventEmitter.emit('RENDER_REGISTER_PAGE');
        },
        event: 'click'
    },
    '*[data-redirect-to="login"]': {
        func: function () {
            EventEmitter.emit('RENDER_LOGIN_PAGE');
        },
        event: 'click'
    },
    '*[data-redirect-to="logout"]': {
        func: function () {
            EventEmitter.emit('LOGOUT');
        },
        event: 'click'
    },
    '.form.register': {
        func: function (event) {
            event.preventDefault();
            RegisterPage.submitForm();
        },
        event: 'submit'
    },
    '.form.login': {
        func: function (event) {
            event.preventDefault();
            LoginPage.submitForm();
        },
        event: 'submit'
    },
    '.form.confirmation': {
        func: function (event) {
            event.preventDefault();
            UserConfirmationPage.submitForm();
        },
        event: 'submit'
    },
    '.menu__tab-return': {
        func: function () { $(this).parent().removeClass('active'); },
        event: 'click'
    },
}
function updateEvents() {
    for (const elem in eventsFuncList) {
        $(elem).off(eventsFuncList[elem].event);
        $(elem).on(eventsFuncList[elem].event, eventsFuncList[elem].func);
    }
}

const DOMObserver = new MutationObserver(function (mutation) {
    updateEvents();
});
DOMObserver.observe(document.querySelector('.body'), {
    attributes: true,
    childList: true,
    characterData: true
});

async function start() {
    const storage = await chrome.storage.sync.get('token');

    if (storage.token) {
        return EventEmitter.emit('RENDER_CONFIRMPASS_PAGE');
    }
    updateEvents();
    $('.menu').addClass('active');
}

$(".header__burger").on("click", function () {
    if (MenuState.canOpen) {
        $(this).toggleClass('active');
        $('.menu').toggleClass('active');
    }
});
$(".menu__tab-opener").on("click", function () {
    const tabId = $(this).data('menu-tab-id');
    $(`#${tabId}`).addClass('active');
});
$('.htu__opener').on('click', function () {
    Page.openPage('/infopages/how-to-use.html');
});


start();

