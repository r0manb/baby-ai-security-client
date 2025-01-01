const MONTHS = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря']

const addStartZero = (num) => {
    if (num > 9) return num;
    return `0${num}`;
}

export const isThisYear = (date) =>
    (new Date(date)).getFullYear() == (new Date()).getFullYear()

export const isYesterday = (date) => {
    const copyDate = new Date(date);
    const yesterday = new Date();

    yesterday.setDate(yesterday.getDate() - 1);

    return copyDate.setHours(0, 0, 0, 0) == yesterday.setHours(0, 0, 0, 0);
}

export const isToday = (date) =>
    (new Date(date)).setHours(0, 0, 0, 0) == (new Date()).setHours(0, 0, 0, 0);


export const formatDateAndTime = (date, fullMonth = false) => {
    let secondPart;
    const workDate = new Date(date);
    const year = !isThisYear(date) ? ` ${workDate.getFullYear()}` : '';

    if (isToday(date)) secondPart = 'Сегодня';
    else if (isThisYear(date) && isYesterday(date)) secondPart = 'Вчера';
    else {
        secondPart = `${workDate.getDate()} ${fullMonth ? MONTHS[workDate.getMonth()] : MONTHS[workDate.getMonth()].substr(0, 3)}`;
    }

    return `${workDate.getHours()}:${addStartZero(workDate.getMinutes())}, ${secondPart}${year}`;
}