import './form-elements.scss';
import { Dropdown } from 'FEcomponents/dropdown/dropdown';
import { Calendar } from 'CardsComponents/calendar/calendar';
import 'FEcomponents/range-slider/range-slider';

const dropdown_default = new Dropdown('div.dropdown[data-id="1"]', {
  exceptions: ['взрослые', 'дети'],
  exceptionDeclension: 'гости',   
  declensions: {
      'младенцы': ['младенец', 'младенца', 'младенцев'],
      'гости': ['гость', 'гостя', 'гостей']
  }
})
const field_masked = new Calendar('input.field__input[data-id="2"]', {
  range: false,
  multipleDates: false,
  multipleDatesSeparator: " - ",
  offset: 5,
  position: "bottom right",
});
const dropdown_date = new Dropdown('div.dropdown-wrapper[data-id="3"]', {})
const dropdown_filter = new Dropdown('div.dropdown[data-id="4"]', {})
const dropdown_default_comfort = new Dropdown('div.dropdown[data-id="5"]', {})
const dropdown_default_guests = new Dropdown('div.dropdown[data-id="6"]', {
  exceptions: ['взрослые', 'дети'],
  exceptionDeclension: 'гости',   
  declensions: {
      'младенцы': ['младенец', 'младенца', 'младенцев'],
      'гости': ['гость', 'гостя', 'гостей']
  }
})