import $ from 'jquery'
import throttle from '../../util/throttle'

/**
 * The View. View gets the model from the Presenter and provides
 * the UI events. The handlers on Presenter is attached to these
 * events to handle the user interaction.
 */
class CounterView {
    constructor(element) {
        this._element = element;
        this.presenter = null;
        this.tmpl = `<div class="counter"><input type="number" name="counter" class="counter__input"><div class="btn-group"><button data-name="decrease" class="btn-group__btn btn-group__btn--decrease">-</button><button data-name="increase" class="btn-group__btn btn-group__btn--increase">+</button></div></div><p></p>`
    }

    mount() {
        this.render();
        this.listen();
    }

    setPresenter(presenter) {
        this.presenter = presenter;
    }

    render() {
        $(this._element).html(this.tmpl);
    }


    listen() {
        let decreaseBtn = $(this._element).find('button:first'),
            increaseBtn = $(this._element).find('button:last'),
            input = $(this._element).find('input');

        decreaseBtn.click(throttle(() => {
            this.presenter.onDecreaseBtnClick();
        }, 200));

        increaseBtn.click(throttle(() => {
            this.presenter.onIncreaseBtnClick();
        }, 200));

        input.change((e) => {
            this.presenter.onChange();
        });
    }

    /**
     * Implementation of a Passive View, which can decouple the View
     * from the Presenter a little more.
     * As we don't have the interface construct in JavaScript,
     * we're using more a protocol than an explicit interface here.
     */
    setValue(val) {
        $(this._element).find('input').val(val);
        $(this._element).find('p').html(val);
    }

    getValue() {
        return $(this._element).find("input").val()
    }
}

export default CounterView