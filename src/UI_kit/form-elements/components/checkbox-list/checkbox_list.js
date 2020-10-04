class CheckboxList {
    constructor(root)   {
        this.root = root;
        this.extend = document.querySelector('.checkbox-list__extend');
        this.fields = document.querySelector('.checkbox-list__fields-wrapper');   
    }

    bindEvent = () => {
        this.extend.addEventListener('click', this.extendList);
    }

    extendList = () => {
        
        this.fields.classList.toggle('checkbox-list__fields-wrapper_extended');
        this.extend.classList.toggle('checkbox-list__select_extended');
    }
}

new CheckboxList().bindEvent();