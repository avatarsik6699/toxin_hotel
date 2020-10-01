import { Calendar } from 'root/UI_kit/cards/components/calendar/calendar'

const dropdown = document.querySelector('div[data-type]');

if (dropdown.dataset.type === 'date') {
    const from = dropdown.querySelector('[data-date="from"]');
    const to = dropdown.querySelector('[data-date="to"]');
    
    new Calendar('.dropdown-wrapper', {
        classes: 'datepicker__date-type_from-to',
        onSelect(formattedDate) {
            from.value = formattedDate.split('-')[0] ?? '';
            to.value = formattedDate.split('-')[1] ?? '';
        }
    })
}

if (dropdown.dataset.type === 'filter') {
    new Calendar('.dropdown__field', {
        dateFormat: 'dd M',
        classes: 'datepicker__date-type_filter',
        multipleDatesSeparator: ' - ',
    });
}

if (dropdown.dataset.type === 'default') {
    const items = dropdown.querySelector('.dropdown__items')
    const field = dropdown.querySelector('.dropdown__field')
    console.log(items)
    field.addEventListener('click', () => {
        if (items.style.display === 'none') {
            console.log(1);
            field.classList.add('dropdown__field_checked-true');
            items.style.display = 'block';
        } else {
            items.style.display = 'none';
        }
             
    })
    
}