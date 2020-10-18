import { Calendar } from 'root/UI_kit/cards/components/calendar/calendar'

class Dom {
    constructor() {}
    
    getSelector() {
        for (let i = 0; i <= 100; i++ ) {
            isElementExist = document.querySelector(`div[data-id=${i}]`);
            if (isElementExist) {
                return `div[data-id=${i}]`;
            }
        }
    }

    getType(selector) {
        let el = document.querySelector(selector);
        if (!el) throw new Error('Неправильно передан "data-type"');
        return el.dataset.type;
    }

    getNode(area = document,  selector) {
        if (typeof area === 'string' || area === null) {
            const root = document.querySelector(area);
            return root.querySelector(selector);
        } else {
           return area.querySelector(selector); 
        }
    }

    setDataAttribute(domElement, value) {
        domElement.setAttribute('data-button', value);
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


export class Dropdown {
    constructor(selector, customOptions = {}, type = null, dom = new Dom) {
        this.dom = dom;
        this.selector = selector ?? this.dom.getSelector();
        this.type = type ?? this.dom.getType(selector);
        this.typeList = ['filter', 'date']
        this.sumNumberValue = 0;
        
        // dom nodes--------------------------------------------------
        this.dropdown = this.dom.getNode(document, this.selector);
            if(this.type === 'default') {
                this.field = this.setNode('field')
                this.items = this.setNode('items-wrapper')

                if (this.hasButtons()) {
                    // нет прямого доступа к кнопкам из html
                    // поэтому data-attrubutes устанавливаем ч/з js
                    this.dom.setDataAttribute(
                        this.dom.getNode(`${this.selector} .dropdown__button-clear`,'.button__link'), 
                        'clear')

                    this.dom.setDataAttribute(
                        this.dom.getNode(`${this.selector} .dropdown__button-apply`,'.button__link'), 
                        'apply')
                }
            }

            if (this.type === 'filter') {
                this.field = this.dropdown.querySelector('.dropdown__field');
            }

        // options ---------------------------------------------------
        this.defaultOptions = {
            exceptions: ['взрослые', 'дети'],
            exceptionDeclension: 'гости',   
            declensions: {
                'спальни': ['спальня', 'спальни', 'спален'],
                'кровати': ['кровать', 'кровати', 'кроватей'],
                'ванные комнаты': ['ванна комната', 'ванны комнаты','ванн комнат'],
                'гости': ['гость', 'гостя', 'гостей']
            }
        };

        this.options = {
            ...this.defaultOptions,
            ...customOptions
        }
        
        this.initialFieldData = {
            'гости': 0,
        }

        this.fieldData = {
            ...this.initialFieldData
        };

        // events-----------------------------------------------------
        this.bindEvent();
    
    }

    bindEvent() {
        if (this.typeList.includes(this.type)) {
            this[`${this.type}Handler`]();
        } else {
            document.addEventListener('click', this.hide.bind(this))
            this.dropdown.addEventListener('click', this.handleEvent);
        }
    }

    setNode(node) {
        return this.dom.getNode(this.dropdown, `.dropdown__${node}`);
    }

    handleEvent = (e) => {
        e.stopPropagation();

        if (!this.clickOnEventElment(e)) return

        let funcName = this.getFuncName(e);
        this[funcName](e)
    }

    getFuncName(e) {
        let eventType = this.getEventType(e)[0].toUpperCase() + this.getEventType(e).slice(1)
        return `event${eventType}`
    }

    // Calendar events-------------------------------------------------
    dateHandler() {
        const from = this.dropdown.querySelector('[data-time="from"]');
        const to = this.dropdown.querySelector('[data-time="to"]');
        
        new Calendar(this.dropdown, {
            classes: 'datepicker__date-type_from-to',
            onSelect(formattedDate) {
                from.value = formattedDate.split('-')[0] ?? '';
                to.value = formattedDate.split('-')[1] ?? '';
            }
        })
    }

    filterHandler() {
            new Calendar(this.field, {
                dateFormat: 'dd M',
                classes: 'datepicker__date-type_filter',
                multipleDatesSeparator: ' - ',
            });
    }

    // Default events----------------------------------------
    eventField(e) {
        this.toggle();
    }

    eventChange(e) {
        const btnSub = this.dom.getElement(e, '.dropdown__substract');
        const btnAdd = this.dom.getElement(e, '.dropdown__add');
        const category = this.dom.getElement(e, '.dropdown__category');
        const number = this.dom.getElement(e, '.dropdown__number');

        if (this.getEventValue(e) === 'add') {
            this.sumNumberValue += 1;
            this.add(number, this.field, category.innerHTML);
            this.btnDisabled(false, btnSub);
        }

        if (this.getEventValue(e) === 'sub') {
            if (this.isNumberZero(number)) return;
            this.sumNumberValue -= 1;
            this.sub(number, btnSub, this.field, category.innerHTML);
        }

        // hide/display clear button
        this.displayClearButton(e);
    }
    
    addClass(area, element, className) {
        this.dom.getNode(area, element)
        .classList
        .add(className);
    }

    removeClass(area, element, className) {
        this.dom.getNode(area, element)
        .classList
        .remove(className);
    }

    displayClearButton() {
        if ( this.sumNumberValue !== 0 && this.hasButtons() ) {
            this.addClass(
                this.dropdown, 
                '.dropdown__buttons-wrapper',
                'dropdown__buttons-wrapper_justify_content-space-between')

            this.addClass(
                this.dropdown, 
                '.dropdown__button-clear',
                'dropdown__button-clear_display-true')
        } 
        
        if ( this.sumNumberValue === 0 && this.hasButtons() ) {
            this.removeClass(
                this.dropdown, 
                '.dropdown__buttons-wrapper',
                'dropdown__buttons-wrapper_justify_content-space-between')
            
            this.removeClass(
                this.dropdown, 
                '.dropdown__button-clear',
                'dropdown__button-clear_display-true')
        }
    }

    eventButton(e) {
        if (this.getEventValue(e) === 'apply') {
            this.hide();
        }

        if (this.getEventValue(e) === 'clear') {
            this.reset(e);
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
        }
    }

    changeField(number, field, category, operation) {
        if (this.options.exceptions.includes(category)) {
            
            if (operation === 'add') {
                this.fieldData[this.options.exceptionDeclension] += 1;
            } else {
                this.fieldData[this.options.exceptionDeclension] -= 1;
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
            return this.options.declensions[category][0];
        } else if (amount > 1 && amount < 5) {
            return this.options.declensions[category][1];
        } else {
            return this.options.declensions[category][2];
        }
    }
    
    isNumberZero(number) {
        return Number(number.innerHTML) === 0;
    }

    btnDisabled(boolean, btn) {
        if (boolean) {
            btn.classList.add('dropdown__substract_disabled');
        } else {
            btn.classList.remove('dropdown__substract_disabled');
        }
    }

    clickOnEventElment(e) {
        for (let event in e.target.dataset) {
            if (event) return true;
        }
        return false;
    }

    getEventType(e) {
        for (let data in e.target.dataset) {
            return data;
        }
    }

    getEventValue(e) {
        for (let data in e.target.dataset) {
            return e.target.dataset[data];
        }
    }

    hasButtons() {
        return this.dom.getNode(this.dropdown, '.dropdown__buttons-wrapper');
    }

    hide() {
        this.items.classList.remove('dropdown__items-wrapper_display-true'); 
        this.field.classList.remove('dropdown__field_checked');
    }

    open() {
        this.items.classList.add('dropdown__items-wrapper_display-true');
    }

    toggle() {
        this.items.classList.toggle('dropdown__items-wrapper_display-true');
        this.field.classList.toggle('dropdown__field_checked');
    }

    reset(e) {
        this.field.value = '';

        const btnSubList = this.items.querySelectorAll('span.dropdown__substract');
        const numberList = this.items.querySelectorAll('span.dropdown__number');

        Array.from(numberList).forEach( (number, index) => {
            number.innerHTML = 0;
            this.btnDisabled(true, btnSubList[index]); 
        })
        this.sumNumberValue = 0;
        this.fieldData = {};
        this.displayClearButton();
        this.fieldData = {
            ...this.initialFieldData
        };
    }
}