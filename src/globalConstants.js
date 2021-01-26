export const SPLASH_SCREEN_VERSION = 3;

export const ANNOTATION_ELEMENTS = [
    // RP8 Syntax
    '.annnoteimage',
    '.annnoteline',
    '.annotation',
    '.ui-dialog',
    '.ui-dialog *',

    // RP9 Syntax
    '.annnote',
    '.annnote *'
];

export const NO_INTERACT_CLASS = 'no-interact';

export const NO_INTERACT_ELEMENTS = [
    'DimensionLineComponent',
    'DimensionMarkerComponent',
    NO_INTERACT_CLASS
];

export const TOOLTIP_VISIBLE_TIME = 750; // 750ms

// Mapped Keys
export const ENTER_KEY = 13;
export const ESCAPE_KEY = 27;
export const MINUS_KEY = 189;
export const PLUS_KEY = 187;

// Storage Keys
export const STORE_NAME = 'redlineTool';

export const STORE_ARTBOARD_WRAPPER_SHOWN = 'artboardWrapperShown';
export const STORE_DOCUMENT_ZOOM = 'redline-tool-document-zoom';
export const STORE_SPLASH_SCREEN = 'redline-tool-splash-screen';
export const STORE_TOOL_ENABLED = 'redline-tool-enabled';
