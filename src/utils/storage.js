const addDays = (dayCount) => {
    const endDate = new Date(date);

    endDate.setDate(endDate.getDate() + dayCount);
    return endDate;
};

export const write = (keyName, value, expirationDays) => {
    document.cookie = `${keyName}=${value}; expires=${addDays(expirationDays)};`;
};

export const read = () => {

}
