
import './style.scss';
// require("jquery-ui/ui/widgets/datepicker");
require('air-datepicker');

$('.calendar').datepicker({
    multipleDates: 2,
    range: true,
    toggleSelected: false,
    clearButton: true,
    inline: true,

});

class Calendare {
    constructor(anchor, options, isStatic) {
        this.anchor = anchor;
        initDatepicker(options);

    }

    initDatepicker(options) {
        const defaultDatePicker = {
            inline: true,
            classes: options.className,
            minDate: new Date(),
            range: true,
            prevHtml: '<div class="js-calendar__arrow-date js-calendar__arrow-date-prev"></div>',
            nextHtml: '<div class="js-calendar__arrow-date js-calendar__arrow-date-next"></div>',
            clearButton: true,
            todayButton: true,
        }

        $(this.anchor).datepicker({...defaultDatePicker, ...options});
    }

    createButtons() {
        const datePickerButtons = $(this.anchor)
        .data('datepicker')
        .$datepicker[0].querySelector('.datepicker--buttons')
    }
}