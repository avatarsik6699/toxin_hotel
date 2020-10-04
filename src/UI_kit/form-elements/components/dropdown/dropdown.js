import { parse } from 'path';
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


// if (dropdown.dataset.type === 'default') {
//     const items = document.querySelector('.dropdown__items')
//     const field = dropdown.querySelector('.dropdown__field')
//     console.log(items)
//     field.addEventListener('click', (e) => {
//             field.classList.toggle('dropdown__field_checked-true');
//             items.classList.toggle('dropdown__items_dispay-true')     
//     })
    
// }

class Dom {
    constructor() {}
    
    getNode(selector, areaSelector = document) {
        if (typeof areaSelector === 'string') {
            const root = document.querySelector(areaSelector);
            return root.querySelector(selector);
        } else {
           return areaSelector.querySelector(selector); 
        }
        
    }

    setDataAttribute(domElement, value) {
        domElement.setAttribute('data-button', value);
    }

    hasDataAttribue(e) {
        for(let el in e.target.dataset) {
            if (el) return true;
        }
        return false;
    }

    getElement(event, tag) {
        return event.target
        .parentElement
        .parentElement
        .querySelector(tag);
    }
}

// API----------------------------------------------
// exceptions -> те разделы, значения которых будут заменены на exceptionsDeclension
// fieldData -> хранилище элементов "категория : кол-во" (для exceptionDeclension 
// нужно задавать начальное значение)


class Dropdown {
    constructor(domDropdown, customOptions = {}, dom = new Dom) {
        this.dom = dom;
        // options ---------------------------------------------------
        this.defaultOptions = {
            type: 'with-buttons',
            exceptions: ['взрослые', 'дети','спальни', 'кровати'],
            exceptionDeclension: 'гости',   
            declensions: {
                'спальни': ['спальня', 'спальни', 'спален'],
                'кровати': ['кровать', 'кровати', 'кроватей'],
                'ванные комнаты': ['ванна комната', 'ванны комнаты','ванн комнат'],
                'гости': ['гость', 'гостя', 'гостей']
            }
        };
        
        this.fieldData = {
            'гости': 0,
        };

        // dom nodes--------------------------------------------------
        this.dropdown = this.dom.getNode(domDropdown);
        this.field = this.dropdown.querySelector('.dropdown__field');
        this.items = this.dropdown.querySelector('.dropdown__items');
        

        // buttons----------------------------------------------------
        if (this.defaultOptions.type === 'with-buttons') {
            this.dom.setDataAttribute(dom.getNode('.btn', '.dropdown__btn-clear'), 'clear')
            this.dom.setDataAttribute(dom.getNode('.btn', '.dropdown__btn-apply'), 'apply')
        }

        // events-------
        this.bindEvent();
    
    }

    bindEvent() {
        document.addEventListener('click', this.handleEvent)
    }

    handleEvent = (e) => {
        if (!this.clickInDropdown(e)) { this.hide() };
        
        if(!this.dom.hasDataAttribue(e)) return;
        
        let eventType = this.getDataType(e)[0].toUpperCase() + this.getDataType(e).slice(1);
        let funcName = "event" + eventType;
        this[funcName](e)

        // const isBtnEvent = e.target.closest('div[data-event]').dataset.event;
        // if (isBtnEvent === 'apply') {
        //     this.toggle();
        // }

        // if (isBtnEvent === 'clear') {
        //     console.log('clear');
        // }

        // const isBtnChange = e.target.dataset.change;
        // if (!isBtnChange) return;

    }

    eventField(e) {
        this.toggle();
    }

    eventChange(e) {
        const btnSub = this.dom.getElement(e, '.dropdown__substract');
        const btnAdd = this.dom.getElement(e, '.dropdown__add');
        const category = this.dom.getElement(e, '.dropdown__category');
        const number = this.dom.getElement(e, '.dropdown__number');

        if (e.target.dataset.change === 'add') {
            this.add(number, this.field, category.innerHTML);
            this.btnDisabled(false, btnSub);
            return;
        }

        if (e.target.dataset.change === 'sub') {
            if (this.isNumberZero(number)) return;
            this.sub(number, btnSub, this.field, category.innerHTML);
            return;
        }
    }

    eventButton(e) {
        if (e.target.dataset.button === 'apply') {
            this.hide();
        }
    }

    add(number, field, category) {
        number.innerHTML = Number(number.innerHTML) + 1;
        
        this.changeField(number, this.field, category, 'add')
    }

    sub(number, btn, field, category) {
        number.innerHTML = Number(number.innerHTML) - 1;

        this.changeField(number, this.field, category, 'sub')

        if (this.isNumberZero(number)) { 
            this.btnDisabled(true, btn); 
            // return;
        }
    }

    changeField(number, field, category, operation) {
        if (this.defaultOptions.exceptions.includes(category)) {
            
            if (operation === 'add') {
                this.fieldData[this.defaultOptions.exceptionDeclension] += 1;
            } else {
                this.fieldData[this.defaultOptions.exceptionDeclension] -= 1;
            }

        } else {
            this.fieldData[category] = Number(number.innerHTML);
        }
        
        let strPattern = ''
        for (let item in this.fieldData) {
            if (this.fieldData.hasOwnProperty(item)) {
                if (this.fieldData[item] <= 0) {
                    continue;
                } else {
                    const declension = this.getDeclension(item, this.fieldData[item])
                    strPattern += `${this.fieldData[item]} ${declension} `
                }  
            }
        }

        field.value = strPattern;
    }

    getDeclension(category, amount) {
        return this.findDeclension(category, amount);
    }

    findDeclension(category, amount) {
        if (amount === 1) {
            return this.defaultOptions.declensions[category][0];
        } else if (amount > 1 && amount < 5) {
            return this.defaultOptions.declensions[category][1];
        } else {
            return this.defaultOptions.declensions[category][2];
        }
    }
    
    isNumberZero(number) {
        return Number(number.innerHTML) === 0;
    }

    btnDisabled(boolean, btn) {
        if (boolean) {
            btn.classList.add('dropdown__substract_disabled-true');
        } else {
            btn.classList.remove('dropdown__substract_disabled-true');
        }
    }

    clickInDropdown(e) {
        return e.target.closest('.dropdown');
    }

    getDataType(e) {
        for(let data in e.target.dataset) {
            return data;
        }
    }

    deepExtendOptions(...out) {
        for (let obj of out ) {
            if (!obj) continue;

            for (let key in obj) {
                if (obj.hasOwnProperty(key)) {
                    if (typeof obj[key] === 'object') {
                        if (Array.isArray(obj[key])) {
                            out[key] = obj[key].slice(0);
                        } else {
                            out[key] = deepExtend(out[key], obj[key]);
                        }
                    }
                } else {
                    out[key] = obj[key];
                }
            }
        }

        return out;
    }

    hide() {
        this.items.classList.remove('dropdown__items_display-true'); 
    }

    open() {
        this.items.classList.add('dropdown__items_display-true');
    }

    toggle() {
        this.items.classList.toggle('dropdown__items_display-true');
    }

}

new Dropdown('.dropdown', {

});

function deepExtendOptions(...out) {
    
    for (let obj of out ) {
        if (!obj) continue;

        for (let key in obj) {
            if (obj.hasOwnProperty(key)) {
                if (typeof obj[key] === 'object') {
                    if (Array.isArray(obj[key])) {
                        out[key] = obj[key].slice(0);
                    } else {
                        out[key] = deepExtend(out[key], obj[key]);
                    }
                }
            } else {
                out[key] = obj[key];
            }
        }
    }

    return out;
}

function func(...options) {
    console.log(Object.fromEntries(Object.entries(options)));
}
func({}, {a:1, b:5}, {a:2, });
console.log(deepExtendOptions({}, {a:1, b:5}, {a:2, }));