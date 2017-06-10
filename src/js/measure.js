var enableTool = true,
    borderThickness = 1,
    labelSpacing = 5,
    hoveredElement = '',
    selectedElement = '',
    elemMeas = { width: 0, height: 0, offsetTop: 0, offsetLeft: 0 },
    elemSelectMeas = { width: 0, height: 0, offsetTop: 0, offsetLeft: 0 },
    intraElemMeas = { top: 0, right: 0, bottom: 0, left: 0 },
    redlineClass,
    dimensionMarkerWidth = 0,
    dimensionMarkerHeight = 0;

var cssProperties = { 'properties': { 'width': '', 'height': '' }, 'styles': { 'background-color': '', 'opacity': '', 'border-top-width': '', 'border-top-style': '', 'border-top-color': '', 'border-top-left-radius': '', 'box-shadow': '' }, 'text': { 'font-family': '', 'font-size': '', 'font-weight': '', 'line-height': '', 'text-align': '', 'color': '', '_content': '' } };

$(document).ready(function() {

    initTool();

    //*****Enable/Disable Redline Tool*****
    $('#redline-panel').on('change', '.switch', function() {
        enableRedline();
    });

    //*****Element Hover*****
    $('body').on('mouseenter', '*', function() {
        elementHover($(this));
    });

    //*****Element Leave*****
    $('body').on('mouseleave', '*', function() {
        clearRedline();
    });

    //*****Element Click*****
    $('body').on('click', '*', function() {
        elementClick($(this));
    });

    //*****Open/Close Redline Panel*****
    $('#redline-panel').on('click', '#redline-panel-menu', function() {
        $('#redline-panel').toggleClass('redline-panel-exposed');
    });

    //*****Handle Element Clickaway*****
    $('body').on('click', function(e) {
        if (e.target === this) {
            closeRedline();
        }
    });

    //*****Autoselect Redline Panel Content****
    $('#redline-panel').on('mouseup', 'input', function() {
        $(this).select();
    });

    //*****Autoselect Redline Panel Content****
    $('#redline-panel').on('mouseup', 'textarea', function() {
        $(this).select();
    })
});

//*************************************************************************************************
//*                                 Initialize our tool.                                          *
//*************************************************************************************************
function initTool() {
    $('.redline-tool-wrapper *').addClass('redline-layer'); //Label all redline tool elelemnts.
    $('.redline-layer').hide();
    $('.redline-tool-wrapper').show();
    $('#redline-panel').show();
    $('#redline-panel *').show();
    $('.toggle-switch').prop('checked', true);
    enableRedline();
}

//*************************************************************************************************
//*                             Enable or disable our tool.                                       *
//*************************************************************************************************
function enableRedline() {
    enableTool = $('.toggle-switch').prop('checked');

    if (!enableTool) {
        setTimeout(function() {
            closeRedline();
        }, 250);
    }
}

//*************************************************************************************************
//*                             Handle element hover actions.                                     *
//*************************************************************************************************
function elementHover(element) {
    if (enableTool) {
        hoveredElement = element;
        if (!isRedlineElement(hoveredElement)) {
            highlightHoverElement();
            //*****Check if we're hovering over our previously-selected element.*****
            if (hoveredElement[0] == selectedElement[0]) {
                highlightSelectElement();
            } else if (selectedElement != '') {
                measureIntraElementDistance();
                drawIntraElementMarkers();
            }
        }
    }
}

//*************************************************************************************************
//*                             Handle element click actions.                                     *
//*************************************************************************************************
function elementClick(element) {
    if (enableTool) {
        if (!isRedlineElement(element)) {
            selectedElement = findDeepestChild(element);
            clearRedline();
            highlightSelectElement();
            updateRedlinePanel(selectedElement);
        }
    }
}

//*************************************************************************************************
//*              Ensure we aren't interacting with a redline-specific element.                    *
//*************************************************************************************************
function isRedlineElement(element) {
    var redlineStatus;

    redlineStatus = element.attr('class') === undefined ? '' : element.attr('class');
    if (redlineStatus.indexOf('redline-layer') == '-1') {
        return false;
    } else {
        return true;
    }
}

//*************************************************************************************************
//*                  Highlight our hovered element and add extension lines.                       *
//*************************************************************************************************
function highlightHoverElement() {
    elemMeas.width = hoveredElement.outerWidth();
    elemMeas.height = hoveredElement.outerHeight();
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

    $('#to-hover').width($(window).innerWidth() - (borderThickness * 2));
    $('#bo-hover').width($(window).innerWidth() - (borderThickness * 2));
    $('#ro-hover').height($(window).innerHeight() - (borderThickness * 2));
    $('#lo-hover').height($(window).innerHeight() - (borderThickness * 2));

    $('#to-hover').offset({ top: elemMeas.offsetTop - borderThickness, left: 0 });
    $('#bo-hover').offset({ top: elemMeas.offsetTop + elemMeas.height, left: 0 });
    $('#ro-hover').offset({ top: 0, left: elemMeas.offsetLeft + elemMeas.width });
    $('#lo-hover').offset({ top: 0, left: elemMeas.offsetLeft - borderThickness });
}

//*************************************************************************************************
//*                  Highlight our selected element and add extension lines.                      *
//*************************************************************************************************
function highlightSelectElement() {
    elemSelectMeas.width = selectedElement.outerWidth();
    elemSelectMeas.height = selectedElement.outerHeight();
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
    $('#t-dimension > span').text(Math.round(elemSelectMeas.width));
    $('#r-dimension > span').text(Math.round(elemSelectMeas.height));
    $('#t-dimension').offset({ top: elemSelectMeas.offsetTop - dimensionMarkerHeight - labelSpacing, left: elemSelectMeas.offsetLeft + (elemSelectMeas.width / 2) - (dimensionMarkerWidth / 2) });
    $('#r-dimension').offset({ top: elemSelectMeas.offsetTop + (elemSelectMeas.height / 2) - (dimensionMarkerHeight / 2), left: elemSelectMeas.offsetLeft + elemSelectMeas.width + labelSpacing });
}

//*************************************************************************************************
//*             Measure distance between selected element to newly hovered element.               *
//*************************************************************************************************
function measureIntraElementDistance() {
    $.each(intraElemMeas, function(i, value) {
        intraElemMeas[i] = 0;
    });

    if (elemMeas.offsetTop > elemSelectMeas.offsetTop + elemSelectMeas.height) {
        intraElemMeas.bottom = Math.abs(elemSelectMeas.offsetTop + elemSelectMeas.height - elemMeas.offsetTop);
    } else if (elemSelectMeas.offsetTop > elemMeas.offsetTop + elemMeas.height) {
        intraElemMeas.top = Math.abs(elemMeas.offsetTop + elemMeas.height - elemSelectMeas.offsetTop);
    } else if (elemSelectMeas.offsetTop > elemMeas.offsetTop && elemSelectMeas.offsetTop + elemSelectMeas.height > elemMeas.offsetTop + elemMeas.height) {
        intraElemMeas.top = Math.abs(elemMeas.offsetTop - elemSelectMeas.offsetTop);
    } else if (elemSelectMeas.offsetTop < elemMeas.offsetTop && elemSelectMeas.offsetTop + elemSelectMeas.height < elemMeas.offsetTop + elemMeas.height) {
        intraElemMeas.bottom = Math.abs((elemMeas.offsetTop + elemMeas.height) - (elemSelectMeas.offsetTop + elemSelectMeas.height));
    } else {
        intraElemMeas.top = elemSelectMeas.offsetTop - elemMeas.offsetTop;
        intraElemMeas.bottom = (elemMeas.offsetTop + elemMeas.height) - (elemSelectMeas.offsetTop + elemSelectMeas.height);
    }

    if (elemSelectMeas.offsetLeft > elemMeas.offsetLeft + elemMeas.width) {
        intraElemMeas.left = Math.abs(elemMeas.offsetLeft + elemMeas.width - elemSelectMeas.offsetLeft);
    } else if (elemMeas.offsetLeft > elemSelectMeas.offsetLeft + elemSelectMeas.width) {
        intraElemMeas.right = Math.abs(elemSelectMeas.offsetLeft + elemSelectMeas.width - elemMeas.offsetLeft);
    } else if (elemSelectMeas.offsetLeft > elemMeas.offsetLeft && elemSelectMeas.offsetLeft + elemSelectMeas.width > elemMeas.offsetLeft + elemMeas.width) {
        intraElemMeas.left = Math.abs(elemMeas.offsetLeft - elemSelectMeas.offsetLeft);
    } else if (elemSelectMeas.offsetLeft < elemMeas.offsetLeft && elemSelectMeas.offsetLeft + elemSelectMeas.width < elemMeas.offsetLeft + elemMeas.width) {
        intraElemMeas.right = Math.abs((elemMeas.offsetLeft + elemMeas.width) - (elemSelectMeas.offsetLeft + elemSelectMeas.width));
    } else {
        intraElemMeas.left = elemSelectMeas.offsetLeft - elemMeas.offsetLeft;
        intraElemMeas.right = (elemMeas.offsetLeft + elemMeas.width) - (elemSelectMeas.offsetLeft + elemSelectMeas.width);
    }
}

//*************************************************************************************************
//*                   Append our intra-element dimension lines and labels.                        *
//*************************************************************************************************
function drawIntraElementMarkers() {
    dimensionMarkerWidth = $('.dimension-layer').width();
    dimensionMarkerHeight = $('.dimension-layer').height();

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
        $('#t-dimension > span').text(Math.round(Math.abs(intraElemMeas.top)));
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
        $('#r-dimension > span').text(Math.round(Math.abs(intraElemMeas.right)));
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
        $('#b-dimension > span').text(Math.round(Math.abs(intraElemMeas.bottom)));
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
        $('#l-dimension > span').text(Math.round(Math.abs(intraElemMeas.left)));
        $('#l-dimension').offset({ top: elemSelectMeas.offsetTop + (elemSelectMeas.height / 2) - dimensionMarkerHeight - labelSpacing, left: elemSelectMeas.offsetLeft - (intraElemMeas.left / 2) - (dimensionMarkerWidth / 2) });
    }
}

//*************************************************************************************************
//*                                Update our redline spec panel.                                 *
//*************************************************************************************************
function updateRedlinePanel(element) {
    $.each(cssProperties, function(i, value) {
        $.each(cssProperties[i], function(_i, _value) {
            if (_i == '_content') {
                cssProperties[i][_i] = element.text().trim();
            } else {
                cssProperties[i][_i] = element.css(_i);
            }
        });
    });
    console.log(cssProperties);
    clearRedlinePanel();
    appendRedlinePanel();
    $('#redline-panel').addClass('redline-panel-exposed');
}

//*************************************************************************************************
//*                                Append each property section.                                  *
//*************************************************************************************************
function appendRedlinePanel() {
    $.each(cssProperties, function(i, value) {
        $('#redline-panel').append('<div class="redline-layer redline-panel-section"></div>');
        $('.redline-panel-section:last').append('<b class="redline-layer"><p class="redline-layer">' + i.toUpperCase() + '</p></b>');
        $.each(cssProperties[i], function(_i, _value) {
            if (_value != '' && _value != 'none' && _value != '0px') {
                $('.redline-panel-section:last').append('<p class="redline-layer">' + _i.replace('_', '').replace('-top-', '-').replace('-left-', '-') + ':</p>');
                if (_i != '_content') {
                    $('.redline-panel-section:last').append('<input class="redline-layer" value="' + _value + '" readonly="readonly"></input>');
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
    if (cssProperties['text']['_content'] == '') {
        $('p:contains("TEXT")').parent().parent().remove();
    }
    if (cssProperties['styles']['border-top-width'] == '0px') {
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
    $('#redline-panel > *').not('div:first').not('.redline-tool-enabler').remove();
}

//*************************************************************************************************
//*                             Find the deepest child element.                                   *
//*************************************************************************************************
function findDeepestChild(element) {
    var current = element;

    while (current.children().length > 1) {
        current = current.children();
    }

    return current;
}
