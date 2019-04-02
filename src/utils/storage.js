import store from 'store';

import {
    STORE_NAME,
    STORE_TOOL_ENABLED
} from '../globalConstants';

const readStore = () => store.get(STORE_NAME) || {};

export const storageWrite = (keyName, value) => {
    const currentStore = readStore();

    store.set(STORE_NAME, {
        ...currentStore,
        [keyName]: value
    });
};

/**
 * We switched to using the package 'store', but some users
 * may already have legacy cookies set. So to ensure they don't
 * see duplicate messages, we'll migrate them here.
 *
 * @param {String} keyName
 */
const migrateLegacyCookies = (keyName) => {
    const currentStore = readStore();

    const {
        cookie: cookieListString = ''
    } = document;

    const cookieList = cookieListString.split(';');

    const cookieObject = {};

    // If we don't already have the key in our store.
    if (!(keyName in currentStore)) {
        cookieList.forEach((cookie) => {
            if (cookie) {
                const [
                    cookieName,
                    cookieValue
                ] = cookie.split('=');

                cookieObject[cookieName.trim()] = cookieValue.trim();
            }
        });

        let value = cookieObject[keyName];

        if (value) {
            // Special case for tool enabled boolean.
            if (keyName === STORE_TOOL_ENABLED) {
                value = value === 'true';
            }

            storageWrite(keyName, value);
        }
    }
};

export const storageRead = (keyName) => {
    migrateLegacyCookies(keyName);

    const currentStore = readStore();

    return currentStore[keyName];
};
