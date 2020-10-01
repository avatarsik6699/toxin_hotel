require('air-datepicker');

export class Calendar {
    constructor(anchor, options) {
        this.anchor = anchor;
        this.init(options);
        this.calendar = $(anchor).data('datepicker').$datepicker;
        this.createClearBtn()
        this.bindEvents();

        this.calendar.hide();
    }

    init(options) {
        const defaultOptions = {
            navTitles: {
                days: 'MM <i>yyyy</i>',
                months: 'yyyy',
                years: 'yyyy1 - yyyy2'
            },
            multipleDates: 2,
            range: true,
            minDate: new Date(),
            toggleSelected: false,
            clearButton: true,
            inline: true,
            multipleDatesSeparator: ' - ',
            
            prevHtml: `<svg class="datepicker__arrow" width="17" height="18" viewBox="0 0 17 18"><path class="datepicker__arrow" d="M16.1755 8.01562V9.98438H3.98801L9.56613 15.6094L8.15988 17.0156L0.144258 9L8.15988 0.984375L9.56613 2.39062L3.98801 8.01562H16.1755Z"/></svg>`,
            nextHtml: `<svg class="datepicker__arrow" width="17" height="18" viewBox="0 0 17 18"><path class="datepicker__arrow" d="M8.36301 0.984375L16.3786 9L8.36301 17.0156L6.95676 15.6094L12.5349 9.98438H0.347383V8.01562H12.5349L6.95676 2.39062L8.36301 0.984375Z"/></svg>`,
        }
        
        $(this.anchor).datepicker({...defaultOptions, ...options});
    }

    bindEvents() {
        const clearBtn = this.calendar[0].querySelector("span[data-action='apply'")
        $(clearBtn).on('click', this.hideCalendar.bind(this));
        $(this.anchor).on('click', this.anchorClick.bind(this));
        $(document).on('mouseup', this.clickOutCalendar.bind(this));
    }
    
    clickOutCalendar(e) {
        if (this.calendarIsNotDisplay()) return;
        if (this.clickInCalendar(e)) return;
        this.calendar.hide();
        return true;    
    }

    clickInCalendar(e) {
        if (document.querySelector(this.anchor).tagName !== 'DIV') {
            return e.target.closest('[class^="datepicker"]');
        } else {
            console.log(1);
           return e.target.matches('[class^="datepicker"]'); 
        }
    }

    calendarIsNotDisplay() {
        return this.calendar[0].style.display === 'none';
    }

    anchorClick(e) {
        if (!this.clickInCalendar(e)) {
            this.toggleCalendar();
        }
    }

    toggleCalendar() {
        if (this.calendarIsNotDisplay()) {
            this.calendar.show();
        } else {
            this.calendar.hide();
        }
    }
    
    hideCalendar(e) {
        e.stopPropagation(); 
        this.calendar.hide();
    }

    createClearBtn() {
        const calendarButtons = $(this.anchor)
        .data('datepicker')
        .$datepicker[0].querySelector('.datepicker--buttons')
        
        const clearBtn = `<span class="datepicker--button" data-action="apply">Применить</span>`;
        
        calendarButtons.insertAdjacentHTML('beforeend', clearBtn);
    }
}