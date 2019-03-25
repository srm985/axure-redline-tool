// Add grid constants here.
const BOOTSTRAP4 = 'BOOTSTRAP_4';

// Grid constants are added to this array for our dropdown menu.
export const GRID_OPTIONS = [
    BOOTSTRAP4
];

// This object allows us to apply a vanity name to our object keys.
export const GRID_OPTION_VANITY = {
    [BOOTSTRAP4]: 'Bootstrap 4'
};

export const gridLayouts = {
    [BOOTSTRAP4]: {
        breakpoints: [
            {
                maxWidth: 540,
                viewportWidth: 576
            }, {
                maxWidth: 720,
                viewportWidth: 768
            }, {
                maxWidth: 960,
                viewportWidth: 992
            }, {
                maxWidth: 1140,
                viewportWidth: 1200
            }
        ],
        columns: 12,
        gutterWidth: 30
    }
};
