/********************************************************************************/
/*                            Axure Redline Tool                                */
/*                                                                              */
/*                               Sean McQuay                                    */
/*                   www.seanmcquay.com/axure-redline-tool.htm                  */
/*                                                                              */
/*                                 V2.0.5                                       */
/********************************************************************************/

/**
 * These are placeholders for injected code during app
 * building. We use double quotes wrapped in a template
 * literal to force Babel to generate single quotes so that
 * we don't have to escape double quotes in the injected code.
 */
const pageHTML = `"Inject:HTML"`,
    pageCSS = `"Inject:CSS"`,
    jqueryURL = `<script src="https://code.jquery.com/jquery-3.2.1.min.js" integrity="sha256-hwg4gsxgFZhOsEEamdOYGBf13FyQuiTwlAQgxVSNgt4=" crossorigin="anonymous"></script>`,
    jqueryUI = `<script src="https://code.jquery.com/ui/1.12.0/jquery-ui.min.js" integrity="sha256-eGE6blurk5sHj+rmkfsGYeKyZx3M4bG+ZlFyA7Kns7E=" crossorigin="anonymous"></script>`,
    jqueryUITheme = `<link rel="stylesheet" type="text/css" href="https://code.jquery.com/ui/1.12.0/themes/smoothness/jquery-ui.css">`,
    fontURL = `<link href="https://fonts.googleapis.com/css?family=Lato:400,700" rel="stylesheet">`,
    jqueryMajorVersion = '3';

// Define the pseudo classes we'll be collecting for the element.
const pseudoClasses = {
    hover: {
        pseudoName: 'Hover',
        axureName: 'mouseOver',
        keyName: "hover"
    },
    mousedown: {
        pseudoName: 'MouseDown',
        axureName: 'mouseDown',
        keyName: 'mousedown'
    },
    disabled: {
        pseudoName: 'Disabled',
        axureName: 'disabled',
        keyName: "disabled"
    },
    default: {
        pseudoName: 'Default',
        axureName: '',
        keyName: "default"
    }
},
    rgbaReg = /rgb(a)?\(\d+,(\s+)?\d+,(\s+)?\d+(,(\s+)?\d(\.\d+)?)?\)/,
    hexReg = /#([a-fA-F]|\d){6}((\s+)?\d{1,3}%)?/;

let enableTool,                 // Boolean set true when the tool is enabled.
    hotkeyDepressed,            // Boolean set true when user is holding down hotkey.
    cssProperties,              // List of all CSS properties we will collect for each element.
    documentZoom,               // Page zoom. Used to scale artboard.
    previousZoom,               // Zoom tracker needed when we toggle zoom to capture true dimensions.
    zoomWrapperPadding,         // Default padding of 1000px on all sides around artboard.
    borderThickness,            // Used to set the thickness of all of our tracing lines.
    labelSpacing,               // Default offset to space dimension markers correctly.
    hoveredElement,             // Stores the current element over which the cursor is.
    selectedElement,            // Stores the latest element clicked - not counting redline elements.
    elemMeas,                   // Object containing scaled measurements of hovered element, used to position hover lines.
    elemSelectMeas,             // Object containing scaled measurements of clicked element, used to position selected element lines.
    interElemMeas,              // Object containing inter-element measurements.
    dimensionMarkerWidth,       // Stores the numerical value of the selected element width.
    dimensionMarkerHeight,      // Stores the numerical value of the selected element height.
    elementPosition,            // Stores the offset position of annotation icon, used to position annotation.
    selectedMeasurements,       // Stores the true, unscaled measurements of selected element.
    hoveredMeasurements,        // Stores the true, unscaled measurements of the hovered element.
    documentCSSList,            // A list of all CSS attributes for the entire document.
    elementCSS;                 // An object containing all CSS attributes and pseudo-class attributes.


// Establish values for globals.
enableTool = true;
hotkeyDepressed = false;
documentZoom = 100;
previousZoom = documentZoom;
zoomWrapperPadding = 1000;
borderThickness = 1;
labelSpacing = 5;
hoveredElement = '';
selectedElement = '';
elemMeas = {
    width: 0,
    height: 0,
    offsetTop: 0,
    offsetLeft: 0
};
elemSelectMeas = {
    width: 0,
    height: 0,
    offsetTop: 0,
    offsetLeft: 0
};
interElemMeas = {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    trueTop: 0,
    trueRight: 0,
    trueBottom: 0,
    trueLeft: 0
};
dimensionMarkerWidth = 0;
dimensionMarkerHeight = 0;
cssProperties = {
    'properties': {
        'width': '',
        'height': ''
    },
    'styles': {
        'background-color': '',
        'opacity': '',
        'outline': '',
        'border-top': '',
        'border-right': '',
        'border-bottom': '',
        'border-left': '',
        'border-top-style': '',
        'border-right-style': '',
        'border-bottom-style': '',
        'border-left-style': '',
        'border-top-width': '',
        'border-right-width': '',
        'border-bottom-width': '',
        'border-left-width': '',
        'border-top-color': '',
        'border-right-color': '',
        'border-bottom-color': '',
        'border-left-color': '',
        'border-style': '',
        'border-width': '',
        'border-color': '',
        'border-top-left-radius': '',
        'border': '',
        'border-top-right-radius': '',
        'border-bottom-right-radius': '',
        'border-bottom-left-radius': '',
        'border-radius': '',
        'box-shadow': ''
    },
    'text': {
        'font-family': '',
        'font-size': '',
        'font-weight': '',
        'line-height': '',
        'text-align': '',
        'color': '',
        '_content': ''
    }
};

/**
 * We begin by deploying our tool into the Axure environment
 * by writing HTML and CSS to the page. We also load our version
 * of jQuery and our font stack from Google.
 */
(function deployTool() {
    if (checkToolPermitted()) {
        document.write(fontURL + pageHTML + pageCSS);
        if (!window.jQuery || parseInt(jQuery.fn.jquery) != jqueryMajorVersion) {
            /**
             * Either the page doesn't have jQuery or the major
             * version isn't the latest. We also need to load
             * jQuery UI to deal with annotations.
             */
            document.write(jqueryURL + jqueryUI + jqueryUITheme);
            jQueryWait();
        } else {
            // Looks like jQuery is already on the page and up-to-date.
            onLoadFunction();
        }
    }
})();

/**
 * We keep checking back until jQuery has been loaded on
 * the page. Once it's loaded we check to make sure it's
 * at least the same major version as we're loading.
 */
function jQueryWait() {
    if (typeof jQuery == 'undefined') {
        setTimeout(() => {
            jQueryWait();
        }, 50);
    } else if (parseInt(jQuery.fn.jquery) != jqueryMajorVersion) {
        setTimeout(() => {
            jQueryWait();
        }, 50);
    } else {
        onLoadFunction();
    }
}

/**
 * This function first waits on the page to ensure all
 * elements have been loaded. It then goes about
 * initializing the redline tool. We don't use a listener
 * because we also might have to load jQuery on the page.
 */
function onLoadFunction() {
    // Check if the page load is complete.
    if (document.readyState !== 'complete') {
        setTimeout(() => {
            onLoadFunction();
        }, 50);
    } else {
        checkState();
        initTool();
        setSharingLinks();
        buildCSSAttributesList();
        // Last used V1.1.5 (14.4.18)
        //documentClone = $('body').clone(true);
        enableRedline();
        setZoom();
        bindListeners();
    }
}

/**
 * We first check to see if we're loading a dev
 * or business link. If it's business, we won't
 * permit the tool to load.
 */
function checkToolPermitted() {
    const pageURL = window.parent.location.href;

    return (/redline=business/).test(pageURL) ? false : true;
}


/**
 * This function builds out our sharing links for business
 * and developers.
 */
function setSharingLinks() {
    const pageURL = window.parent.location.href,
        disableAnnotations = 'fn=0',
        regexBaseURL = /^.*(\/|\.html)/;

    // Ensure we always select the PAGES tab.
    const selectHomePage = (pageURL) => {
        return pageURL.replace(/g=\d&/, 'g=1&');
    };

    // Extract our base URL up until last forward slash found or .html extension.
    const extractedBaseURL = () => {
        let extractedURL = '';

        try {
            extractedURL = pageURL.match(regexBaseURL)[0];
        } catch (err) {
            extractedURL = '';
        }

        return extractedURL;
    };

    let devURL = '',
        businessURL = '';

    devURL = pageURL.replace(extractedBaseURL(), `${extractedBaseURL()}?redline=dev`);
    businessURL = pageURL.replace(extractedBaseURL(), `${extractedBaseURL()}?redline=business`);

    businessURL = `${businessURL}&${disableAnnotations}`;

    $('.business-url').val(selectHomePage(businessURL));
    $('.dev-url').val(selectHomePage(devURL));
}

//*************************************************************************************************
//*                                   Check our cookies.                                          *
//*************************************************************************************************
function checkState() {
    let trackingCookie = getCookie('axure-tool-enabled'),
        zoomCookie = getCookie('axure-tool-zoom');

    if (trackingCookie != '' && trackingCookie == 1) {
        enableTool = true;
    } else if (trackingCookie != '' && trackingCookie == 0) {
        enableTool = false;
    } else {
        setCookie('axure-tool-enabled', '1', 1);
    }

    if (zoomCookie != '') {
        documentZoom = parseFloat(zoomCookie);

        // Set our previous zoom to 100%. This causes the artboard to center itself correctly.
        previousZoom = 100;
    }
}

//*************************************************************************************************
//*                                 Initialize our tool.                                          *
//*************************************************************************************************
function initTool() {
    let width = 0,
        height = 0,
        top = 0,
        left = 0,
        maxWidth = 0,
        maxHeight = 0,
        scrollWidthHidden = 0,
        scrollHeightHidden = 0,
        hiddenWidth = false,
        hiddenHeight = false,
        currentElement,
        parentElementHorizontal,
        parentElementVertical;

    labelInternalElements();

    $('.redline-layer').hide();
    $('.redline-tool-wrapper').show();
    $('#top-control-panel').show();
    $('#top-control-panel *').show();
    $('#redline-panel').show();
    $('#redline-panel *').show();

    $('#base').wrap('<div class="zoom-wrapper"></div>');
    $('#base').addClass('redline-layer');
    $('.zoom-wrapper').addClass('redline-layer');
    //*****First find max dimensions to wrap content.*****
    $('#base *').not('script, style').each(function () {
        currentElement = $(this);
        if (parentElementHorizontal === undefined && parentElementVertical === undefined) {
            parentElementHorizontal = currentElement;
            parentElementVertical = currentElement;
        }
        width = currentElement.outerWidth();
        height = currentElement.outerHeight();
        scrollWidthHidden = currentElement[0].scrollWidth;
        scrollHeightHidden = currentElement[0].scrollHeight;
        top = currentElement.offset().top;
        left = currentElement.offset().left;
        //*****Check if we're still within the parent containing horizontal-scrolling overflow.*****
        if (!$.contains(parentElementHorizontal[0], currentElement[0])) {
            hiddenWidth = false;
        }
        //*****Check if we're still within the parent containing vertical-scrolling overflow.*****
        if (!$.contains(parentElementVertical[0], currentElement[0])) {
            hiddenHeight = false;
        }
        //*****Check if we've found an element with horizontal-scrolling content.*****
        if (!hiddenWidth) {
            maxWidth = maxWidth < left + width ? left + width : maxWidth;
        } else if (currentElement.width() > maxWidth) {
            currentElement.addClass('redline-layer');
        }
        if (scrollWidthHidden > width && !hiddenWidth && width > 0) {
            hiddenWidth = true;
            parentElementHorizontal = currentElement;
        }
        //*****Check if we've found an element with vertical-scrolling content.*****
        if (!hiddenHeight) {
            if (maxHeight < top + height) {
                //console.log($(this).attr('id'));
            }
            maxHeight = maxHeight < top + height ? top + height : maxHeight;
        } else if (currentElement.height() > maxHeight) {
            currentElement.addClass('redline-layer');
        }
        if (scrollHeightHidden > height && !hiddenHeight && height > 0) {
            hiddenHeight = true;
            parentElementVertical = currentElement;
        }
    });
    //*****Manually size our containers due to absolutely-positioned children.*****
    $('.zoom-wrapper').attr('style', 'width:' + (maxWidth + (2 * zoomWrapperPadding)) + 'px !important;' + 'height:' + (maxHeight + (2 * zoomWrapperPadding)) + 'px !important;');
    $('#base').attr('style', `width: ${maxWidth}px !important; height: ${maxHeight}px !important;`);
    //*****If content has no background color, define as #FFFFFF.*****
    if ($('#base').css('background-color') == 'transparent' || $('#base').css('background-color').search(/rgba\(\d+,\s\d+,\s\d+,\s0\)/) >= 0) {
        $('#base').css('background-color', '#FFFFFF');
    }
    $(document).scrollTop(zoomWrapperPadding - (($(window).innerHeight() - maxHeight) / 2));
    $(document).scrollLeft(zoomWrapperPadding - (($(window).innerWidth() - maxWidth) / 2));
}

//*************************************************************************************************
//*                               Bind our event listeners.                                       *
//*************************************************************************************************
function bindListeners() {
    //*****Enable/Disable Redline Tool*****
    $('#top-control-panel').on('change', '.switch', function () {
        enableTool = $('.toggle-switch').prop('checked');
        enableRedline();
    });

    /**
    * Here we handle element hovers. We're binding event listeners
    * to every component. This is inefficient but we have to do
    * it this way so that we can block Axure's event listeners
    * when they bubble up.
    */
    $('#base *').on('mouseover', function (e) {
        if (enableTool && !hotkeyDepressed) {
            e.stopPropagation();
            elementHover($(this));
        }
    });

    /**
     * Here we handle element clicks. We're binding event listeners
     * to every component. This is inefficient but we have to do
     * it this way so that we can block Axure's event listeners
     * when they bubble up.
     */
    $('#base *').not('.annotation, .annnoteimage, .annnoteline').on('click', function (e) {
        if (enableTool && !hotkeyDepressed) {
            e.stopPropagation();
            e.preventDefault();
            elementClick($(this));
        } else if (hotkeyDepressed && e.target.nodeName.toLowerCase() === 'select') {
            /**
             * There is a bug in chrome where key presses are lost
             * when clicking on a select. To prevent the hotkeyDepressed
             * flag from sticking, we just trigger a reset. I think it's
             * better than sticking.
             */
            setTimeout(() => {
                hotkeyDepressed = false;
            }, 0);
        }
    });

    /**
     * This is used to capture and prevent mousedown and mouseup
     * events when the tool is enabled.
     */
    $('#base *').not('.annotation, .annnoteimage, .annnoteline').on('mousedown mouseup', (e) => {
        if (enableTool && !hotkeyDepressed) {
            e.stopPropagation();
            e.preventDefault();
        }
    });

    /**
     * If we click away from the artboard, we'll close the
     * redline panel.
     */
    $('.zoom-wrapper, #base').click(() => {
        closeRedline();
    });

    // Listen for our hotkey events.
    $('html').on('keydown', (e) => {
        if (!hotkeyDepressed) {
            if (e.metaKey || e.ctrlKey) {
                closeRedline();
                hotkeyDepressed = true;
            }
        }
    });
    $('html').on('keyup', () => {
        hotkeyDepressed = false;
    });

    //*****Element Scrolling*****
    $('#base *').on('scroll', function () {
        closeRedline();
    });

    //*****Open/Close Redline Panel*****
    $('#redline-panel').on('click', '#menu-tab-column > div', function (e) {
        e.stopImmediatePropagation();
        $('#redline-panel').toggleClass('redline-panel-exposed');
    });

    //*****Global Key Shortcuts*****
    $('html').on('keydown', function (e) {
        switch (e.keyCode) {
            case 27:
                closeRedline();
                break;
            case 187:
                if (e.ctrlKey || e.metKey) {
                    e.preventDefault();
                    documentZoom += 10;
                    setZoom();
                }
                break;
            case 189:
                if (e.ctrlKey || e.metKey) {
                    e.preventDefault();
                    documentZoom -= 10;
                    setZoom();
                }
                break;
        }
    });

    //*****Autoselect Redline Panel Content****
    $('.redline-tool-wrapper').on('mouseup', 'input, textarea', function () {
        $(this).select();
        document.execCommand('Copy');
        $(this).prev().find('.css-copied-tooltip').addClass('tooltip-active');
        $(this).parent().find('.link-copied-tooltip').addClass('tooltip-active');
        setTimeout(() => {
            $(this).prev().find('.css-copied-tooltip').removeClass('tooltip-active');
            $(this).parent().find('.link-copied-tooltip').removeClass('tooltip-active');
        }, 750);
    });

    //*****Handle Zoom Controls*****
    $('#top-control-panel').on('click', '.zoom-control-button', function () {
        clearRedline();
        getZoom();
        if ($(this).children().text() == '+') {
            documentZoom += 10;
        } else {
            documentZoom -= 10;
        }
        setZoom();
    });

    //*****Allow Zoom Input Value*****
    $('#top-control-panel').on('focus', '#zoom-value', function () {
        $(this).select();
    });

    //*****Toggle Color RGB/HEX*****
    $('#redline-panel').on('click', '.color-swatch', function () {
        let elemData = $(this).data('swatch').split('-'),
            fieldWrapper = elemData[0] + '-attributes',
            field = 'input';

        elemData.shift();
        elemData.forEach((splitAttribute) => {
            field += `-${splitAttribute}`;
        });

        $(`.${fieldWrapper} #${field}`).val(cycleColorFormat($(`.${fieldWrapper} #${field}`).val()));
    });

    //*****Pass Zoom Value Input*****
    $('#top-control-panel').on('blur keypress', '#zoom-value', function (e) {
        if (e.keyCode == 13) {
            $(this).blur();
            getZoom();
            setZoom();
        } else if (e.keyCode === undefined) {
            getZoom();
            setZoom();
        }

    });

    //*****Intercept Dialog Openings*****
    $(document).on('dialogopen', '*', function (e) {
        let dialogElement, tempZoom;
        e.stopImmediatePropagation();
        closeRedline();
        dialogElement = $(this);
        dialogElement.parent().find('.ui-button').html('<span class="ui-icon ui-icon-closethick">close</span>');
        tempZoom = documentZoom;
        documentZoom = 100;
        setZoom();
        dialogElement.parent().offset({ top: (elementPosition.top + 5), left: elementPosition.left });
        documentZoom = tempZoom;
        setZoom();
        preventDialogInteraction();
    });

    //*****Intercept Axure Dialog Nonsense*****
    /* This function intercepts the error    */
    /* thrown when we open a dialog after    */
    /* enabling and then disabling the       */
    /* redline tool while a dialog was open. */
    /* Yes, I know it looks strange...       */
    /*****************************************/
    $('#base .annotation').on('mousedown', '*', function (e) {
        let element, tempZoom;

        e.stopPropagation();
        tempZoom = documentZoom;
        documentZoom = 100;
        setZoom();

        // We're trying to find the annotation icon.
        if ($(this).hasClass('annnoteimage')) {
            element = $(this);
        } else if ($(this).hasClass('annnoteline')) {
            element = $(this).parent().parent().find('.annnoteimage');
        }

        elementPosition = element.offset();
        elementPosition.top += element.height();
        documentZoom = tempZoom;
        setZoom();
        try {
            $(this).trigger('click');
        } catch (err) {
            $(this).trigger('click');
        }
        $(this).trigger('click');

        /**
         * Because we have this weird double click function,
         * the dialog box would snap back to the annotation
         * icon if it had been dragged away, so we hide it
         * to prevent jank.
         */
        $('.ui-dialog').hide();
    });

    // Listen for tab changes on pseudo classes and switch between tabs.
    $('#redline-panel').on('click', '.pseudo-tabs .tab', function () {
        $('.active-tab').removeClass('active-tab');
        $(this).addClass('active-tab');
        $('.active-attributes').removeClass('active-attributes');
        $(`.pseudo-wrapper.${$(this).text()}-attributes`).addClass('active-attributes');
    });
}

/**
 * This function seeks out and flags all
 * elements which should not be part of the
 * redline tool interaction such as the UI
 * and dialog boxes.
 */
function labelInternalElements() {
    // Label all redline tool elements.
    $('.redline-tool-wrapper *').addClass('redline-layer');

    // Add no-interact classes where needed.
    $('.annotation, .annotation *').addClass('no-interact');
    preventDialogInteraction();
}

/**
 * This is a one-off function which is called
 * on tool load, and called every time a dialog
 * box is opened.
 */
function preventDialogInteraction() {
    $('.ui-dialog, .ui-dialog *').addClass('no-interact');
}

/**
 * This functions parses through the whole document.styleSheets
 * to create a lookup table for each element. We do it like this
 * so that we can capture pseudo classes which Axure actually
 * applies through JavaScript, not CSS.
 */
function buildCSSAttributesList() {
    const documentStyles = document.styleSheets;

    let selectorName,
        cssContent,
        pseudoFilter,
        matched,
        attributeObject;

    documentCSSList = {};

    // Iterate through list of stylesheets.
    for (let i in documentStyles) {
        try {
            // Iterate through list of rules.
            for (let j in documentStyles[i].cssRules) {
                // Iterate through our defined pseudo classes.
                matched = false;
                for (let pseudoClass in pseudoClasses) {
                    try {
                        if (!matched && RegExp(pseudoClasses[pseudoClass].axureName).test(documentStyles[i].cssRules[j].selectorText)) {
                            matched = true;
                            // Extract our "pure" selector name.
                            if (pseudoClasses[pseudoClass].axureName.length) {
                                pseudoFilter = new RegExp('\\.' + pseudoClasses[pseudoClass].axureName);
                                selectorName = documentStyles[i].cssRules[j].selectorText.replace(pseudoFilter, '').trim();
                            } else {
                                selectorName = documentStyles[i].cssRules[j].selectorText.trim();
                            }
                            cssContent = documentStyles[i].cssRules[j].cssText.replace(/^.*{/, '').replace('}', '').trim();
                            // Check if the selector exists yet.
                            if (!(selectorName in documentCSSList)) {
                                documentCSSList[selectorName] = {};
                            }
                            // Update our master CSS attributes list.
                            attributeObject = {};
                            // Convert our CSS list into an object.
                            cssContent.split(';').forEach((attribute) => {
                                if (attribute.length) {
                                    attributeObject[attribute.split(':')[0].trim()] = attribute.split(':')[1].trim();
                                }
                            })
                            documentCSSList[selectorName][pseudoClasses[pseudoClass].keyName] = attributeObject;
                        }
                    } catch (err) {
                        // Probably missing a key in the object.
                    }
                }
            }
        } catch (err) {
            // Probably missing a key in the object.
        }
    }
    console.log(documentCSSList);
}

//*************************************************************************************************
//*                             Enable or disable our tool.                                       *
//*************************************************************************************************
function enableRedline() {
    if (enableTool) {
        // Removed 20.2.18. Last in V1.1.4.
        //$('.zoom-wrapper').show();
        //$('.zoom-wrapper *').not('script, style').show();
        setZoom();
        $('.ui-dialog').remove();
        //$('*').not('.annotation, .annotation *').off();
        //bindListeners();

        // Keep intensive task from running until DOM manipulation is done.
        // Don't put a pointer on script or style tags or annotations.
        setTimeout(() => {
            $('.zoom-wrapper *').not('script, style, .annotation *').css('cursor', 'pointer');
        }, 0);

        $('.toggle-switch').prop('checked', true);
        setCookie('axure-tool-enabled', '1', 1);
    } else {
        setCookie('axure-tool-enabled', '0', 1);
        setTimeout(function () {
            // Last used V1.1.5 (14.4.18)
            /* $('html body').remove();
            $('html').append(documentClone.clone(true)); */
            $('.toggle-switch').prop('checked', false);
            //bindListeners();
            closeRedline();
            setZoom();
        }, 250);
    }
}

//*************************************************************************************************
//*                             Handle element hover actions.                                     *
//*************************************************************************************************
function elementHover(element) {
    if (enableTool) {
        hoveredElement = element;
        if (!isRedlineElement(hoveredElement) || hoveredElement.attr('id') == 'base') {
            clearRedline();
            setMeasurements();
            highlightHoverElement();
            //*****Check if we're hovering over our previously-selected element.*****
            if (hoveredElement[0] == selectedElement[0]) {
                highlightSelectElement();
            } else if (selectedElement != '') {
                measureInterElementDistance();
                drawInterElementMarkers();
            }
        } else if (!hoveredElement.hasClass('flicker-prevent')) {
            // Only clear our measurements if we're not hovering over them. Prevents flickering.
            clearRedline();
        }
    }
}

//*************************************************************************************************
//*                             Handle element click actions.                                     *
//*************************************************************************************************
function elementClick(element) {
    if (enableTool) {
        if (!isRedlineElement(element)) {
            selectedElement = element;
            clearRedline();
            setMeasurements();
            highlightSelectElement();
            updateRedlinePanel(selectedElement);
        }
    }
}

//*************************************************************************************************
//*              Ensure we aren't interacting with a redline-specific element.                    *
//*************************************************************************************************
function isRedlineElement(element) {

    // Removed 22 March 2018. Last in V1.1.4.
    /* let redlineStatus, annotationStatus;

    redlineStatus = element.attr('class') === undefined ? '' : element.attr('class');
    annotationStatus = element.attr('class') === undefined ? '' : element.attr('class');
    if (redlineStatus.search('redline-layer') == '-1' && annotationStatus.search(/ann(n)?ot/) == '-1' && annotationStatus.search('ui-dialog') == '-1') {
        return false;
    } else {
        return true;
    } */

    if (!element.hasClass('redline-layer') && !element.hasClass('no-interact')) {
        return false;
    } else {
        return true;
    }
}

//*************************************************************************************************
//*                  Highlight our hovered element and add extension lines.                       *
//*************************************************************************************************
function highlightHoverElement() {
    elemMeas.width = (hoveredElement.outerWidth() * (documentZoom / 100));
    elemMeas.height = (hoveredElement.outerHeight() * (documentZoom / 100));
    elemMeas.offsetTop = hoveredElement.offset().top;
    elemMeas.offsetLeft = hoveredElement.offset().left;
    $('.hover-layer').show();
    $('.hover-o-layer').show();
    $('#t-hover').width(elemMeas.width + borderThickness);
    $('#b-hover').width(elemMeas.width);
    $('#r-hover').height(elemMeas.height);
    $('#l-hover').height(elemMeas.height);

    $('#t-hover').offset({ top: elemMeas.offsetTop - borderThickness, left: elemMeas.offsetLeft - borderThickness });
    $('#b-hover').offset({ top: elemMeas.offsetTop + elemMeas.height, left: elemMeas.offsetLeft - borderThickness });
    $('#r-hover').offset({ top: elemMeas.offsetTop, left: elemMeas.offsetLeft + elemMeas.width });
    $('#l-hover').offset({ top: elemMeas.offsetTop, left: elemMeas.offsetLeft - borderThickness });

    $('#to-hover').width(($('#base').innerWidth() - (borderThickness * 2)) * (documentZoom / 100));
    $('#bo-hover').width(($('#base').innerWidth() - (borderThickness * 2)) * (documentZoom / 100));
    $('#ro-hover').height(($('#base').innerHeight() - (borderThickness * 2)) * (documentZoom / 100));
    $('#lo-hover').height(($('#base').innerHeight() - (borderThickness * 2)) * (documentZoom / 100));

    $('#to-hover').offset({ top: elemMeas.offsetTop - borderThickness, left: $('#base').offset().left });
    $('#bo-hover').offset({ top: elemMeas.offsetTop + elemMeas.height, left: $('#base').offset().left });
    $('#ro-hover').offset({ top: $('#base').offset().top, left: elemMeas.offsetLeft + elemMeas.width });
    $('#lo-hover').offset({ top: $('#base').offset().top, left: elemMeas.offsetLeft - borderThickness });
}

//*************************************************************************************************
//*                  Highlight our selected element and add extension lines.                      *
//*************************************************************************************************
function highlightSelectElement() {
    elemSelectMeas.width = (selectedElement.outerWidth() * (documentZoom / 100));
    elemSelectMeas.height = (selectedElement.outerHeight() * (documentZoom / 100));
    elemSelectMeas.offsetTop = selectedElement.offset().top;
    elemSelectMeas.offsetLeft = selectedElement.offset().left;
    $('.select-layer').show();
    $('#t-select').width(elemSelectMeas.width + borderThickness);
    $('#b-select').width(elemSelectMeas.width);
    $('#r-select').height(elemSelectMeas.height);
    $('#l-select').height(elemSelectMeas.height);

    $('#t-select').offset({ top: elemSelectMeas.offsetTop - borderThickness, left: elemSelectMeas.offsetLeft - borderThickness });
    $('#b-select').offset({ top: elemSelectMeas.offsetTop + elemSelectMeas.height, left: elemSelectMeas.offsetLeft - borderThickness });
    $('#r-select').offset({ top: elemSelectMeas.offsetTop, left: elemSelectMeas.offsetLeft + elemSelectMeas.width });
    $('#l-select').offset({ top: elemSelectMeas.offsetTop, left: elemSelectMeas.offsetLeft - borderThickness });

    $('#t-dimension').show();
    $('#r-dimension').show();
    $('#t-dimension > span').show();
    $('#r-dimension > span').show();
    dimensionMarkerWidth = $('.dimension-layer').width();
    dimensionMarkerHeight = $('.dimension-layer').height();
    $('#t-dimension > span').text(Math.round(selectedMeasurements.width));
    $('#r-dimension > span').text(Math.round(selectedMeasurements.height));

    $('#t-dimension').offset({ top: elemSelectMeas.offsetTop - dimensionMarkerHeight - labelSpacing, left: elemSelectMeas.offsetLeft + (elemSelectMeas.width / 2) - (dimensionMarkerWidth / 2) });
    $('#r-dimension').offset({ top: elemSelectMeas.offsetTop + (elemSelectMeas.height / 2) - (dimensionMarkerHeight / 2), left: elemSelectMeas.offsetLeft + elemSelectMeas.width + labelSpacing });
}

//*************************************************************************************************
//*             Measure distance between selected element to newly hovered element.               *
//*************************************************************************************************
function measureInterElementDistance() {
    $.each(interElemMeas, function (i) {
        interElemMeas[i] = 0;
    });

    if (elemMeas.offsetTop > elemSelectMeas.offsetTop + elemSelectMeas.height) {
        interElemMeas.bottom = Math.abs(elemSelectMeas.offsetTop + elemSelectMeas.height - elemMeas.offsetTop);
        interElemMeas.trueBottom = Math.abs(selectedMeasurements.offsetTop + selectedMeasurements.height - hoveredMeasurements.offsetTop);
    } else if (elemSelectMeas.offsetTop > elemMeas.offsetTop + elemMeas.height) {
        interElemMeas.top = Math.abs(elemMeas.offsetTop + elemMeas.height - elemSelectMeas.offsetTop);
        interElemMeas.trueTop = Math.abs(hoveredMeasurements.offsetTop + hoveredMeasurements.height - selectedMeasurements.offsetTop);
    } else if (elemSelectMeas.offsetTop > elemMeas.offsetTop && elemSelectMeas.offsetTop + elemSelectMeas.height > elemMeas.offsetTop + elemMeas.height) {
        interElemMeas.top = Math.abs(elemMeas.offsetTop - elemSelectMeas.offsetTop);
        interElemMeas.trueTop = Math.abs(hoveredMeasurements.offsetTop - selectedMeasurements.offsetTop);
    } else if (elemSelectMeas.offsetTop < elemMeas.offsetTop && elemSelectMeas.offsetTop + elemSelectMeas.height < elemMeas.offsetTop + elemMeas.height) {
        interElemMeas.bottom = Math.abs((elemMeas.offsetTop + elemMeas.height) - (elemSelectMeas.offsetTop + elemSelectMeas.height));
        interElemMeas.trueBottom = Math.abs((hoveredMeasurements.offsetTop + hoveredMeasurements.height) - (selectedMeasurements.offsetTop + selectedMeasurements.height));
    } else {
        interElemMeas.top = elemSelectMeas.offsetTop - elemMeas.offsetTop;
        interElemMeas.bottom = (elemMeas.offsetTop + elemMeas.height) - (elemSelectMeas.offsetTop + elemSelectMeas.height);
        interElemMeas.trueTop = selectedMeasurements.offsetTop - hoveredMeasurements.offsetTop;
        interElemMeas.trueBottom = (hoveredMeasurements.offsetTop + hoveredMeasurements.height) - (selectedMeasurements.offsetTop + selectedMeasurements.height);
    }

    if (elemSelectMeas.offsetLeft > elemMeas.offsetLeft + elemMeas.width) {
        interElemMeas.left = Math.abs(elemMeas.offsetLeft + elemMeas.width - elemSelectMeas.offsetLeft);
        interElemMeas.trueLeft = Math.abs(elemMeas.offsetLeft + hoveredMeasurements.width - selectedMeasurements.offsetLeft);
    } else if (elemMeas.offsetLeft > elemSelectMeas.offsetLeft + elemSelectMeas.width) {
        interElemMeas.right = Math.abs(elemSelectMeas.offsetLeft + elemSelectMeas.width - elemMeas.offsetLeft);
        interElemMeas.trueRight = Math.abs(selectedMeasurements.offsetLeft + selectedMeasurements.width - hoveredMeasurements.offsetLeft);
    } else if (elemSelectMeas.offsetLeft > elemMeas.offsetLeft && elemSelectMeas.offsetLeft + elemSelectMeas.width > elemMeas.offsetLeft + elemMeas.width) {
        interElemMeas.left = Math.abs(elemMeas.offsetLeft - elemSelectMeas.offsetLeft);
        interElemMeas.trueLeft = Math.abs(hoveredMeasurements.offsetLeft - selectedMeasurements.offsetLeft);
    } else if (elemSelectMeas.offsetLeft < elemMeas.offsetLeft && elemSelectMeas.offsetLeft + elemSelectMeas.width < elemMeas.offsetLeft + elemMeas.width) {
        interElemMeas.right = Math.abs((elemMeas.offsetLeft + elemMeas.width) - (elemSelectMeas.offsetLeft + elemSelectMeas.width));
        interElemMeas.trueRight = Math.abs((hoveredMeasurements.offsetLeft + hoveredMeasurements.width) - (selectedMeasurements.offsetLeft + selectedMeasurements.width));
    } else {
        interElemMeas.left = elemSelectMeas.offsetLeft - elemMeas.offsetLeft;
        interElemMeas.right = (elemMeas.offsetLeft + elemMeas.width) - (elemSelectMeas.offsetLeft + elemSelectMeas.width);
        interElemMeas.trueLeft = selectedMeasurements.offsetLeft - hoveredMeasurements.offsetLeft;
        interElemMeas.trueRight = (hoveredMeasurements.offsetLeft + hoveredMeasurements.width) - (selectedMeasurements.offsetLeft + selectedMeasurements.width);
    }
}

//*************************************************************************************************
//*                   Append our inter-element dimension lines and labels.                        *
//*************************************************************************************************
function drawInterElementMarkers() {
    dimensionMarkerWidth = $('.dimension-layer').width();
    dimensionMarkerHeight = $('.dimension-layer').height();

    $('.dimension-layer').hide();

    if (interElemMeas.top != 0) {
        $('#t-measure').show();
        $('#t-measure').height(Math.abs(interElemMeas.top) - borderThickness);
        if (interElemMeas.top > 0) {
            $('#t-measure').offset({ top: elemSelectMeas.offsetTop - interElemMeas.top, left: elemSelectMeas.offsetLeft + (elemSelectMeas.width / 2) });
        } else {
            $('#t-measure').offset({ top: elemSelectMeas.offsetTop, left: elemSelectMeas.offsetLeft + (elemSelectMeas.width / 2) });
        }
        $('#t-dimension').show();
        $('#t-dimension > span').show();
        $('#t-dimension > span').text(Math.round(Math.abs(interElemMeas.trueTop)));
        $('#t-dimension').offset({ top: elemSelectMeas.offsetTop - (interElemMeas.top / 2) - (dimensionMarkerHeight / 2), left: elemSelectMeas.offsetLeft + (elemSelectMeas.width / 2) + labelSpacing });
    }
    if (interElemMeas.right != 0) {
        $('#r-measure').show();
        $('#r-measure').width(Math.abs(interElemMeas.right) - borderThickness);
        if (interElemMeas.right > 0) {
            $('#r-measure').offset({ top: elemSelectMeas.offsetTop + (elemSelectMeas.height / 2), left: elemSelectMeas.offsetLeft + elemSelectMeas.width });
        } else {
            $('#r-measure').offset({ top: elemSelectMeas.offsetTop + (elemSelectMeas.height / 2), left: elemSelectMeas.offsetLeft + elemSelectMeas.width + interElemMeas.right });
        }

        $('#r-dimension').show();
        $('#r-dimension > span').show();
        $('#r-dimension > span').text(Math.round(Math.abs(interElemMeas.trueRight)));
        $('#r-dimension').offset({ top: elemSelectMeas.offsetTop + (elemSelectMeas.height / 2) - dimensionMarkerHeight - labelSpacing, left: elemSelectMeas.offsetLeft + elemSelectMeas.width + (interElemMeas.right / 2) - (dimensionMarkerWidth / 2) });
    }
    if (interElemMeas.bottom != 0) {
        $('#b-measure').show();
        $('#b-measure').height(Math.abs(interElemMeas.bottom) - borderThickness);
        if (interElemMeas.bottom > 0) {
            $('#b-measure').offset({ top: elemSelectMeas.offsetTop + elemSelectMeas.height, left: elemSelectMeas.offsetLeft + (elemSelectMeas.width / 2) });
        } else {
            $('#b-measure').offset({ top: elemSelectMeas.offsetTop + elemSelectMeas.height + interElemMeas.bottom, left: elemSelectMeas.offsetLeft + (elemSelectMeas.width / 2) });
        }

        $('#b-dimension').show();
        $('#b-dimension > span').show();
        $('#b-dimension > span').text(Math.round(Math.abs(interElemMeas.trueBottom)));
        $('#b-dimension').offset({ top: elemSelectMeas.offsetTop + elemSelectMeas.height + (interElemMeas.bottom / 2) - (dimensionMarkerHeight / 2), left: elemSelectMeas.offsetLeft + (elemSelectMeas.width / 2) + labelSpacing });
    }
    if (interElemMeas.left != 0) {
        $('#l-measure').show();
        $('#l-measure').width(Math.abs(interElemMeas.left) - borderThickness);
        if (interElemMeas.left > 0) {
            $('#l-measure').offset({ top: elemSelectMeas.offsetTop + (elemSelectMeas.height / 2), left: elemSelectMeas.offsetLeft - interElemMeas.left });
        } else {
            $('#l-measure').offset({ top: elemSelectMeas.offsetTop + (elemSelectMeas.height / 2), left: elemSelectMeas.offsetLeft });
        }

        $('#l-dimension').show();
        $('#l-dimension > span').show();
        $('#l-dimension > span').text(Math.round(Math.abs(interElemMeas.trueLeft)));
        $('#l-dimension').offset({ top: elemSelectMeas.offsetTop + (elemSelectMeas.height / 2) - dimensionMarkerHeight - labelSpacing, left: elemSelectMeas.offsetLeft - (interElemMeas.left / 2) - (dimensionMarkerWidth / 2) });
    }
}

//*************************************************************************************************
//*                                Update our redline spec panel.                                 *
//*************************************************************************************************
function updateRedlinePanel(element) {
    elementCSS = {};

    if (element[0].id.length && documentCSSList['#' + element[0].id] !== undefined) {
        for (let pseudoClass in pseudoClasses) {
            // We will only create keys for pseudo classes that have attributes.
            if (pseudoClasses[pseudoClass].keyName in documentCSSList['#' + element[0].id]) {
                // Check if the key yet exists.
                if (!(pseudoClasses[pseudoClass].keyName in elementCSS)) {
                    elementCSS[pseudoClasses[pseudoClass].keyName] = {};
                }
                elementCSS[pseudoClasses[pseudoClass].keyName] = JSON.parse(JSON.stringify(compileElementCSS(element, pseudoClasses[pseudoClass])));
            }
        }
    } else {
        elementCSS['default'] = JSON.parse(JSON.stringify(compileElementCSS(element, pseudoClasses.default)));
    }

    console.log(elementCSS);
    clearRedlinePanel();
    appendRedlinePanel();
    $('#redline-panel').addClass('redline-panel-exposed');
}

/**
 *
 * @param element Our targetted element.
 * @param pseudoClass The specific pseudo class we're targetting.
 *
 * This function takes in a targetted element and a pseudo class
 * object and attempts to compile attributes. Once compiled, they
 * are cleaned in preparation for displaying.
 */
function compileElementCSS(element, pseudoClass) {
    let tempCSSProperties = JSON.parse(JSON.stringify(cssProperties)),
        propMatch,
        tempElementCSS,
        tempCompiledCSS;

    if (pseudoClass.keyName === 'default') {
        // Fetch our default properties directly from element CSS.
        $.each(tempCSSProperties, (i) => {
            $.each(tempCSSProperties[i], (_i) => {
                if (_i == '_content') {
                    tempCSSProperties[i][_i] = element.text().trim();
                } else {
                    // Perform a quick check to see if we're on the opacity attribute.
                    if (_i === 'opacity') {
                        /**
                         * Opacity is actually set on the parent wrapper
                         * element i.e. "u1" but we can never click on
                         * this element. We actually click on u1_div. This
                         * acts as the parent but we wouldn't get the right
                         * opacity so we have to step up one element.
                         */
                        if ((/u\d+_div/).test(element.attr('id'))) {
                            tempElementCSS = element.parent().css(_i).replace(/rgba\(\d+,\s\d+,\s\d+,\s0\)/, 'transparent');
                        } else {
                            tempElementCSS = element.css(_i).replace(/rgba\(\d+,\s\d+,\s\d+,\s0\)/, 'transparent');
                        }
                    } else {
                        tempElementCSS = element.css(_i).replace(/rgba\(\d+,\s\d+,\s\d+,\s0\)/, 'transparent');
                    }
                    //tempElementCSS = element.css(_i).replace(/rgba\(\d+,\s\d+,\s\d+,\s0\)/, 'transparent');
                    try {
                        tempCompiledCSS = documentCSSList['#' + element[0].id][pseudoClass.keyName][_i].replace(/rgba\(\d+,\s\d+,\s\d+,\s0\)/, 'transparent');
                    } catch (err) {
                        tempCompiledCSS = '';
                    }

                    /**
                     * We check to see if there is a default attribute value
                     * because it might be being overwritten by a pseudo class.
                     */
                    if (tempCompiledCSS.length) {
                        tempCSSProperties[i][_i] = tempCompiledCSS;
                    } else {
                        tempCSSProperties[i][_i] = tempElementCSS;
                    }
                }
            });
        });
    } else {
        // Fetch pseudo class properties from our compiled attribute list.
        $.each(tempCSSProperties, (i) => {
            $.each(tempCSSProperties[i], (_i) => {
                if (_i == '_content') {
                    tempCSSProperties[i][_i] = element.text().trim();
                } else {
                    // The key may not even exist, so watch for errors.
                    try {
                        tempCSSProperties[i][_i] = documentCSSList['#' + element[0].id][pseudoClass.keyName][_i].replace(/rgba\(\d+,\s\d+,\s\d+,\s0\)/, 'transparent');
                    } catch (err) {
                        tempCSSProperties[i][_i] = '';
                    }
                }
            });
        });
    }

    //*****Concat granular values to shorthand and clear.*****
    tempCSSProperties['styles']['border-top'] = tempCSSProperties['styles']['border-top-style'] + ' ' + tempCSSProperties['styles']['border-top-width'] + ' ' + tempCSSProperties['styles']['border-top-color'];
    tempCSSProperties['styles']['border-right'] = tempCSSProperties['styles']['border-right-style'] + ' ' + tempCSSProperties['styles']['border-right-width'] + ' ' + tempCSSProperties['styles']['border-right-color'];
    tempCSSProperties['styles']['border-bottom'] = tempCSSProperties['styles']['border-bottom-style'] + ' ' + tempCSSProperties['styles']['border-bottom-width'] + ' ' + tempCSSProperties['styles']['border-bottom-color'];
    tempCSSProperties['styles']['border-left'] = tempCSSProperties['styles']['border-left-style'] + ' ' + tempCSSProperties['styles']['border-left-width'] + ' ' + tempCSSProperties['styles']['border-left-color'];
    tempCSSProperties['styles']['border-top-style'] = '';
    tempCSSProperties['styles']['border-right-style'] = '';
    tempCSSProperties['styles']['border-bottom-style'] = '';
    tempCSSProperties['styles']['border-left-style'] = '';
    tempCSSProperties['styles']['border-top-width'] = '';
    tempCSSProperties['styles']['border-right-width'] = '';
    tempCSSProperties['styles']['border-bottom-width'] = '';
    tempCSSProperties['styles']['border-left-width'] = '';
    tempCSSProperties['styles']['border-top-color'] = '';
    tempCSSProperties['styles']['border-right-color'] = '';
    tempCSSProperties['styles']['border-bottom-color'] = '';
    tempCSSProperties['styles']['border-left-color'] = '';

    //*****Clear our border attribute tags because we'll populate them later.*****
    tempCSSProperties['styles']['border-style'] = '';
    tempCSSProperties['styles']['border-width'] = '';
    tempCSSProperties['styles']['border-color'] = '';

    //*****Check if we have matching border attributes and consolidate.*****
    propMatch = tempCSSProperties['styles']['border-top'];
    if (propMatch != '' && propMatch == tempCSSProperties['styles']['border-right'] && propMatch == tempCSSProperties['styles']['border-bottom'] && propMatch == tempCSSProperties['styles']['border-left']) {
        tempCSSProperties['styles']['border-top'] = '';
        tempCSSProperties['styles']['border-right'] = '';
        tempCSSProperties['styles']['border-bottom'] = '';
        tempCSSProperties['styles']['border-left'] = '';

        tempCSSProperties['styles']['border-style'] = selectedElement.css('border-top-style');
        if (tempCSSProperties['styles']['border-style'] != 'none') {
            tempCSSProperties['styles']['border-width'] = selectedElement.css('border-top-width');
            tempCSSProperties['styles']['border-color'] = selectedElement.css('border-top-color');
            tempCSSProperties['styles']['border'] = tempCSSProperties['styles']['border-style'] + ' ' + tempCSSProperties['styles']['border-width'] + ' ' + tempCSSProperties['styles']['border-color'];
        }
    } else {
        tempCSSProperties['styles']['border-style'] = '';
        tempCSSProperties['styles']['border-width'] = '';
        tempCSSProperties['styles']['border-color'] = '';
    }

    //*****Check if we have matching border-radius attributes and consolidate.*****
    propMatch = tempCSSProperties['styles']['border-top-left-radius'];
    if (propMatch != '' && propMatch == tempCSSProperties['styles']['border-top-right-radius'] && propMatch == tempCSSProperties['styles']['border-bottom-right-radius'] && propMatch == tempCSSProperties['styles']['border-bottom-left-radius']) {
        tempCSSProperties['styles']['border-radius'] = tempCSSProperties['styles']['border-top-right-radius'];

        tempCSSProperties['styles']['border-top-left-radius'] = '';
        tempCSSProperties['styles']['border-top-right-radius'] = '';
        tempCSSProperties['styles']['border-bottom-right-radius'] = '';
        tempCSSProperties['styles']['border-bottom-left-radius'] = '';
    }

    //*****Clean up our font family attributes.*****
    tempCSSProperties['text']['font-family'] = tempCSSProperties['text']['font-family'].replace('"', '').split(',')[0];

    return tempCSSProperties;
}


//*************************************************************************************************
//*                                Append each property section.                                  *
//*************************************************************************************************
function appendRedlinePanel() {
    const copyDialogText = 'copied';

    let swatch,
        parentLabel,
        measuredCSSAttributes,
        measuredCSSValues,
        cssBlockProperties,
        rgbaExtraction;

    // Check if the component has a label.
    parentLabel = extractParentName();

    if (parentLabel.length) {
        $('#redline-panel-menu-column').append(`<div class="redline-layer component-name-wrapper"><p class="redline-layer">parent component name:<span class="css-copied-tooltip">${copyDialogText}</span></p><input class="redline-layer" value="${parentLabel}" readonly="readonly"></div>`);
    }

    // Create a wrapper for our pseudo class tabs.
    $('#redline-panel-menu-column').append(`<div class="pseudo-tabs redline-layer"></div>`);

    $.each(elementCSS, (pseudoClass) => {
        // Apply each of our pseudo tabs as we discover them.
        $('.pseudo-tabs').append(`<div class="${pseudoClass} tab redline-layer${pseudoClass === 'default' ? ' active-tab' : ''}"><span class="redline-layer">${pseudoClass}</span></div>`);
        // Append a wrapper for each pseudo class attributes.
        $('#redline-panel-menu-column').append(`<div class="redline-layer pseudo-wrapper ${pseudoClass}-attributes ${pseudoClass === 'default' ? 'active-attributes' : ''}"></div>`);

        $.each(elementCSS[pseudoClass], (i) => {
            $('.pseudo-wrapper:last').append('<div class="redline-layer redline-panel-section"></div>');
            $('.redline-panel-section:last').append('<b class="redline-layer"><p class="redline-layer">' + i.toUpperCase() + '</p></b>');
            $.each(elementCSS[pseudoClass][i], (_i, _value) => {
                if (isValidAttribute(_i, _value)) {
                    //*****Check if we need to add a color swatch.*****
                    if ((rgbaReg).test(_value) && _value != 'transparent') {
                        let swatchOpacity,
                            swatchColor;

                        /**
                         * If we have RGBA, we round our opacity to two decimals of
                         * precision. If the opacity is 1, we'll convert to RGB.
                         */
                        if ((/rgba/).test(_value)) {
                            // Extract our RGBA substring.
                            rgbaExtraction = _value.match(rgbaReg)[0].replace(' ', '');

                            swatchOpacity = Math.round(Number(rgbaExtraction.replace(/rgba\(\d+,\d+,\d+,(\d?(\.\d+)?)\)/, '$1')) * 100) / 100;
                            swatchColor = rgbaExtraction.replace(/rgba\((\d+),(\d+),(\d+),(\d?(\.\d+)?)\)/, `rgba($1, $2, $3, !*!)`);

                            swatchColor = swatchColor.replace('!*!', swatchOpacity);

                            /**
                             * If our RGBA opacity is 1, then let's just convert
                             * things to RGB.
                             */
                            if (swatchOpacity == 1) {
                                swatchColor = rgbaExtraction.replace(/rgba\((\d+),(\d+),(\d+),(\d?(\.\d+)?)\)/, `rgb($1, $2, $3)`);
                            }
                            _value = _value.replace(rgbaReg, swatchColor);
                        } else {
                            swatchColor = _value.match(rgbaReg)[0];
                        }

                        swatch = `<span class="redline-layer color-swatch" data-swatch="${pseudoClass}-${_i.replace('_', '')}" style="background-color: ${swatchColor};"></span>`
                    } else {
                        swatch = '';
                    }
                    //$('.redline-panel-section:last').append('<p class="redline-layer">' + _i.replace('_', '') + ':' + swatch + '</p>');
                    $('.redline-panel-section:last').append(`<p class="redline-layer">${_i.replace('_', '')}:${swatch}<span class="css-copied-tooltip">${copyDialogText}</span></p>`);
                    if (_i != '_content') {
                        $('.redline-panel-section:last').append('<input class="redline-layer" id="input-' + _i.replace('_', '') + '" value="' + _value + '" readonly="readonly"></input>');
                    } else {
                        $('.redline-panel-section:last').append('<textarea class="redline-layer" readonly="readonly"></textarea>');
                        $('.redline-panel-section textarea').text(_value);
                    }
                }
            });
            //*****Remove any sections without CSS properties.*****
            if ($('.redline-panel-section:last p').length <= 1) {
                $('.redline-panel-section:last').remove();
            }

        });
        //*****Remove a few items based on special queries.*****
        if (elementCSS.default['text']['_content'].length < 1) {
            $('p:contains("TEXT")').parent().parent().remove();
        }
        if (elementCSS.default['styles']['border-top-width'] == '0px') {
            $('p:contains("border-color")').next().remove();
            $('p:contains("border-color")').remove();
        }

        measuredCSSAttributes = [];
        measuredCSSValues = [];

        // Iterate through displayed values.
        $('.pseudo-wrapper:last .redline-panel-section').each(function () {
            $(this).children('p').each((_index, _element) => {
                measuredCSSAttributes.push(_element.innerText.trim());
            });
            $(this).children('input').each((_index, _element) => {
                measuredCSSValues.push(_element.value.trim());
            });
        });

        // Strip out any text content we might have captured.
        measuredCSSAttributes = measuredCSSAttributes.filter(attribute => attribute !== 'content:');

        // If we actually have attributes to display, prepare the block of attributes.
        if (measuredCSSAttributes.length && measuredCSSAttributes.length === measuredCSSValues.length) {
            cssBlockProperties = '';
            measuredCSSAttributes.forEach((value, index) => {
                cssBlockProperties += `${measuredCSSAttributes[index]} ${cycleColorFormat(measuredCSSValues[index], true)};\n`;
            });
            cssBlockProperties = cssBlockProperties.replace(/\n$/, '').replace(copyDialogText, '');

            // Add our textarea and required labels.
            $('.pseudo-wrapper:last').append('<div class="redline-layer redline-panel-section"></div>');
            $('.redline-panel-section:last').append('<b class="redline-layer"><p class="redline-layer">CSS BLOCK ATTRIBUTES</p></b>');
            $('.redline-panel-section:last').append(`<p class="redline-layer">properties:<span class="css-copied-tooltip">${copyDialogText}</span></p>`);
            $('.redline-panel-section:last').append('<textarea class="redline-layer" readonly="readonly"></textarea>');
            $('.redline-panel-section:last textarea').text(cssBlockProperties);
        }
    });
}

/**
 * Here we check to see if the attribute we're about
 * to write out is something valid.
 */
function isValidAttribute(attribute, value) {
    let isValid = false;

    if (value !== undefined
        && value.length > 0
        && value.indexOf('none') < 0
        && value != '0px'
        && value !== 'medium'
        && !((/initial/).test(value))
        && !(attribute === 'opacity' && Number(value) == 1)) {
        isValid = true;
    }

    return isValid;
}

//*************************************************************************************************
//*                       Strip all redline-specific elements from page.                          *
//*************************************************************************************************
function clearRedline() {
    $('.hover-layer').hide();
    $('.hover-o-layer').hide();
    $('.dimension-layer').hide();
    $('.measure-layer').hide();
}

//*************************************************************************************************
//*                              Handle 'click-aways' on page.                                    *
//*************************************************************************************************
function closeRedline() {
    clearRedline();
    $('.select-layer').hide();
    $('#redline-panel').removeClass('redline-panel-exposed');
    selectedElement = '';
    clearRedlinePanel();
}

//*************************************************************************************************
//*                           Clear all content in redline panel.                                 *
//*************************************************************************************************
function clearRedlinePanel() {
    $('#redline-panel-menu-column > *').remove();
}

//*************************************************************************************************
//*                             Find the deepest child element.                                   *
//*************************************************************************************************

// Removed 20.2.18. Last used in V1.1.4.

/*function findDeepestChild(element) {
    let current = element;
    while (current.children().length > 1) {
        current = current.children();
    }
    return current;
}*/

//*************************************************************************************************
//*                      Set a tracking cookie for tool enabled/disabled.                         *
//*************************************************************************************************
function setCookie(cname, cvalue, exdays) {
    let d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
}

//*************************************************************************************************
//*                                     Read cookies.                                             *
//*************************************************************************************************
function getCookie(cname) {
    let name = cname + "=";
    let ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return '';
}

//*************************************************************************************************
//*                                    Set zoom level.                                            *
//*************************************************************************************************
function setZoom(measurementToggle = false) {
    const zoomWidth = $('.zoom-wrapper #base').width(),
        zoomHeight = $('.zoom-wrapper #base').height(),
        bodyScrollTop = $('body').scrollTop() === 0 ? $('html').scrollTop() : $('body').scrollTop(),
        bodyScrollLeft = $('body').scrollLeft() === 0 ? $('html').scrollLeft() : $('body').scrollLeft();

    documentZoom = documentZoom <= 0 ? 1 : documentZoom;
    $('#zoom-value').val(documentZoom + '%');
    $('.zoom-wrapper #base').css('transform', `scale(${documentZoom / 100})`);

    // Only redraw if we're not toggling for a true measurement.
    if (!measurementToggle) {

        // Resize our scrollable area when zooming.
        $('.zoom-wrapper').attr('style', `width: ${(zoomWidth * (documentZoom / 100)) + (zoomWrapperPadding * 2)}px !important; height: ${(zoomHeight * (documentZoom / 100)) + (zoomWrapperPadding * 2)}px !important;`);

        // Adjust our scrolling to compensate for zooming.
        $('html, body').scrollTop(bodyScrollTop + ((((zoomHeight) * (documentZoom / 100)) - (zoomHeight * (previousZoom / 100))) / 2));
        $('html, body').scrollLeft(bodyScrollLeft + ((((zoomWidth) * (documentZoom / 100)) - (zoomWidth * (previousZoom / 100))) / 2));

        // Reselect any highlighted element.
        if (selectedElement) {
            highlightSelectElement();
        }
    }
    previousZoom = documentZoom;
    setCookie('axure-tool-zoom', documentZoom, 1);
}

//*************************************************************************************************
//*                                    Read zoom level.                                           *
//*************************************************************************************************
function getZoom() {
    documentZoom = parseInt($('#zoom-value').val());
}

//*************************************************************************************************
//*                          Cycle through available color formats.                               *
//*************************************************************************************************
function cycleColorFormat(colorValue, preserveValidOpacity = false) {
    let newFormat = '',
        colorArr,
        opacity,
        valueTemplate = '';

    if ((rgbaReg).test(colorValue)) {
        valueTemplate = colorValue.replace(rgbaReg, '!*!');
        colorValue = colorValue.match(rgbaReg)[0];
    } else if ((hexReg).test(colorValue)) {
        valueTemplate = colorValue.replace(hexReg, '!*!');
        colorValue = colorValue.match(hexReg)[0];
    } else {
        // If we end up not passing a color at all.
        valueTemplate = colorValue;
    }

    switch (true) {
        case /rgba/.test(colorValue) && !preserveValidOpacity:
            colorArr = colorValue.match(/(\d\.\d+)|\d+/g);
            newFormat = '#';
            for (let i = 0; i < 3; i++) {
                newFormat += ('0' + Number(colorArr[i]).toString(16).toUpperCase()).slice(-2);
            }
            newFormat += ` ${Number(colorArr[3]) * 100}%`;
            break;
        case /rgba/.test(colorValue) && preserveValidOpacity:
            newFormat = colorValue;
            break;
        case /%/.test(colorValue):
            colorArr = colorValue.replace('#', '').slice(0, 6).match(/\w{2}/g);
            opacity = Number(colorValue.replace(/#\w{6}\s/, '').replace('%', '')) / 100;
            newFormat = `rgba(${parseInt(colorArr[0], 16)}, ${parseInt(colorArr[1], 16)}, ${parseInt(colorArr[2], 16)}, ${opacity})`;
            break;
        case /rgb\(/.test(colorValue):
            colorArr = colorValue.replace(',', '').match(/\d+/g);
            newFormat = '#';
            colorArr.forEach((color) => {
                newFormat += ('0' + Number(color).toString(16).toUpperCase()).slice(-2);
            });
            break;
        case /#/.test(colorValue):
            colorArr = colorValue.replace('#', '').match(/\w{2}/g);
            newFormat = `rgb(${parseInt(colorArr[0], 16)}, ${parseInt(colorArr[1], 16)}, ${parseInt(colorArr[2], 16)})`;
            break;
    }
    return (valueTemplate.replace('!*!', newFormat));
}

//*************************************************************************************************
//*                      Toggle zoom to 100% and record measurements.                             *
//*************************************************************************************************
function setMeasurements() {
    const tempZoom = documentZoom;

    documentZoom = 100;
    setZoom(true);
    try {
        selectedMeasurements = {
            width: selectedElement.width(),
            height: selectedElement.height(),
            offsetTop: selectedElement.offset().top,
            offsetLeft: selectedElement.offset().left
        };
    } catch (err) {
        selectedMeasurements = {
            width: 0,
            height: 0,
            offsetTop: 0,
            offsetLeft: 0
        };
    }
    try {
        hoveredMeasurements = {
            width: hoveredElement.width(),
            height: hoveredElement.height(),
            offsetTop: hoveredElement.offset().top,
            offsetLeft: hoveredElement.offset().left
        };
    } catch (err) {
        hoveredMeasurements = {
            width: 0,
            height: 0,
            offsetTop: 0,
            offsetLeft: 0
        };
    }
    documentZoom = tempZoom;
    setZoom(true);
}

/**
 * This function steps up until it discovers the
 * bouding parent component name, set in Axure.
 */
function extractParentName() {
    let componentLabel = '',
        cycleEnd = false,
        currentElement = selectedElement;

    while (!cycleEnd) {
        try {
            if (currentElement.data('label')) {
                componentLabel = currentElement.data('label').trim();
                cycleEnd = true;
            } else if (currentElement.attr('id') === 'base') {
                cycleEnd = true;
            } else {
                currentElement = currentElement.parent();
            }
        } catch (err) {
            cycleEnd = true;
        }
    }
    return (componentLabel);
}
