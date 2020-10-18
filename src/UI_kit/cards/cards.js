import './cards.scss';
import { Calendar } from 'CardsComponents/calendar/calendar';
import 'CardsComponents/find-room/find-room.js';
import 'CardsComponents/booking/booking.js';

const cards__calendar = new Calendar('.cards__calendar', {
  inline: true,
  classes: 'datepicker__preview',
});
cards__calendar.show()