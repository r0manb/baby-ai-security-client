const notification = (message, type = 'success') => {
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

export default notification;