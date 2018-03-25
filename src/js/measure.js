/********************************************************************************/
/*                            Axure Redline Tool                                */
/*                                                                              */
/*                               Sean McQuay                                    */
/*                   www.seanmcquay.com/axure-redline-tool.htm                  */
/*                                                                              */
/*                                 V1.1.4                                       */
/********************************************************************************/


// Define the pseudo classes we'll be collecting for the element.
const pseudoClasses = {
    hover: {
        pseudoName: 'Hover',
        axureName: 'mouseOver',
        keyName: "hover"
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
};

let enableTool = true,
    documentZoom = 100,
    previousZoom = documentZoom,
    zoomWrapperPadding = 1000,
    borderThickness = 1,
    labelSpacing = 5,
    hoveredElement = '',
    selectedElement = '',
    elemMeas = { width: 0, height: 0, offsetTop: 0, offsetLeft: 0 },
    elemSelectMeas = { width: 0, height: 0, offsetTop: 0, offsetLeft: 0 },
    intraElemMeas = { top: 0, right: 0, bottom: 0, left: 0, trueTop: 0, trueRight: 0, trueBottom: 0, trueLeft: 0 },
    dimensionMarkerWidth = 0,
    dimensionMarkerHeight = 0,
    documentClone,
    elementPosition,
    selectedMeasurements,
    hoveredMeasurements,
    documentCSSList,
    elementCSS;

let cssProperties = {
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

$(window).on('load', function () {
    //*****I'm not insane for doubley defining this function. This needs to be done otherwise the demo won't work.*****
    onLoadFunction();
});

//*************************************************************************************************
//*                   Wrap onLoad events in function to call during demo.                         *
//*************************************************************************************************
function onLoadFunction() {
    checkState();
    initTool();
    buildCSSAttributesList();
    documentClone = $('body').clone(true);
    enableRedline();
    setZoom();
}

//*************************************************************************************************
//*                                   Check our cookies.                                          *
//*************************************************************************************************
function checkState() {
    var trackingCookie = getCookie('axure-tool-enabled'),
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
    var width = 0,
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
    $('#redline-panel').on('change', '.switch', function () {
        enableTool = $('.toggle-switch').prop('checked');
        enableRedline();
    });

    //*****Element Hover*****
    $('body').on('mouseover', '*', function (e) {
        e.stopImmediatePropagation();
        //clearRedline();
        elementHover($(this));
    });

    //*****Element Click/Clickaway*****
    $('body').on('click', '*', function (e) {
        // Removed 20.2.18. Last used V1.1.4.
        //e.stopImmediatePropagation();
        e.stopPropagation();
        if ($(this).hasClass('zoom-wrapper') || $(this).attr('id') == 'base') {
            closeRedline();
        } else {
            elementClick($(this));
        }
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
    $(document).on('keydown', function (e) {
        switch (e.keyCode) {
            case 27:
                closeRedline();
                break;
            case 187:
                if (e.ctrlKey) {
                    e.preventDefault();
                    documentZoom += 10;
                    setZoom();
                }
                break;
            case 189:
                if (e.ctrlKey) {
                    e.preventDefault();
                    documentZoom -= 10;
                    setZoom();
                }
                break;
        }
    });

    //*****Autoselect Redline Panel Content****
    $('#redline-panel').on('mouseup', 'input, textarea', function () {
        $(this).select();
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
    $('#top-control-panel').on('click', '#swatch-color', () => {
        $('#input-color').val(cycleColorFormat($('#input-color').val()));
    });

    //*****Toggle Background Color RGB/HEX*****
    $('#top-control-panel').on('click', '#swatch-background-color', () => {
        $('#input-background-color').val(cycleColorFormat($('#input-background-color').val()));
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
        var dialogElement, tempZoom;
        e.stopImmediatePropagation();
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
    $('body .annotation').on('mousedown', '*', function (e) {
        var element, tempZoom;
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
        $('*').not('.annotation, .annotation *').off();
        bindListeners();

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
            $('html body').remove();
            $('html').append(documentClone.clone(true));
            $('.toggle-switch').prop('checked', false);
            bindListeners();
            // Removed 20.2.18. Last in V1.1.4.
            //$('.zoom-wrapper').show();
            //$('.zoom-wrapper *').not('script, style').show();
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
                measureIntraElementDistance();
                drawIntraElementMarkers();
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
    /* var redlineStatus, annotationStatus;

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
function measureIntraElementDistance() {
    $.each(intraElemMeas, function (i) {
        intraElemMeas[i] = 0;
    });

    if (elemMeas.offsetTop > elemSelectMeas.offsetTop + elemSelectMeas.height) {
        intraElemMeas.bottom = Math.abs(elemSelectMeas.offsetTop + elemSelectMeas.height - elemMeas.offsetTop);
        intraElemMeas.trueBottom = Math.abs(selectedMeasurements.offsetTop + selectedMeasurements.height - hoveredMeasurements.offsetTop);
    } else if (elemSelectMeas.offsetTop > elemMeas.offsetTop + elemMeas.height) {
        intraElemMeas.top = Math.abs(elemMeas.offsetTop + elemMeas.height - elemSelectMeas.offsetTop);
        intraElemMeas.trueTop = Math.abs(hoveredMeasurements.offsetTop + hoveredMeasurements.height - selectedMeasurements.offsetTop);
    } else if (elemSelectMeas.offsetTop > elemMeas.offsetTop && elemSelectMeas.offsetTop + elemSelectMeas.height > elemMeas.offsetTop + elemMeas.height) {
        intraElemMeas.top = Math.abs(elemMeas.offsetTop - elemSelectMeas.offsetTop);
        intraElemMeas.trueTop = Math.abs(hoveredMeasurements.offsetTop - selectedMeasurements.offsetTop);
    } else if (elemSelectMeas.offsetTop < elemMeas.offsetTop && elemSelectMeas.offsetTop + elemSelectMeas.height < elemMeas.offsetTop + elemMeas.height) {
        intraElemMeas.bottom = Math.abs((elemMeas.offsetTop + elemMeas.height) - (elemSelectMeas.offsetTop + elemSelectMeas.height));
        intraElemMeas.trueBottom = Math.abs((hoveredMeasurements.offsetTop + hoveredMeasurements.height) - (selectedMeasurements.offsetTop + selectedMeasurements.height));
    } else {
        intraElemMeas.top = elemSelectMeas.offsetTop - elemMeas.offsetTop;
        intraElemMeas.bottom = (elemMeas.offsetTop + elemMeas.height) - (elemSelectMeas.offsetTop + elemSelectMeas.height);
        intraElemMeas.trueTop = selectedMeasurements.offsetTop - hoveredMeasurements.offsetTop;
        intraElemMeas.trueBottom = (hoveredMeasurements.offsetTop + hoveredMeasurements.height) - (selectedMeasurements.offsetTop + selectedMeasurements.height);
    }

    if (elemSelectMeas.offsetLeft > elemMeas.offsetLeft + elemMeas.width) {
        intraElemMeas.left = Math.abs(elemMeas.offsetLeft + elemMeas.width - elemSelectMeas.offsetLeft);
        intraElemMeas.trueLeft = Math.abs(elemMeas.offsetLeft + hoveredMeasurements.width - selectedMeasurements.offsetLeft);
    } else if (elemMeas.offsetLeft > elemSelectMeas.offsetLeft + elemSelectMeas.width) {
        intraElemMeas.right = Math.abs(elemSelectMeas.offsetLeft + elemSelectMeas.width - elemMeas.offsetLeft);
        intraElemMeas.trueRight = Math.abs(selectedMeasurements.offsetLeft + selectedMeasurements.width - hoveredMeasurements.offsetLeft);
    } else if (elemSelectMeas.offsetLeft > elemMeas.offsetLeft && elemSelectMeas.offsetLeft + elemSelectMeas.width > elemMeas.offsetLeft + elemMeas.width) {
        intraElemMeas.left = Math.abs(elemMeas.offsetLeft - elemSelectMeas.offsetLeft);
        intraElemMeas.trueLeft = Math.abs(hoveredMeasurements.offsetLeft - selectedMeasurements.offsetLeft);
    } else if (elemSelectMeas.offsetLeft < elemMeas.offsetLeft && elemSelectMeas.offsetLeft + elemSelectMeas.width < elemMeas.offsetLeft + elemMeas.width) {
        intraElemMeas.right = Math.abs((elemMeas.offsetLeft + elemMeas.width) - (elemSelectMeas.offsetLeft + elemSelectMeas.width));
        intraElemMeas.trueRight = Math.abs((hoveredMeasurements.offsetLeft + hoveredMeasurements.width) - (selectedMeasurements.offsetLeft + selectedMeasurements.width));
    } else {
        intraElemMeas.left = elemSelectMeas.offsetLeft - elemMeas.offsetLeft;
        intraElemMeas.right = (elemMeas.offsetLeft + elemMeas.width) - (elemSelectMeas.offsetLeft + elemSelectMeas.width);
        intraElemMeas.trueLeft = selectedMeasurements.offsetLeft - hoveredMeasurements.offsetLeft;
        intraElemMeas.trueRight = (hoveredMeasurements.offsetLeft + hoveredMeasurements.width) - (selectedMeasurements.offsetLeft + selectedMeasurements.width);
    }
}

//*************************************************************************************************
//*                   Append our intra-element dimension lines and labels.                        *
//*************************************************************************************************
function drawIntraElementMarkers() {
    dimensionMarkerWidth = $('.dimension-layer').width();
    dimensionMarkerHeight = $('.dimension-layer').height();

    $('.dimension-layer').hide();

    if (intraElemMeas.top != 0) {
        $('#t-measure').show();
        $('#t-measure').height(Math.abs(intraElemMeas.top) - borderThickness);
        if (intraElemMeas.top > 0) {
            $('#t-measure').offset({ top: elemSelectMeas.offsetTop - intraElemMeas.top, left: elemSelectMeas.offsetLeft + (elemSelectMeas.width / 2) });
        } else {
            $('#t-measure').offset({ top: elemSelectMeas.offsetTop, left: elemSelectMeas.offsetLeft + (elemSelectMeas.width / 2) });
        }
        $('#t-dimension').show();
        $('#t-dimension > span').show();
        $('#t-dimension > span').text(Math.round(Math.abs(intraElemMeas.trueTop)));
        $('#t-dimension').offset({ top: elemSelectMeas.offsetTop - (intraElemMeas.top / 2) - (dimensionMarkerHeight / 2), left: elemSelectMeas.offsetLeft + (elemSelectMeas.width / 2) + labelSpacing });
    }
    if (intraElemMeas.right != 0) {
        $('#r-measure').show();
        $('#r-measure').width(Math.abs(intraElemMeas.right) - borderThickness);
        if (intraElemMeas.right > 0) {
            $('#r-measure').offset({ top: elemSelectMeas.offsetTop + (elemSelectMeas.height / 2), left: elemSelectMeas.offsetLeft + elemSelectMeas.width });
        } else {
            $('#r-measure').offset({ top: elemSelectMeas.offsetTop + (elemSelectMeas.height / 2), left: elemSelectMeas.offsetLeft + elemSelectMeas.width + intraElemMeas.right });
        }

        $('#r-dimension').show();
        $('#r-dimension > span').show();
        $('#r-dimension > span').text(Math.round(Math.abs(intraElemMeas.trueRight)));
        $('#r-dimension').offset({ top: elemSelectMeas.offsetTop + (elemSelectMeas.height / 2) - dimensionMarkerHeight - labelSpacing, left: elemSelectMeas.offsetLeft + elemSelectMeas.width + (intraElemMeas.right / 2) - (dimensionMarkerWidth / 2) });
    }
    if (intraElemMeas.bottom != 0) {
        $('#b-measure').show();
        $('#b-measure').height(Math.abs(intraElemMeas.bottom) - borderThickness);
        if (intraElemMeas.bottom > 0) {
            $('#b-measure').offset({ top: elemSelectMeas.offsetTop + elemSelectMeas.height, left: elemSelectMeas.offsetLeft + (elemSelectMeas.width / 2) });
        } else {
            $('#b-measure').offset({ top: elemSelectMeas.offsetTop + elemSelectMeas.height + intraElemMeas.bottom, left: elemSelectMeas.offsetLeft + (elemSelectMeas.width / 2) });
        }

        $('#b-dimension').show();
        $('#b-dimension > span').show();
        $('#b-dimension > span').text(Math.round(Math.abs(intraElemMeas.trueBottom)));
        $('#b-dimension').offset({ top: elemSelectMeas.offsetTop + elemSelectMeas.height + (intraElemMeas.bottom / 2) - (dimensionMarkerHeight / 2), left: elemSelectMeas.offsetLeft + (elemSelectMeas.width / 2) + labelSpacing });
    }
    if (intraElemMeas.left != 0) {
        $('#l-measure').show();
        $('#l-measure').width(Math.abs(intraElemMeas.left) - borderThickness);
        if (intraElemMeas.left > 0) {
            $('#l-measure').offset({ top: elemSelectMeas.offsetTop + (elemSelectMeas.height / 2), left: elemSelectMeas.offsetLeft - intraElemMeas.left });
        } else {
            $('#l-measure').offset({ top: elemSelectMeas.offsetTop + (elemSelectMeas.height / 2), left: elemSelectMeas.offsetLeft });
        }

        $('#l-dimension').show();
        $('#l-dimension > span').show();
        $('#l-dimension > span').text(Math.round(Math.abs(intraElemMeas.trueLeft)));
        $('#l-dimension').offset({ top: elemSelectMeas.offsetTop + (elemSelectMeas.height / 2) - dimensionMarkerHeight - labelSpacing, left: elemSelectMeas.offsetLeft - (intraElemMeas.left / 2) - (dimensionMarkerWidth / 2) });
    }
}

//*************************************************************************************************
//*                                Update our redline spec panel.                                 *
//*************************************************************************************************
function updateRedlinePanel(element) {
    elementCSS = {};

    console.log(element);

    for (let pseudoClass in pseudoClasses) {
        // We will only create keys for pseudo classes that have attributes.
        if (pseudoClasses[pseudoClass].keyName in documentCSSList['#' + element[0].id]) {

            // Check if the key yet exists.
            if (!(pseudoClasses[pseudoClass].keyName in elementCSS)) {
                elementCSS[pseudoClasses[pseudoClass].keyName] = {};
            }

            elementCSS[pseudoClasses[pseudoClass].keyName] = compileElementCSS(element, pseudoClasses[pseudoClass]);
        }
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
                    tempElementCSS = element.css(_i).replace(/rgba\(\d+,\s\d+,\s\d+,\s0\)/, 'transparent');
                    try {
                        tempCompiledCSS = documentCSSList['#' + element[0].id][pseudoClass.keyName][_i].replace(/rgba\(\d+,\s\d+,\s\d+,\s0\)/, 'transparent');
                    } catch (err) {
                        tempCompiledCSS = '';
                    }

                    /**
                     * We check to see if there is a default attribute value
                     * because it might be being overridden by a pseudo class.
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
    let swatch;

    $.each(elementCSS.default, function (i) {
        $('#redline-panel-menu-column').append('<div class="redline-layer redline-panel-section"></div>');
        $('.redline-panel-section:last').append('<b class="redline-layer"><p class="redline-layer">' + i.toUpperCase() + '</p></b>');
        $.each(elementCSS.default[i], function (_i, _value) {
            if (_value !== undefined && _value.length > 0 && _value.indexOf('none') < 0 && _value != '0px') {
                //*****Check if we need to add a color swatch.*****
                if ((_i.replace('_', '') == 'color' || _i.replace('_', '') == 'background-color') && _value != 'transparent') {
                    swatch = '<span class="redline-layer" id="swatch-' + _i.replace('_', '') + '" style="background-color:' + _value + ';"></span>';
                } else {
                    swatch = '';
                }
                $('.redline-panel-section:last').append('<p class="redline-layer">' + _i.replace('_', '') + ':' + swatch + '</p>');
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
    $('#redline-panel-menu-column > *').not('div:first').remove();
}

//*************************************************************************************************
//*                             Find the deepest child element.                                   *
//*************************************************************************************************

// Removed 20.2.18. Last used in V1.1.4.

/*function findDeepestChild(element) {
    var current = element;
    while (current.children().length > 1) {
        current = current.children();
    }
    return current;
}*/

//*************************************************************************************************
//*                      Set a tracking cookie for tool enabled/disabled.                         *
//*************************************************************************************************
function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
}

//*************************************************************************************************
//*                                     Read cookies.                                             *
//*************************************************************************************************
function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
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
function cycleColorFormat(colorValue) {
    let newFormat = '',
        colorArr,
        opacity;

    switch (true) {
        case /rgba/.test(colorValue):
            colorArr = colorValue.replace(',', '').match(/(\d\.\d)|\d+/g);
            newFormat = '#';
            for (let i = 0; i < 3; i++) {
                newFormat += ('0' + Number(colorArr[i]).toString(16).toUpperCase()).slice(-2);
            }
            newFormat += ` ${Number(colorArr[3]) * 100}%`;
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
    return (newFormat);
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
