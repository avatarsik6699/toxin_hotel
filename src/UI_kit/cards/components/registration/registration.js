import { Calendar } from 'root/UI_kit/cards/components/calendar/calendar';
new Calendar('input[data-id="registration_1"]', {
	range: false,
	multipleDates: false,
	multipleDatesSeparator: " - ",
	offset: 5,
	position: "bottom right",
	classes: 'datepicker__date-type_masket',
});