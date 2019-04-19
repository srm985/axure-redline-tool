import $ from 'jquery';

import {
    ANNOTATION_ELEMENTS,
    NO_INTERACT_CLASS
} from '../globalConstants';

export const initNoInteract = () => {
    $(ANNOTATION_ELEMENTS.join(', ')).addClass(NO_INTERACT_CLASS);
};

/**
 * Here we handle element hovers. We're binding event listeners
 * to every component. This is inefficient but we have to do
 * it this way so that we can block Axure's event listeners
 * before they bubble up.
 *
 * @param {function} callback
 */
export const addGlobalMouseoverListener = (callback) => {
    $('#base, #base *').not(ANNOTATION_ELEMENTS.join(', ')).on('mouseover', (event) => {
        callback(event);
    });
};

/**
 * Here we handle element clicks. We're binding event listeners to every
 * component. This is inefficient but we have to do it this way so that
 * we can block Axure's event listeners before they bubble up.
 *
 * @param {function} callback
 */
export const addGlobalClickListener = (callback) => {
    $('body, #base *').not(ANNOTATION_ELEMENTS.join(', ')).on('click', (event) => {
        callback(event);
    });
};

/**
 * This is used to capture and prevent mousedown and mouseup events when the
 * tool is enabled.
 *
 * @param {function} callback
 */
export const addGlobalMouseToggleListener = (callback) => {
    $('#base *').not(ANNOTATION_ELEMENTS.join(', ')).on('mousedown mouseup', (event) => {
        callback(event);
    });
};

/**
 * Here we listen for any dialog open events. These occur when users click on
 * the default Axure notes. For some reason, 'dialogopen' listener isn't firing.
 *
 * @param {function} callback
 */
export const addDialogOpenListener = (callback) => {
    $(ANNOTATION_ELEMENTS.join(', ')).on('click', (event) => {
        $('#base .ui-dialog').appendTo('.ArtboardModule');
        $('.notesDialog').appendTo('.ArtboardModule');
        initNoInteract();

        callback(event);
    });
};

/**
 * Here we listen for a keypress of our defined hotkeys. These keys disable the
 * redline tool and all direct interaction with Axure elements while the key
 * is depressed.
 *
 * @param {function} callback
 */
export const addHotkeyListener = (callback) => {
    $('html').on('keydown', (event) => {
        if (event.metaKey || event.ctrlKey) {
            callback(true);
        }
    });

    $('html').on('keyup', () => {
        callback(false);
    });
};

/**
 * Here we listener for zoom key combinations used to scale the artboard
 * content larger or smaller.
 *
 * @param {function} callback
 */
export const addGlobalZoomListener = (callback) => {
    $('html').on('keydown', (event) => {
        callback(event);
    });
};
