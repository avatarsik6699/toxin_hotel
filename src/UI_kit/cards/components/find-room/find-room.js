import { Dropdown } from 'FEcomponents/dropdown/dropdown';

const find_room_dropdown_date = new Dropdown('div.dropdown-wrapper[data-id="1"]', {})
const find_room_dropdown_default = new Dropdown('div.dropdown[data-id="2"]', {
  exceptions: ['взрослые', 'дети'],
  exceptionDeclension: 'гости',   
  declensions: {
      'младенцы': ['младенец', 'младенца', 'младенцев'],
      'гости': ['гость', 'гостя', 'гостей']
  }
})