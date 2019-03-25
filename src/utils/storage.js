const addDays = (dayCount) => {
    const endDate = new Date();

    endDate.setDate(endDate.getDate() + dayCount);

    return endDate;
};

export const storageWrite = (keyName, value, expirationDays) => {
    document.cookie = `${keyName}=${value}; expires=${addDays(expirationDays)};`;
};

export const storageRead = (keyName) => {
    const {
        cookie: cookieListString = ''
    } = document;

    const cookieList = cookieListString.split(';');

    const cookieObject = {};

    cookieList.forEach((cookie) => {
        if (cookie) {
            const [
                cookieName,
                cookieValue
            ] = cookie.split('=');

            cookieObject[cookieName.trim()] = cookieValue.trim();
        }
    });

    return cookieObject[keyName];
};
