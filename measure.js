$(document).ready(function() {
    $('.redline-layer').hide(); //*****Start by hiding all redline elements.*****

    var borderThickness = 1,
        hoveredElement = '',
        clickedElement = '',
        elemMeas = { width: 0, height: 0, offsetTop: 0, offsetLeft: 0 },
        elemClickMeas = { width: 0, height: 0, offsetTop: 0, offsetLeft: 0 },
        intraElemMeas = { top: 0, right: 0, bottom: 0, left: 0 },
        redlineClass,
        dimensionMarkerWidth = 0,
        dimensionMarkerHeight = 0;

    $('body').on('mouseenter', '*', function() {
        hoveredElement = $(this);
        redlineClass = hoveredElement.attr('class') === undefined ? '' : hoveredElement.attr('class');
        if (redlineClass.indexOf('redline-layer') == '-1') {
            elemMeas.width = hoveredElement.width();
            elemMeas.height = hoveredElement.height();
            elemMeas.offsetTop = hoveredElement.offset().top;
            elemMeas.offsetLeft = hoveredElement.offset().left;
            console.log(elemMeas);
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

            $('#to-hover').width($(window).innerWidth() - 1);
            $('#bo-hover').width($(window).innerWidth() - 1);
            $('#ro-hover').height($(window).innerHeight() - 1);
            $('#lo-hover').height($(window).innerHeight() - 1);

            $('#to-hover').offset({ top: elemMeas.offsetTop - borderThickness, left: 0 });
            $('#bo-hover').offset({ top: elemMeas.offsetTop + elemMeas.height, left: 0 });
            $('#ro-hover').offset({ top: 0, left: elemMeas.offsetLeft + elemMeas.width });
            $('#lo-hover').offset({ top: 0, left: elemMeas.offsetLeft - borderThickness });
            if (hoveredElement[0] == clickedElement[0]) {
                $('#t-dimension').show();
                $('#r-dimension').show();
                $('#t-dimension > span').show();
                $('#r-dimension > span').show();
            } else if (clickedElement != '') {

                $.each(intraElemMeas, function(i, value) {
                    intraElemMeas[i] = 0;
                });

                if (elemMeas.offsetTop > elemClickMeas.offsetTop + elemClickMeas.height) {
                    intraElemMeas.bottom = Math.abs(elemClickMeas.offsetTop + elemClickMeas.height - elemMeas.offsetTop);
                } else if (elemClickMeas.offsetTop > elemMeas.offsetTop + elemMeas.height) {
                    intraElemMeas.top = Math.abs(elemMeas.offsetTop + elemMeas.height - elemClickMeas.offsetTop);
                } else {
                    intraElemMeas.top = Math.abs(elemMeas.offsetTop - elemClickMeas.offsetTop);
                    intraElemMeas.bottom = Math.abs((elemMeas.offsetTop + elemMeas.height) - (elemClickMeas.offsetTop + elemClickMeas.height));
                }

                if (elemClickMeas.offsetLeft > elemMeas.offsetLeft + elemMeas.width) {
                    intraElemMeas.left = Math.abs(elemMeas.offsetLeft + elemMeas.width - elemClickMeas.offsetLeft);
                } else if (elemMeas.offsetLeft > elemClickMeas.offsetLeft + elemClickMeas.width) {
                    intraElemMeas.right = Math.abs(elemClickMeas.offsetLeft + elemClickMeas.width - elemMeas.offsetLeft);
                } else {
                    intraElemMeas.left = Math.abs(elemMeas.offsetLeft - elemClickMeas.offsetLeft);
                    intraElemMeas.right = Math.abs((elemMeas.offsetLeft + elemMeas.width) - (elemClickMeas.offsetLeft + elemClickMeas.width));
                }

                dimensionMarkerWidth = $('.dimension-layer').width();
                dimensionMarkerHeight = $('.dimension-layer').height();

                if (intraElemMeas.top > 0) {
                    $('#t-measure').show();
                    $('#t-measure').height(intraElemMeas.top - (borderThickness * 2));
                    $('#t-measure').offset({ top: elemClickMeas.offsetTop - intraElemMeas.top, left: elemClickMeas.offsetLeft + (elemClickMeas.width / 2) });
                    $('#t-dimension').show();
                    $('#t-dimension > span').show();
                    $('#t-dimension > span').html(intraElemMeas.top);
                    $('#t-dimension').offset({ top: elemClickMeas.offsetTop - (intraElemMeas.top / 2) - (dimensionMarkerHeight / 2), left: elemClickMeas.offsetLeft + (elemClickMeas.width / 2) + 5 });
                }
                if (intraElemMeas.right > 0) {
                    $('#r-measure').show();
                    $('#r-measure').width(intraElemMeas.right - (borderThickness * 2));
                    $('#r-measure').offset({ top: elemClickMeas.offsetTop + (elemClickMeas.height / 2), left: elemClickMeas.offsetLeft + elemClickMeas.width });
                    $('#r-dimension').show();
                    $('#r-dimension > span').show();
                    $('#r-dimension > span').html(intraElemMeas.right);
                    $('#r-dimension').offset({ top: elemClickMeas.offsetTop + (elemClickMeas.height / 2) - dimensionMarkerHeight - 5, left: elemClickMeas.offsetLeft + elemClickMeas.width + (intraElemMeas.right / 2) - (dimensionMarkerWidth / 2) });
                }
                if (intraElemMeas.bottom > 0) {
                    $('#b-measure').show();
                    $('#b-measure').height(intraElemMeas.bottom - (borderThickness * 2));
                    $('#b-measure').offset({ top: elemClickMeas.offsetTop + elemClickMeas.height, left: elemClickMeas.offsetLeft + (elemClickMeas.width / 2) });
                    $('#b-dimension').show();
                    $('#b-dimension > span').show();
                    $('#b-dimension > span').html(intraElemMeas.bottom);
                    $('#b-dimension').offset({ top: elemClickMeas.offsetTop + elemClickMeas.height + (intraElemMeas.bottom / 2) - (dimensionMarkerHeight / 2), left: elemClickMeas.offsetLeft + (elemClickMeas.width / 2) + 5 });
                }
                if (intraElemMeas.left > 0) {
                    $('#l-measure').show();
                    $('#l-measure').width(intraElemMeas.left - (borderThickness * 2));
                    $('#l-measure').offset({ top: elemClickMeas.offsetTop + (elemClickMeas.height / 2), left: elemClickMeas.offsetLeft - intraElemMeas.left });
                    $('#l-dimension').show();
                    $('#l-dimension > span').show();
                    $('#l-dimension > span').html(intraElemMeas.left);
                    $('#l-dimension').offset({ top: elemClickMeas.offsetTop + (elemClickMeas.height / 2) - dimensionMarkerHeight - 5, left: elemClickMeas.offsetLeft - (intraElemMeas.left / 2) - (dimensionMarkerWidth / 2) });
                }

                console.log(intraElemMeas);
            }
        }
    });

    $('body').on('mouseleave', '*', function() {
        clearRedline();
    });

    $('body').on('click', '*', function() {
        clearRedline();
        clickedElement = $(this);
        redlineClass = clickedElement.attr('class') === undefined ? '' : clickedElement.attr('class');
        if (redlineClass.indexOf('redline-layer') == '-1') {
            elemClickMeas.width = clickedElement.width();
            elemClickMeas.height = clickedElement.height();
            elemClickMeas.offsetTop = clickedElement.offset().top;
            elemClickMeas.offsetLeft = clickedElement.offset().left;
            console.log(elemClickMeas);
            $('.click-layer').show();
            $('#t-click').width(elemClickMeas.width + borderThickness);
            $('#b-click').width(elemClickMeas.width);
            $('#r-click').height(elemClickMeas.height);
            $('#l-click').height(elemClickMeas.height);

            $('#t-click').offset({ top: elemClickMeas.offsetTop - borderThickness, left: elemClickMeas.offsetLeft - borderThickness });
            $('#b-click').offset({ top: elemClickMeas.offsetTop + elemClickMeas.height, left: elemClickMeas.offsetLeft - borderThickness });
            $('#r-click').offset({ top: elemClickMeas.offsetTop, left: elemClickMeas.offsetLeft + elemClickMeas.width });
            $('#l-click').offset({ top: elemClickMeas.offsetTop, left: elemClickMeas.offsetLeft - borderThickness });

            $('#t-dimension').show();
            $('#r-dimension').show();
            $('#t-dimension > span').show();
            $('#r-dimension > span').show();
            dimensionMarkerWidth = $('.dimension-layer').width();
            dimensionMarkerHeight = $('.dimension-layer').height();
            $('#t-dimension > span').html(elemClickMeas.width);
            $('#r-dimension > span').html(elemClickMeas.height);
            $('#t-dimension').offset({ top: elemClickMeas.offsetTop - dimensionMarkerHeight - 10, left: elemClickMeas.offsetLeft + (elemClickMeas.width / 2) - (dimensionMarkerWidth / 2) });
            $('#r-dimension').offset({ top: elemClickMeas.offsetTop + (elemClickMeas.height / 2) - (dimensionMarkerHeight / 2), left: elemClickMeas.offsetLeft + elemClickMeas.width + 10 });
        }
    });
});

function clearRedline() {
    $('.hover-layer').hide();
    $('.hover-o-layer').hide();
    $('.dimension-layer').hide();
    $('.measure-layer').hide();
}
