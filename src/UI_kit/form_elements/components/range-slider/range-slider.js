require("jquery-ui/ui/widgets/slider");
$('.slider').slider({
    range: true,
    min: 0,
    max: 10000,
    classes: {
        "ui-slider": "range-slider",
        "ui-slider-handle": "range-slider__handle",
        "ui-slider-range": "range-slider__range"
    }
})
