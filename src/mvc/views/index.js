import $ from 'jquery'
import EventEmitter2 from 'eventemitter2'
import listenerFactory from '../../util/listenerFactory'
import throttle from '../../util/throttle'

/**
 * The View. View presents the model and provides
 * the UI events. The controller is attached to these
 * events to handle the user interaction.
 */
class CounterView {
    constructor(model, element) {
        this._model = model;
        this._element = element;
        this._server = new EventEmitter2();
        // evt for controller to listen
        this.inputChangeEvt = listenerFactory('inputChange', this._server);
        this.increaseBtnClickEvt = listenerFactory('increaseBtnClickEvt', this._server);
        this.decreaseBtnClickEvt = listenerFactory('decreaseBtnClickEvt', this._server);
        this.tmpl = `<div class="counter"><input type="number" name="counter" class="counter__input"><div class="btn-group"><button data-name="decrease" class="btn-group__btn btn-group__btn--decrease">-</button><button data-name="increase" class="btn-group__btn btn-group__btn--increase">+</button></div></div><p></p>`
    }

    mount() {
        $(this._element).html(this.tmpl);
        this.refresh();
        this.bindEvt();
        this.attachListener();
    }

    refresh() {
        let input = $(this._element).find('input'),
            p = $(this._element).find('p'),
            count = this._model.getCount();

        input.val(count);
        p.html(count);
    }

    handleError(str) {
        return window.alert(str);
    }

    attachListener() {
        this._model.decreaseEvt(this.refresh.bind(this));
        this._model.increaseEvt(this.refresh.bind(this));
        this._model.changeEvt(this.refresh.bind(this));
        this._model.errorEvt(this.handleError.bind(this));
    }

    bindEvt() {
        let decreaseBtn = $(this._element).find('button:first'),
            increaseBtn = $(this._element).find('button:last'),
            input = $(this._element).find('input');

        decreaseBtn.click(throttle(() => {
            this._server.emit('decreaseBtnClickEvt')
        }, 200));

        increaseBtn.click(throttle(() => {
            this._server.emit('increaseBtnClickEvt')
        }, 200));

        input.change((e) => {
            this._server.emit('inputChange', e.target.value);
        });
    }
}

export default CounterView