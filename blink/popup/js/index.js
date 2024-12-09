import {
    loginFormValidator,
    registerFormValidator,
    confirmationFormValidator
} from '/popup/js/formValidators.js';

const apiRoute = 'http://127.0.0.1:5000/api';

let canOpenMenu = false;

const eventsFuncList = {
    '*[data-redirect-to="register"]': {
        func: function () { renderRegisterPage(); },
        event: 'click'
    },
    '*[data-redirect-to="login"]': {
        func: function () { renderLoginPage(); },
        event: 'click'
    },
    '*[data-redirect-to="logout"]': {
        func: function () { logoutHandler(); },
        event: 'click'
    },
    '.form.register': {
        func: function (event) { 
            event.preventDefault();
            registerHandler(); 
        },
        event: 'submit'
    },
    '.form.login': {
        func: function (event) { 
            event.preventDefault();
            loginHandler(); 
        },
        event: 'submit'
    },
    '.form.confirmation': {
        func: function (event) { 
            event.preventDefault();
            userConfirmationHandler(); 
        },
        event: 'submit'
    },
    '.menu__tab-return': {
        func: function () { $(this).parent().removeClass('active'); },
        event: 'click'
    },
}

$('.htu__opener').on('click', function () {
    openInfoPage('how-to-use');
});

const showNotification = (message, type = 'success') => {
    $('.popup__message').remove();

    const notification = document.createElement('div');
    notification.classList.add('popup__message');
    notification.classList.add('show');
    notification.classList.add('--can_be_closed');
    notification.classList.add(type);
    notification.textContent = message;

    const closeSpan = document.createElement('span');
    closeSpan.classList.add('popup__message-close');

    const closeNotification = () => {
        if (!notification.classList.contains('--can_be_closed')) return;
        notification.classList.remove('--can_be_closed');
        closeSpan.removeEventListener('click', closeNotification);
    
        notification.classList.add('closing');
        setTimeout(() => notification.remove(), 400);
    }
    closeSpan.addEventListener('click', closeNotification);

    notification.appendChild(closeSpan);
    document.querySelector('.popup').appendChild(notification);

    setTimeout(closeNotification, 3000);
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

async function getPageTemplate(url) {
    const pageTemplate = await fetch(chrome.runtime.getURL(url));
    const page = await pageTemplate.text();
    return page;
}

function openInfoPage(pageName = 'history') {
    const pageUrl = chrome.runtime.getURL(`/infopages/${pageName}.html`);
    chrome.tabs.create({ url: pageUrl });
    window.close();
}


async function renderRegisterPage() {
    canOpenMenu = true;
    $('.header__burger').removeClass('disabled');

    const registerPage = await getPageTemplate('/popup/templates/register.html');
    $('.body').html(registerPage);

    closeMenu();
    $('.menu__profile').text('Войти');
    $('.menu__profile').attr('data-redirect-to', "login");
}
async function renderLoginPage() {
    canOpenMenu = true;
    $('.header__burger').removeClass('disabled');

    const loginPage = await getPageTemplate('/popup/templates/login.html');
    $('.body').html(loginPage);

    closeMenu();
    $('.menu__profile').text('Регистрация');
    $('.menu__profile').attr('data-redirect-to', "register");
}
async function renderMainPage() {
    const storage = await chrome.storage.sync.get(['token', 'extensionStatus', 'categories']);
    if (!storage.token) return renderLoginPage();

    canOpenMenu = true;
    $('.header__burger').removeClass('disabled');

    const mainPage = await getPageTemplate('/popup/templates/main.html');
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

    if (!storage.extensionStatus) setButtonStatus(false);

    $(".turnblock__button").on("click", function () {
        chrome.storage.sync.get(['extensionStatus']).then(res => {
            chrome.storage.sync.set({ extensionStatus: !res.extensionStatus });
            setButtonStatus(!res.extensionStatus);
            chrome.action.setBadgeText({ text: !res.extensionStatus ? "ON" : "" });
        })
    });

    storage.categories.forEach(cat => {
        $(`input[data-category-id=${cat}]`).attr('checked', 'checked');
    });

    $(".settings__opener").on("click", function () {
        $('.settings').toggleClass('active');
    });
    $(".history__opener").on("click", function () {
        openInfoPage('history');
    });


    $(".settings__checkbox").change(function () {
        chrome.storage.sync.get(['categories']).then(res => {
            if (this.checked) {
                chrome.storage.sync.set({
                    categories: [
                        ...res.categories,
                        $(this).attr('data-category-id')
                    ]
                });
            } else {
                const currentCheckBoxId = $(this).attr('data-category-id')
                chrome.storage.sync.set({
                    categories: res.categories.filter(item => item != currentCheckBoxId)
                });
            }
        })
    });

    closeMenu();
    $('.menu__profile').text('Выйти');
    $('.menu__profile').attr('data-redirect-to', "logout");
}



async function start() {
    const storage = await chrome.storage.sync.get('token');

    if (storage.token) {
        const authPage = await getPageTemplate('/popup/templates/auth.html');
        $('.body').html(authPage);
    } else {
        updateEvents();
        $('.menu').addClass('active');
    }
}
start();


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


async function registerHandler() {
    try {
        $(`.form__input > .form__input-error`).text('');

        const email = $('input[name="email"]').val();
        const password = $('input[name="password"]').val();
        const passwordConfirm = $('input[name="password_confirm"]').val();

        const errors = registerFormValidator(email, password, passwordConfirm);
        if (Object.keys(errors).length) {
            throw { errors };
        }

        const response = await fetch(`${apiRoute}/auth/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password, password_confirm: passwordConfirm })
        });
        const data = await response.json();

        if (!response.ok) {
            throw data;
        }


        showNotification(data.message, 'success');
        return renderLoginPage();
    } catch (error) {
        errorHandler(error);
    }
}
async function loginHandler() {
    try {
        $(`.form__input > .form__input-error`).text('');

        const email = $('input[name="email"]').val();
        const password = $('input[name="password"]').val();

        const errors = loginFormValidator(email, password);
        if (Object.keys(errors).length) {
            throw { errors };
        }

        const response = await fetch(`${apiRoute}/auth/login`, {
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
            extensionStatus: true,
            categories: [],
            history: []
        });
        chrome.action.setBadgeText({ text: "ON" });

        return renderMainPage();
    } catch (error) {
        errorHandler(error)
    }
}
async function userConfirmationHandler() {
    try {
        $(`.form__input > .form__input-error`).text('');

        const storage = await chrome.storage.sync.get('token');
        if (!storage.token) return renderLoginPage();

        const password = $('input[name="password"]').val();

        const errors = confirmationFormValidator(password);
        if (Object.keys(errors).length) {
            throw { errors };
        }

        const response = await fetch(`${apiRoute}/auth/user_confirmation`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${storage.token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ password })
        });


        if (!response.ok) {
            if (response.status == 401) logoutHandler();
            throw await response.json();
        }

        return renderMainPage();
    } catch (error) {
        errorHandler(error);
    }
}
function logoutHandler() {
    chrome.storage.sync.clear();
    chrome.action.setBadgeText({ text: "" });
    return renderLoginPage();
}



function closeMenu() {
    $('.header__burger').removeClass('active');
    $('.menu').removeClass('active');
}



$(".header__burger").on("click", function () {
    if (canOpenMenu) {
        $(this).toggleClass('active');
        $('.menu').toggleClass('active');
    }
});
$(".menu__tab-opener").on("click", function () {
    const tabId = $(this).data('menu-tab-id');
    $(`#${tabId}`).addClass('active');
});





