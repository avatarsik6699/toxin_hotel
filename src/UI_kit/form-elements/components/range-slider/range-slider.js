require("jquery-ui/ui/widgets/slider");
class Slider {
    constructor(root) {
        this.root = root ? $(root) : $('.slider-wrapper');
        this.template = this.createTemplate()
        this.renderTemplate(this.template);
        this.$anchor = $('.slider');
        this.$values = $('.slider__values');
    }
    
    init(options) {
        const defaulOptions = this.getDefaultOptions(options);
        $(this.$anchor).slider({
            ...defaulOptions,
            create: (event, ui) => {
                let sliderValues = this.$anchor.slider('values');
                this.$values.html(`${sliderValues[0]}₽ - ${sliderValues[1]}₽`)
            },
            
            slide: (event, ui) => {      
                this.$values.html(`${ui.values[0]}₽ - ${ui.values[1]}₽`)
            }, 
        })
    }

    renderTemplate(template) {
        this.root.append(template);
    }

    createTemplate() {
        return `
        <span class="slider__values"></span>
        <div class="slider">
        </div>
        `
    }

    getDefaultOptions(options) {
        return {
            range: true,
            min: 0,
            max: 20000,
            values: [5000, 10000],
            classes: {
                "ui-slider": "range-slider",
                "ui-slider-handle": "range-slider__handle",
                "ui-slider-range": "range-slider__range"
            },
            ...options
        }
    }
}

new Slider('.slider-wrapper').init({
    range: true,
    min: 0,
    max: 20000,
    values: [5000, 10000],
    classes: {
        "ui-slider": "range-slider",
        "ui-slider-handle": "range-slider__handle",
        "ui-slider-range": "range-slider__range"
    },
});