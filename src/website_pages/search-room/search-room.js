import './search-room.scss';
import 'FEcomponents/range-slider/range-slider';
import { Dropdown } from 'FEcomponents/dropdown/dropdown';

const search_room_dropdown_filter = new Dropdown('div.dropdown[data-id="search-room_1"]', {});
const search_room_dropdown_default_guests = new Dropdown('div.dropdown[data-id="search-room_2"]', {
  exceptions: ['взрослые', 'дети'],
  exceptionDeclension: 'гости',   
  declensions: {
      'младенцы': ['младенец', 'младенца', 'младенцев'],
      'гости': ['гость', 'гостя', 'гостей']
  }
})
const search_room_dropdown_default_comfort = new Dropdown('div.dropdown[data-id="search-room_3"]', {})