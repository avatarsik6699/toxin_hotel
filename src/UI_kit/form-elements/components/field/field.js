import { Calendar } from 'root/UI_kit/cards/components/calendar/calendar';
const field = document.querySelectorAll('input.field__input[data-id]');

Array.from(field).forEach ((el, index, arr) => {
    if (arr.length !== 0) {
        if (el.dataset.masked !== 'false') {
            new Calendar(el, {
                range: false,
                multipleDates: false,
                multipleDatesSeparator: " - ",
                offset: 5,
                position: "bottom right",
            });
        }
    }
})