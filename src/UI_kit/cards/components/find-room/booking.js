import { Dropdown } from 'FEcomponents/dropdown/dropdown';
const booking_dropdown_date = new Dropdown('div.dropdown-wrapper[data-id="booking_1"]', {})
const booking_dropdown_default = new Dropdown('div.dropdown[data-id="booking_2"]', {
  exceptions: ['взрослые', 'дети'],
  exceptionDeclension: 'гости',   
  declensions: {
      'младенцы': ['младенец', 'младенца', 'младенцев'],
      'гости': ['гость', 'гостя', 'гостей']
  }
})