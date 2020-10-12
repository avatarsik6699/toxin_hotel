import { Calendar } from 'root/UI_kit/cards/components/calendar/calendar';
import 'root/UI_kit/cards/components/find-room/find-room.js';
import 'root/UI_kit/cards/components/booking/booking.js';

const cards__calendar = new Calendar('.cards__calendar', {
  inline: true,
});
cards__calendar.show()