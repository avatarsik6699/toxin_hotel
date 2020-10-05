import { Calendar } from 'root/UI_kit/cards/components/calendar/calendar';
const field = document.querySelector('.text-field');

if (field.dataset.type === 'masked') {
    new Calendar('.text-field', {
        range: false,
        multipleDates: false,
        multipleDatesSeparator: " - ",
        offset: 5,
        position: "bottom right",
    });
}